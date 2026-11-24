// ============================================================
// server/src/middleware/auth.js — garde des routes d'administration
//
// Mode Supabase Auth (quand SUPABASE_URL + clé publishable sont
// définis) : le bearer token est vérifié auprès de Supabase Auth,
// puis l'email est comparé à ADMIN_EMAIL (allowlist stricte :
// n'importe quel compte Supabase ne devient pas admin).
//
// Mode repli (sans Supabase) : JWT local signé avec JWT_SECRET.
// Les deux modes ne sont jamais actifs en même temps (pas de
// contournement par l'ancien JWT quand Supabase est configuré).
// ============================================================
import jwt from 'jsonwebtoken'
import { config } from '../config.js'
import { supabaseAuthEnabled, verifySupabaseToken } from '../services/supabase.js'

function unauthorized(res, message = 'Authentification requise.') {
  return res.status(401).json({ message })
}

export async function requireAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return unauthorized(res)

  if (supabaseAuthEnabled) {
    const user = await verifySupabaseToken(token)
    if (!user) return unauthorized(res, 'Session Supabase expirée ou jeton invalide.')

    const email = String(user.email || '').toLowerCase()
    const allowed = String(config.admin.email || '').toLowerCase()
    if (!email || email !== allowed) {
      return res.status(403).json({ message: 'Ce compte n’est pas autorisé à administrer le site.' })
    }

    /* Contrôle de rôle optionnel : la direction peut restreindre l'accès
       en renseignant ADMIN_ROLES (direction,secrétariat,communication)
       et le champ app_metadata.role des comptes Supabase. */
    const role = user.app_metadata?.role || null
    if (config.admin.roles.length && (!role || !config.admin.roles.includes(role))) {
      return res.status(403).json({ message: 'Votre rôle n’autorise pas cet accès.' })
    }
    req.admin = { id: user.id, email, role }
    return next()
  }

  /* ---------- Mode repli : JWT local ---------- */
  try {
    req.admin = jwt.verify(token, config.jwtSecret)
    next()
  } catch {
    return unauthorized(res, 'Session expirée ou jeton invalide.')
  }
}
