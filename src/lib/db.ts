import { Pool } from "pg";

type DbRow = Record<string, any>;

type AppDb = {
  query<T extends DbRow = DbRow>(text: string, params?: any[]): Promise<T[]>;
};

let pool: Pool | null = null;
let wrapped: AppDb | null = null;

function sslFor(url: string) {
  if (url.includes(".railway.internal") || url.includes("localhost") || url.includes("127.0.0.1")) return false;
  return { rejectUnauthorized: false };
}

export function db(): AppDb {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL n'est pas configuree.");

  if (!pool) {
    pool = new Pool({
      connectionString,
      ssl: sslFor(connectionString),
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });
  }

  if (!wrapped) {
    wrapped = {
      async query<T extends DbRow = DbRow>(text: string, params: any[] = []) {
        const result = await pool!.query(text, params);
        return result.rows as T[];
      },
    };
  }

  return wrapped;
}
