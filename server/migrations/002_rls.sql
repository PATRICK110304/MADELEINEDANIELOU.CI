-- ============================================================
-- 002_rls.sql — durcissement Supabase
-- Les 6 tables sont manipulées par notre API Express via le rôle
-- postgres (DATABASE_URL) : aucune ligne ne doit être lisible
-- directement depuis l'API Data Supabase (anon / authenticated).
-- RLS activé sans politique = refus par défaut. Le propriétaire
-- de table utilisé par l'API n'est pas soumis à RLS.
-- ============================================================
ALTER TABLE users            ENABLE ROW LEVEL SECURITY;
ALTER TABLE inscriptions     ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents        ENABLE ROW LEVEL SECURITY;
ALTER TABLE podcasts         ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos           ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON users            FROM anon, authenticated;
REVOKE ALL ON inscriptions     FROM anon, authenticated;
REVOKE ALL ON documents        FROM anon, authenticated;
REVOKE ALL ON podcasts         FROM anon, authenticated;
REVOKE ALL ON contact_messages FROM anon, authenticated;
REVOKE ALL ON photos           FROM anon, authenticated;
