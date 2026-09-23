import { neon } from "@neondatabase/serverless";

let cached: ReturnType<typeof neon> | null = null;

export function db() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL n'est pas configuree.");
  }
  if (!cached) cached = neon(process.env.DATABASE_URL);
  return cached;
}
