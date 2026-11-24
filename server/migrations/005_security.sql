-- ============================================================
-- 005_security.sql — événements d'authentification et IP bloquées
-- Tables non exposées : RLS activée sans politique, accès réservé
-- au rôle postgres utilisé par l'API Express.
-- ============================================================
CREATE TABLE IF NOT EXISTS public.auth_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip text NOT NULL,
  email text,
  success boolean NOT NULL,
  counted boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.blocked_ips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip text NOT NULL,
  reason text,
  blocked_until timestamptz NOT NULL,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.auth_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_ips ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.auth_events FROM anon, authenticated;
REVOKE ALL ON public.blocked_ips FROM anon, authenticated;

CREATE INDEX IF NOT EXISTS idx_auth_events_created_at ON public.auth_events (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_auth_events_ip_counted ON public.auth_events (ip, counted, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blocked_ips_active ON public.blocked_ips (ip, active, blocked_until);
