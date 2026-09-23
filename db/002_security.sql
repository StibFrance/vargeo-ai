CREATE TABLE IF NOT EXISTS login_attempts (
  id bigserial PRIMARY KEY,
  email_hash text NOT NULL,
  succeeded boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS login_attempts_email_time_idx ON login_attempts(email_hash, created_at DESC);
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at timestamptz;
