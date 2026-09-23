import { randomBytes, scryptSync } from "node:crypto";
import { neon } from "@neondatabase/serverless";

for (const key of ["DATABASE_URL", "ADMIN_EMAIL", "ADMIN_PASSWORD"]) {
  if (!process.env[key]) throw new Error(`${key} manquant`);
}

function hashPassword(password) {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 64);
  return `scrypt$${salt.toString("hex")}$${hash.toString("hex")}`;
}

const sql = neon(process.env.DATABASE_URL);
const orgRows = await sql.query(
  `INSERT INTO organizations(name, slug)
   VALUES($1,$2)
   ON CONFLICT(slug) DO UPDATE SET name=EXCLUDED.name
   RETURNING id`,
  ["Var Géotechnique", "var-geotechnique"]
);
const organizationId = orgRows[0].id;
const email = process.env.ADMIN_EMAIL.toLowerCase().trim();
const passwordHash = hashPassword(process.env.ADMIN_PASSWORD);

await sql.query(
  `INSERT INTO users(organization_id,email,name,password_hash,role,is_active)
   VALUES($1,$2,$3,$4,'admin',true)
   ON CONFLICT(email) DO UPDATE SET
     organization_id=EXCLUDED.organization_id,
     name=EXCLUDED.name,
     password_hash=EXCLUDED.password_hash,
     role='admin',
     is_active=true,
     updated_at=now()`,
  [organizationId, email, "Administrateur VarGéo.AI", passwordHash]
);

console.log("Administrateur initialise sans afficher le secret.");
