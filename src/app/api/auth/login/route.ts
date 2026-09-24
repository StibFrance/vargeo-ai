import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  hashLoginKey,
  hashSessionToken,
  newSessionToken,
  sessionExpiry,
  SESSION_COOKIE,
  verifyPassword,
} from "@/lib/auth";

const MAX_FAILURES = 5;

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Identifiants requis" }, { status: 400 });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const loginKey = hashLoginKey(normalizedEmail);
    const sql = db();

    await sql.query("DELETE FROM login_attempts WHERE created_at < now() - interval '7 days'");
    const failures = await sql.query(
      `SELECT count(*)::int AS n
       FROM login_attempts
       WHERE email_hash=$1 AND succeeded=false AND created_at > now() - interval '15 minutes'`,
      [loginKey]
    );
    if (Number(failures[0]?.n ?? 0) >= MAX_FAILURES) {
      return NextResponse.json(
        { error: "Trop de tentatives. Reessayez dans quelques minutes." },
        { status: 429, headers: { "Retry-After": "900" } }
      );
    }

    const rows = await sql.query(
      "SELECT id,password_hash,is_active,role FROM users WHERE lower(email)=lower($1) LIMIT 1",
      [normalizedEmail]
    );
    const user = rows[0] as { id: string; password_hash: string; is_active: boolean; role: "admin" | "engineer" | "technician" | "client" } | undefined;

    if (!user || !user.is_active || !verifyPassword(String(password), user.password_hash)) {
      await sql.query("INSERT INTO login_attempts(email_hash,succeeded) VALUES($1,false)", [loginKey]);
      return NextResponse.json({ error: "Identifiants invalides" }, { status: 401 });
    }


    await sql.query("DELETE FROM login_attempts WHERE email_hash=$1", [loginKey]);
    await sql.query("DELETE FROM sessions WHERE expires_at<=now()");

    const token = newSessionToken();
    const expires = sessionExpiry();
    await sql.query(
      "INSERT INTO sessions(user_id,token_hash,expires_at) VALUES($1,$2,$3)",
      [user.id, hashSessionToken(token), expires]
    );
    await sql.query(
      `DELETE FROM sessions
       WHERE user_id=$1 AND id NOT IN (
         SELECT id FROM sessions WHERE user_id=$1 ORDER BY created_at DESC LIMIT 10
       )`,
      [user.id]
    );
    await sql.query("UPDATE users SET last_login_at=now(),updated_at=now() WHERE id=$1", [user.id]);

    const res = NextResponse.json({ ok: true });
    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      expires,
    });
    return res;
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
