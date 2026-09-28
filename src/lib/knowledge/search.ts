import { db } from "@/lib/db";

export type KnowledgeHit = {
  chunk_id: string;
  document_id: string;
  title: string;
  document_type: string | null;
  source_reference: string | null;
  page_number: number | null;
  heading: string | null;
  content: string;
  score: number;
};

function normalizeQuery(value: string) {
  return value.replace(/[^\p{L}\p{N}\s-]+/gu, " ").split(/\s+/).filter((x) => x.length >= 3).slice(0, 24).join(" ");
}

export async function searchKnowledge(args: { organizationId: string; projectId?: string | null; query: string; limit?: number }) {
  const q = normalizeQuery(args.query);
  if (!q) return [] as KnowledgeHit[];
  const limit = Math.min(Math.max(args.limit ?? 8, 1), 20);
  return db().query<KnowledgeHit>(
    `SELECT kc.id chunk_id,kd.id document_id,kd.title,kd.document_type,kd.source_reference,
            kc.page_number,kc.heading,kc.content,
            ts_rank_cd(kc.content_tsv,websearch_to_tsquery('french',$3))::float8 score
     FROM knowledge_chunks kc JOIN knowledge_documents kd ON kd.id=kc.document_id
     WHERE kc.organization_id=$1
       AND ($2::uuid IS NULL OR kc.project_id=$2::uuid OR kc.project_id IS NULL)
       AND kd.status='ready'
       AND kc.content_tsv @@ websearch_to_tsquery('french',$3)
     ORDER BY score DESC,kc.created_at DESC LIMIT $4`,
    [args.organizationId,args.projectId??null,q,limit]
  );
}

export function knowledgeReferences(hits: KnowledgeHit[]) {
  return hits.map((hit,index)=>({
    title: hit.title,
    source_type: hit.document_type || "document",
    reference: `SRC-${index+1} | ${hit.source_reference || hit.title}${hit.page_number ? ` | page ${hit.page_number}` : ""}\n${hit.content}`,
    version: null
  }));
}
