-- ============================================================
-- 006_security_alerts.sql — alertes interactives
-- Chaque alerte possède un token aléatoire. Les liens « Bloquer »
-- et « Ce n'est pas une attaque » agissent sans connexion :
-- le token lui-même est l'autorisation (capacité).
-- ============================================================
CREATE TABLE IF NOT EXISTS public.security_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token text NOT NULL UNIQUE,
  ip text NOT NULL,
  email text,
  reason text,
  status text NOT NULL DEFAULT 'en_attente',
  created_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz
);

ALTER TABLE public.security_alerts ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.security_alerts FROM anon, authenticated;

CREATE INDEX IF NOT EXISTS idx_security_alerts_token ON public.security_alerts (token);
CREATE INDEX IF NOT EXISTS idx_security_alerts_status ON public.security_alerts (status, created_at DESC);
