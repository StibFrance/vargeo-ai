import { NextResponse } from "next/server";
import { hashPassword, requireUser } from "@/lib/auth";
import { db } from "@/lib/db";

const roles = new Set(["admin", "engineer", "technician"]);

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    if (user.role !== "admin") return NextResponse.json({ error: "Droit insuffisant" }, { status: 403 });

    const body = await req.json();
    const email = String(body.email ?? "").trim().toLowerCase();
    const name = String(body.name ?? "").trim();
    const role = String(body.role ?? "engineer");
    const password = String(body.password ?? "");

    if (!name || !email.includes("@")) return NextResponse.json({ error: "Nom et e-mail valides requis" }, { status: 400 });
    if (!roles.has(role)) return NextResponse.json({ error: "Role invalide" }, { status: 400 });
    if (password.length < 12) return NextResponse.json({ error: "Le mot de passe doit contenir au moins 12 caracteres" }, { status: 400 });

    const sql = db();
    const existing = await sql.query("SELECT id FROM users WHERE lower(email)=lower($1) LIMIT 1", [email]);
    if (existing[0]) return NextResponse.json({ error: "Un utilisateur utilise deja cet e-mail" }, { status: 409 });

    const rows = await sql.query(
      `INSERT INTO users(organization_id,email,name,password_hash,role,is_active)
       VALUES($1,$2,$3,$4,$5,true)
       RETURNING id,email,name,role,is_active,created_at`,
      [user.organization_id, email, name, hashPassword(password), role]
    );
    await sql.query(
      "INSERT INTO audit_log(organization_id,user_id,action,entity_type,entity_id,details) VALUES($1,$2,'create_user','user',$3,$4::jsonb)",
      [user.organization_id, user.id, rows[0].id, JSON.stringify({ email, role })]
    );
    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Creation utilisateur impossible" }, { status: 500 });
  }
}
