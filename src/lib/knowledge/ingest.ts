import { createHash } from "node:crypto";
import { db } from "@/lib/db";
import { chunkDocumentText } from "@/lib/knowledge/chunking";

export async function ingestKnowledgeText(args: {
  organizationId:string; projectId?:string|null; userId:string; title:string;
  documentType?:string|null; sourceReference?:string|null; mimeType?:string|null;
  storageUrl?:string|null; text:string; metadata?:Record<string,unknown>;
}) {
  const text=args.text.trim();
  if(!text) throw new Error("Document vide");
  const chunks=chunkDocumentText(text);
  if(!chunks.length) throw new Error("Aucun contenu exploitable");
  const sql=db();
  const sha256=createHash("sha256").update(text).digest("hex");
  const existing=await sql.query<{id:string}>(
    "SELECT id FROM knowledge_documents WHERE organization_id=$1 AND sha256=$2 AND status<>'archived' LIMIT 1",
    [args.organizationId,sha256]
  );
  if(existing[0]) return {documentId:existing[0].id,chunkCount:0,duplicate:true};

  const rows=await sql.query<{id:string}>(
    `INSERT INTO knowledge_documents(organization_id,project_id,title,document_type,source_reference,mime_type,sha256,storage_url,status,metadata,created_by)
     VALUES($1,$2,$3,$4,$5,$6,$7,$8,'processing',$9::jsonb,$10) RETURNING id`,
    [args.organizationId,args.projectId??null,args.title,args.documentType??null,args.sourceReference??null,
     args.mimeType??null,sha256,args.storageUrl??null,JSON.stringify(args.metadata??{}),args.userId]
  );
  const documentId=rows[0].id;
  try{
    for(const chunk of chunks){
      await sql.query(
        `INSERT INTO knowledge_chunks(document_id,organization_id,project_id,chunk_index,heading,content)
         VALUES($1,$2,$3,$4,$5,$6)`,
        [documentId,args.organizationId,args.projectId??null,chunk.index,chunk.heading,chunk.content]
      );
    }
    await sql.query("UPDATE knowledge_documents SET status='ready',updated_at=now() WHERE id=$1",[documentId]);
    return {documentId,chunkCount:chunks.length,duplicate:false};
  }catch(error){
    await sql.query("UPDATE knowledge_documents SET status='failed',updated_at=now() WHERE id=$1",[documentId]);
    throw error;
  }
}
