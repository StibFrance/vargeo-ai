CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  email text NOT NULL UNIQUE,
  name text NOT NULL,
  password_hash text NOT NULL,
  role text NOT NULL CHECK (role IN ('admin','engineer','technician','client')) DEFAULT 'engineer',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS sessions_user_idx ON sessions(user_id);
CREATE INDEX IF NOT EXISTS sessions_expiry_idx ON sessions(expires_at);

CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text,
  phone text,
  address text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  client_id uuid REFERENCES clients(id) ON DELETE SET NULL,
  code text NOT NULL,
  title text NOT NULL,
  mission_type text NOT NULL,
  address text,
  city text,
  postal_code text,
  description text,
  status text NOT NULL CHECK (status IN ('draft','active','review','issued','archived')) DEFAULT 'active',
  created_by uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(organization_id, code)
);
CREATE INDEX IF NOT EXISTS projects_org_idx ON projects(organization_id, created_at DESC);

CREATE TABLE IF NOT EXISTS project_members (
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  project_role text NOT NULL DEFAULT 'contributor',
  PRIMARY KEY(project_id, user_id)
);

CREATE TABLE IF NOT EXISTS boreholes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name text NOT NULL,
  x double precision,
  y double precision,
  z double precision,
  depth_m double precision,
  method text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS samples (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  borehole_id uuid NOT NULL REFERENCES boreholes(id) ON DELETE CASCADE,
  depth_from_m double precision NOT NULL,
  depth_to_m double precision NOT NULL,
  description text,
  water_content_pct double precision,
  ip double precision,
  vbs double precision,
  gtr_class text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS pressio_tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  borehole_id uuid NOT NULL REFERENCES boreholes(id) ON DELETE CASCADE,
  depth_m double precision NOT NULL,
  em_mpa double precision,
  pl_mpa double precision,
  p0_mpa double precision,
  pf_mpa double precision,
  source text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  module_code text NOT NULL CHECK (module_code IN ('M1','M2','M3','M4','M5','M6','M7','M8','M9')),
  title text NOT NULL,
  inputs jsonb NOT NULL,
  outputs jsonb NOT NULL,
  standard_refs text[] NOT NULL DEFAULT '{}',
  status text NOT NULL CHECK (status IN ('draft','validated','superseded')) DEFAULT 'draft',
  calculation_version text NOT NULL DEFAULT '1.0.0',
  created_by uuid REFERENCES users(id) ON DELETE SET NULL,
  validated_by uuid REFERENCES users(id) ON DELETE SET NULL,
  validated_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS analyses_project_idx ON analyses(project_id, created_at DESC);

CREATE TABLE IF NOT EXISTS sensor_devices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name text NOT NULL,
  sensor_type text NOT NULL,
  unit text NOT NULL,
  warning_threshold double precision,
  alert_threshold double precision,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sensor_readings (
  id bigserial PRIMARY KEY,
  sensor_id uuid NOT NULL REFERENCES sensor_devices(id) ON DELETE CASCADE,
  measured_at timestamptz NOT NULL,
  value double precision NOT NULL,
  quality text NOT NULL DEFAULT 'ok',
  raw jsonb NOT NULL DEFAULT '{}'::jsonb,
  UNIQUE(sensor_id, measured_at)
);
CREATE INDEX IF NOT EXISTS sensor_readings_idx ON sensor_readings(sensor_id, measured_at DESC);

CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  filename text NOT NULL,
  mime_type text,
  storage_url text,
  sha256 text,
  size_bytes bigint,
  document_type text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  uploaded_by uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  mission_type text NOT NULL,
  title text NOT NULL,
  status text NOT NULL CHECK (status IN ('draft','review','approved','issued')) DEFAULT 'draft',
  current_version integer NOT NULL DEFAULT 1,
  created_by uuid REFERENCES users(id) ON DELETE SET NULL,
  approved_by uuid REFERENCES users(id) ON DELETE SET NULL,
  approved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS report_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id uuid NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  version integer NOT NULL,
  content jsonb NOT NULL,
  ai_generated_sections text[] NOT NULL DEFAULT '{}',
  created_by uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(report_id, version)
);

CREATE TABLE IF NOT EXISTS knowledge_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  title text NOT NULL,
  source_type text NOT NULL,
  reference text,
  version text,
  status text NOT NULL DEFAULT 'active',
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS audit_log (
  id bigserial PRIMARY KEY,
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id text,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS audit_log_idx ON audit_log(organization_id, created_at DESC);
