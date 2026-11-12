import { Pool, PoolClient } from "pg";

type DbRow = Record<string, any>;

export type AppDb = {
  query<T extends DbRow = DbRow>(text: string, params?: any[]): Promise<T[]>;
};

let pool: Pool | null = null;
let wrapped: AppDb | null = null;

function sslFor(url: string) {
  if (url.includes(".railway.internal") || url.includes("localhost") || url.includes("127.0.0.1")) return false;
  return { rejectUnauthorized: false };
}

function getPool() {
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
  return pool;
}

export function db(): AppDb {
  const current=getPool();
  if (!wrapped) {
    wrapped = {
      async query<T extends DbRow = DbRow>(text: string, params: any[] = []) {
        const result = await current.query(text, params);
        return result.rows as T[];
      },
    };
  }
  return wrapped;
}

export async function withDbTransaction<T>(fn:(tx:AppDb)=>Promise<T>):Promise<T>{
  const client:PoolClient=await getPool().connect();
  const tx:AppDb={query:async <R extends DbRow = DbRow>(text:string,params:any[]=[])=>(await client.query(text,params)).rows as R[]};
  try{
    await client.query("BEGIN");
    const result=await fn(tx);
    await client.query("COMMIT");
    return result;
  }catch(error){
    await client.query("ROLLBACK");
    throw error;
  }finally{
    client.release();
  }
}
