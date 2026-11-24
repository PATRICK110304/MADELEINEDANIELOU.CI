// ============================================================
// server/src/services/supabase.js — client serveur Supabase Auth
//
// Uniquement la clé PUBLISHABLE : elle est conçue pour être publique.
// Aucune clé secrète / service_role n'est utilisée ni stockée ici.
// getUser(jwt) interroge le serveur Auth : le résultat est authentique
// et peut servir à une décision d'autorisation (contrairement aux
// claims user_metadata, modifiables par l'utilisateur).
// ============================================================
import { createClient } from '@supabase/supabase-js'
import { config } from '../config.js'

export const supabaseAuthEnabled = Boolean(
  config.supabase.url && config.supabase.publishableKey,
)

export const supabase = supabaseAuthEnabled
  ? createClient(config.supabase.url, config.supabase.publishableKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  : null

/**
 * Vérifie un access token JWT auprès de Supabase Auth.
 * @returns {object|null} l'utilisateur authentifié, ou null
 */
export async function verifySupabaseToken(token) {
  if (!supabase || !token) return null
  try {
    const { data, error } = await supabase.auth.getUser(token)
    if (error || !data?.user) return null
    return data.user
  } catch {
    return null
  }
}
