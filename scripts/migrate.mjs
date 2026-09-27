import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const { Client } = pg;
const connectionString = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL_UNPOOLED ou DATABASE_URL manquant");

const ssl = connectionString.includes(".railway.internal") || connectionString.includes("localhost") || connectionString.includes("127.0.0.1")
  ? false
  : { rejectUnauthorized: false };

const client = new Client({ connectionString, ssl });
await client.connect();

try {
  await client.query(`CREATE TABLE IF NOT EXISTS schema_migrations (
    filename text PRIMARY KEY,
    applied_at timestamptz NOT NULL DEFAULT now()
  )`);

  const dbDir = fileURLToPath(new URL("../db/", import.meta.url));
  const files = (await readdir(dbDir)).filter((name) => /^\d+.*\.sql$/.test(name)).sort();
  let applied = 0;

  for (const filename of files) {
    const exists = await client.query("SELECT 1 FROM schema_migrations WHERE filename=$1", [filename]);
    if (exists.rows[0]) continue;

    const migration = await readFile(join(dbDir, filename), "utf8");
    const statements = migration
      .split(/;\s*(?:\n|$)/g)
      .map((s) => s.trim())
      .filter(Boolean);

    await client.query("BEGIN");
    try {
      for (const statement of statements) await client.query(statement);
      await client.query("INSERT INTO schema_migrations(filename) VALUES($1)", [filename]);
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    }

    console.log(`Migration appliquee: ${filename} (${statements.length} instructions)`);
    applied += 1;
  }

  console.log(`Migrations terminees: ${applied} nouvelle(s), ${files.length} fichier(s) connu(s).`);
} finally {
  await client.end();
}
