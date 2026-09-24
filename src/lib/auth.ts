import { createHash, createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export const SESSION_COOKIE = "vargeo_session";
const SESSION_DAYS = 7;

export type UserRole = "admin" | "engineer" | "technician" | "client";
export type CurrentUser = {
  id: string;
  organization_id: string;
  email: string;
  name: string;
  role: UserRole;
};

function authSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("AUTH_SECRET doit contenir au moins 32 caracteres.");
  }
  return secret;
}

export function hashPassword(password: string, saltHex?: string) {
  const salt = saltHex ? Buffer.from(saltHex, "hex") : randomBytes(16);
  const hash = scryptSync(password, salt, 64);
  return `scrypt$${salt.toString("hex")}$${hash.toString("hex")}`;
}

export function verifyPassword(password: string, stored: string) {
  const [algo, saltHex, hashHex] = stored.split("$");
  if (algo !== "scrypt" || !saltHex || !hashHex) return false;
  const expected = Buffer.from(hashHex, "hex");
  const actual = scryptSync(password, Buffer.from(saltHex, "hex"), expected.length);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export function hashSessionToken(token: string) {
  return createHash("sha256").update(`${authSecret()}:${token}`).digest("hex");
}

export function hashLoginKey(email: string) {
  return createHmac("sha256", authSecret()).update(email.trim().toLowerCase()).digest("hex");
}

export function newSessionToken() {
  return randomBytes(32).toString("base64url");
}

export function sessionExpiry() {
  return new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
}

export function isInternalRole(role: UserRole) {
  return role === "admin" || role === "engineer" || role === "technician";
}

export function projectScope(user: CurrentUser, alias = "p", paramOffset = 1) {
  if (user.role === "client") {
    return {
      clause: `${alias}.organization_id=${paramOffset} AND EXISTS (SELECT 1 FROM project_members pm WHERE pm.project_id=${alias}.id AND pm.user_id=${paramOffset + 1})`,
      params: [user.organization_id, user.id] as unknown[],
    };
  }
  return {
    clause: `${alias}.organization_id=${paramOffset}`,
    params: [user.organization_id] as unknown[],
  };
}

export function canValidate(role: UserRole) {
  return role === "admin" || role === "engineer";
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const tokenHash = hashSessionToken(token);
  const sql = db();
  const rows = await sql.query(
    `SELECT u.id,u.organization_id,u.email,u.name,u.role
     FROM sessions s
     JOIN users u ON u.id=s.user_id
     WHERE s.token_hash=$1 AND s.expires_at>now() AND u.is_active=true
     LIMIT 1`,
    [tokenHash]
  );
  return (rows[0] as CurrentUser | undefined) ?? null;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
    throw new Error("UNREACHABLE");
  }
  return user;
}
