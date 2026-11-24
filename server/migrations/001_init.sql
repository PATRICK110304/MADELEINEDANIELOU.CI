-- ============================================================
-- 001_init.sql — Schéma GSMD (6 tables, snake_case)
-- Exécuter : psql "$DATABASE_URL" -f server/migrations/001_init.sql
-- ============================================================
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS inscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference text NOT NULL UNIQUE,
  eleve_prenom text NOT NULL,
  eleve_nom text NOT NULL,
  naissance text,
  classe text NOT NULL,
  origine text,
  parent_nom text NOT NULL,
  lien text,
  email text NOT NULL,
  telephone text,
  adresse text,
  message text,
  status text NOT NULL DEFAULT 'nouveau',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section text NOT NULL,
  title text NOT NULL,
  url text NOT NULL,
  size bigint NOT NULL DEFAULT 0,
  uploaded_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS podcasts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  duration text,
  url text NOT NULL,
  size bigint NOT NULL DEFAULT 0,
  uploaded_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text NOT NULL,
  message text NOT NULL,
  accepted_consent boolean NOT NULL DEFAULT false,
  traite boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section text NOT NULL,
  title text NOT NULL,
  description text,
  url text NOT NULL,
  size bigint NOT NULL DEFAULT 0,
  orientation text NOT NULL,
  width integer NOT NULL,
  height integer NOT NULL,
  featured boolean NOT NULL DEFAULT false,
  uploaded_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_inscriptions_created_at ON inscriptions (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_created_at ON contact_messages (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_photos_section ON photos (section);
