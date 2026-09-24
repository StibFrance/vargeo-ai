import { neon } from "@neondatabase/serverless";

let cached: ReturnType<typeof neon> | null = null;

type DbRow = Record<string, any>;

type AppDb = {
  query<T extends DbRow = DbRow>(text: string, params?: any[]): Promise<T[]>;
};

let wrapped: AppDb | null = null;

export function db(): AppDb {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL n'est pas configuree.");
  }

  if (!cached) cached = neon(process.env.DATABASE_URL);

  if (!wrapped) {
    wrapped = {
      async query<T extends DbRow = DbRow>(text: string, params: any[] = []) {
        const result = await cached!.query(text, params);
        return result as unknown as T[];
      },
    };
  }

  return wrapped;
}
