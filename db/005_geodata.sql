CREATE TABLE IF NOT EXISTS stratigraphy_layers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  borehole_id uuid NOT NULL REFERENCES boreholes(id) ON DELETE CASCADE,
  depth_from_m double precision NOT NULL,
  depth_to_m double precision NOT NULL,
  family text NOT NULL,
  description text NOT NULL,
  source text NOT NULL DEFAULT 'measured' CHECK (source IN ('measured','interpreted')),
  note text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (depth_to_m > depth_from_m)
);
CREATE INDEX IF NOT EXISTS stratigraphy_layers_borehole_idx ON stratigraphy_layers(borehole_id, depth_from_m);

CREATE TABLE IF NOT EXISTS groundwater_observations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  borehole_id uuid NOT NULL REFERENCES boreholes(id) ON DELETE CASCADE,
  depth_m double precision NOT NULL,
  observed_at timestamptz,
  observation_type text NOT NULL DEFAULT 'observed',
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS groundwater_borehole_idx ON groundwater_observations(borehole_id, observed_at DESC NULLS LAST);

CREATE UNIQUE INDEX IF NOT EXISTS boreholes_project_name_uidx ON boreholes(project_id, name);