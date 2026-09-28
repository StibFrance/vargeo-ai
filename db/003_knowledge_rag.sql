CREATE TABLE IF NOT EXISTS knowledge_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  title text NOT NULL,
  document_type text,
  source_reference text,
  mime_type text,
  sha256 text,
  storage_url text,
  status text NOT NULL CHECK (status IN ('processing','ready','failed','archived')) DEFAULT 'processing',
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_by uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS knowledge_documents_org_idx ON knowledge_documents(organization_id, created_at DESC);
CREATE INDEX IF NOT EXISTS knowledge_documents_project_idx ON knowledge_documents(project_id, created_at DESC);

CREATE TABLE IF NOT EXISTS knowledge_chunks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid NOT NULL REFERENCES knowledge_documents(id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  chunk_index integer NOT NULL,
  page_number integer,
  heading text,
  content text NOT NULL,
  content_tsv tsvector GENERATED ALWAYS AS (to_tsvector('french', coalesce(heading,'') || ' ' || content)) STORED,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(document_id, chunk_index)
);
CREATE INDEX IF NOT EXISTS knowledge_chunks_org_idx ON knowledge_chunks(organization_id, created_at DESC);
CREATE INDEX IF NOT EXISTS knowledge_chunks_project_idx ON knowledge_chunks(project_id, created_at DESC);
CREATE INDEX IF NOT EXISTS knowledge_chunks_tsv_idx ON knowledge_chunks USING gin(content_tsv);
