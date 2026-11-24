// ============================================================
// client/src/services/adminAuth.ts — connexion de l'administration
//
// Avec Supabase Auth : le SDK gère la session et le renouvellement
// automatique du JWT ; notre API ne reçoit que le access_token
// en Bearer et le vérifie auprès de Supabase (middleware requireAuth).
// Sans Supabase : repli sur l'ancien POST /api/auth/login (JWT local).
// ============================================================
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { API_BASE } from './api'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined

export const supabaseAuthEnabled = Boolean(url && publishableKey)

export const supabase: SupabaseClient | null = supabaseAuthEnabled
  ? createClient(url!, publishableKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
      },
    })
  : null

export const TOKEN_KEY = 'gsmd_admin_token'

/** Connecte l'administrateur et retourne un access_token à jour. */
export async function loginAdmin(email: string, password: string): Promise<string> {
  if (supabase) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw new Error(error.message)
    const token = data.session?.access_token
    if (!token) throw new Error('Session invalide')
    sessionStorage.setItem(TOKEN_KEY, token)
    return token
  }

  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Connexion refusée')
  sessionStorage.setItem(TOKEN_KEY, data.token)
  return data.token as string
}

/** Token courant, rafraîchi par le SDK Supabase si nécessaire. */
export async function getAdminToken(): Promise<string | null> {
  if (supabase) {
    const { data } = await supabase.auth.getSession()
    const token = data.session?.access_token ?? null
    if (token) sessionStorage.setItem(TOKEN_KEY, token)
    return token
  }
  return sessionStorage.getItem(TOKEN_KEY)
}

/** Déconnexion : session Supabase + jeton local. */
export async function logoutAdmin(): Promise<void> {
  if (supabase) await supabase.auth.signOut()
  sessionStorage.removeItem(TOKEN_KEY)
}
