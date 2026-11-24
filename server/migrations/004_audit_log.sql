-- ============================================================
-- 004_audit_log.sql — journal des consultations et exports admin
-- Table non exposée : RLS activée sans politique, accès réservé
-- au rôle postgres utilisé par l'API Express (DATABASE_URL).
-- ============================================================
CREATE TABLE IF NOT EXISTS public.audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action text NOT NULL,
  actor_email text,
  detail text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.audit_log FROM anon, authenticated;

CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON public.audit_log (created_at DESC);
