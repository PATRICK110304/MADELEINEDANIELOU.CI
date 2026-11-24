-- ============================================================
-- 003_revoke_rls_auto_enable.sql
-- Fonction interne Supabase (event trigger) : retirer l'exécution
-- publique via RPC pour anon / authenticated / PUBLIC.
-- Aucun comportement applicatif n'est modifié : l'event trigger
-- continue d'agir sur les créations de tables par le propriétaire.
-- ============================================================
REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM PUBLIC;
