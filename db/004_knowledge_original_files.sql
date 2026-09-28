ALTER TABLE knowledge_documents
ADD COLUMN IF NOT EXISTS original_file bytea;
