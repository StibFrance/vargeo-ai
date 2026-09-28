import { NextResponse } from "next/server";
import { requireUser, projectScope } from "@/lib/auth";
import { db } from "@/lib/db";

export const runtime = "nodejs";

function safeFilename(value:string){
  return value.replace(/[\r\n"]/g,"_").replace(/[^\p{L}\p{N}._ -]+/gu,"_").slice(0,180) || "document";
}

export async function GET(_req:Request,{params}:{params:Promise<{id:string}>}){
  const user=await requireUser();
  if(user.role==="client") return NextResponse.json({error:"Droit insuffisant"},{status:403});
  const {id}=await params;
  const scope=projectScope(user,"p",2);
  const rows=await db().query<any>(
    `SELECT kd.original_file,kd.mime_type,kd.metadata,kd.title
     FROM knowledge_documents kd
     JOIN projects p ON p.id=kd.project_id
     WHERE kd.id=$1 AND ${scope.clause}
     LIMIT 1`,
    [id,...scope.params]
  );
  const row=rows[0];
  if(!row) return NextResponse.json({error:"Document introuvable"},{status:404});
  if(!row.original_file) return NextResponse.json({error:"Fichier original indisponible"},{status:404});
  const filename=safeFilename(String(row.metadata?.filename||row.title||"document"));
  return new Response(new Uint8Array(row.original_file),{
    headers:{
      "content-type":row.mime_type||"application/octet-stream",
      "content-disposition":`attachment; filename="${filename}"`,
      "cache-control":"private, no-store"
    }
  });
}
