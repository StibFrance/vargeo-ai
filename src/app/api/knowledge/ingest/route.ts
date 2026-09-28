import { NextResponse } from "next/server";
import { requireUser, projectScope } from "@/lib/auth";
import { db } from "@/lib/db";
import { extractTextFromFile } from "@/lib/knowledge/parse-file";
import { ingestKnowledgeText } from "@/lib/knowledge/ingest";

export const runtime = "nodejs";

export async function POST(req:Request){
  try{
    const user=await requireUser();
    if(user.role==="client") return NextResponse.json({error:"Droit insuffisant"},{status:403});

    const form=await req.formData();
    const projectId=String(form.get("projectId")||"").trim();
    const title=String(form.get("title")||"").trim();
    const documentType=String(form.get("documentType")||"source").trim();
    const sourceReference=String(form.get("sourceReference")||"").trim()||null;
    const file=form.get("file");

    if(!projectId||!title||!(file instanceof File)) return NextResponse.json({error:"Affaire, titre et fichier requis"},{status:400});
    if(file.size>20*1024*1024) return NextResponse.json({error:"Fichier limité à 20 Mo"},{status:413});

    const scope=projectScope(user,"p",2);
    const project=await db().query<{id:string}>(`SELECT p.id FROM projects p WHERE p.id=$1 AND ${scope.clause} LIMIT 1`,[projectId,...scope.params]);
    if(!project[0]) return NextResponse.json({error:"Affaire non autorisée"},{status:403});

    const text=await extractTextFromFile(file);
    if(text.trim().length<20) return NextResponse.json({error:"Aucun texte exploitable détecté"},{status:422});
    if(text.length>2_500_000) return NextResponse.json({error:"Document trop volumineux après extraction (2,5 millions de caractères maximum)"},{status:413});

    const result=await ingestKnowledgeText({
      organizationId:user.organization_id,
      projectId,
      userId:user.id,
      title,
      documentType,
      sourceReference,
      mimeType:file.type||null,
      text,
      metadata:{filename:file.name,size:file.size}
    });

    const bytes=Buffer.from(await file.arrayBuffer());
    await db().query(
      "UPDATE knowledge_documents SET original_file=COALESCE(original_file,$2),updated_at=now() WHERE id=$1",
      [result.documentId,bytes]
    );

    await db().query(
      `INSERT INTO audit_log(organization_id,user_id,action,entity_type,entity_id,details)
       VALUES($1,$2,'knowledge_ingest','knowledge_document',$3,$4::jsonb)`,
      [user.organization_id,user.id,result.documentId,JSON.stringify({
        projectId,title,filename:file.name,size:file.size,chunkCount:result.chunkCount,
        duplicate:result.duplicate,originalStored:true
      })]
    );

    return NextResponse.json({...result,originalStored:true});
  }catch(error){
    console.error(error);
    return NextResponse.json({error:error instanceof Error?error.message:"Ingestion impossible"},{status:500});
  }
}
