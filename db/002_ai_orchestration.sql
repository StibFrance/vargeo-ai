CREATE TABLE IF NOT EXISTS ai_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  project_id uuid REFERENCES projects(id) ON DELETE SET NULL,
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  question text NOT NULL,
  mode text NOT NULL DEFAULT 'expert',
  status text NOT NULL CHECK (status IN ('running','completed','partial','failed')) DEFAULT 'running',
  selected_agents text[] NOT NULL DEFAULT '{}',
  final_answer text,
  synthesis_model text,
  error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);
CREATE INDEX IF NOT EXISTS ai_runs_org_idx ON ai_runs(organization_id, created_at DESC);
CREATE INDEX IF NOT EXISTS ai_runs_project_idx ON ai_runs(project_id, created_at DESC);

CREATE TABLE IF NOT EXISTS ai_agent_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id uuid NOT NULL REFERENCES ai_runs(id) ON DELETE CASCADE,
  sequence integer NOT NULL,
  agent_code text NOT NULL,
  agent_name text NOT NULL,
  status text NOT NULL CHECK (status IN ('running','completed','failed')) DEFAULT 'running',
  model text,
  prompt_hash text,
  output text,
  error text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  UNIQUE(run_id, sequence)
);
CREATE INDEX IF NOT EXISTS ai_agent_steps_run_idx ON ai_agent_steps(run_id, sequence);
