// ============================================================
// server/src/middleware/auth.js — garde des routes d'administration
//
// Mode Supabase Auth (quand SUPABASE_URL + clé publishable sont
// définis) : le bearer token est vérifié auprès de Supabase Auth,
// puis l'email est comparé à ADMIN_EMAIL (allowlist stricte).
//
// Mode repli (sans Supabase) : JWT local signé avec JWT_SECRET.
// Les deux modes ne sont jamais actifs en même temps.
//
// Sécurité ajoutée : vérification IP bloquée + comptage des échecs.
// ============================================================
import jwt from 'jsonwebtoken'
import { config } from '../config.js'
import { supabaseAuthEnabled, verifySupabaseToken } from '../services/supabase.js'
import { isBlocked, recordAuth } from '../services/security.js'

function clientIp(req) {
  return req.ip || req.headers['x-forwarded-for']?.split(',')[0]?.trim() || null
}

function unauthorized(res, message = 'Authentification requise.') {
  return res.status(401).json({ message })
}

async function fail(req, res, message) {
  const ip = clientIp(req)
  const result = await recordAuth(ip, null, false)
  if (result.blocked) {
    return res.status(403).json({ message: 'Trop de tentatives échouées. Accès temporairement bloqué.' })
  }
  return unauthorized(res, message)
}

export async function requireAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return fail(req, res)

  const ip = clientIp(req)
  if (await isBlocked(ip)) {
    return res.status(403).json({ message: 'Adresse IP temporairement bloquée. Réessayez plus tard.' })
  }

  if (supabaseAuthEnabled) {
    const user = await verifySupabaseToken(token)
    if (!user) return fail(req, res, 'Session Supabase expirée ou jeton invalide.')

    const email = String(user.email || '').toLowerCase()
    const allowed = String(config.admin.email || '').toLowerCase()
    if (!email || email !== allowed) {
      return fail(req, res, 'Ce compte n’est pas autorisé à administrer le site.')
    }

    const role = user.app_metadata?.role || null
    if (config.admin.roles.length && (!role || !config.admin.roles.includes(role))) {
      return fail(req, res, 'Votre rôle n’autorise pas cet accès.')
    }

    await recordAuth(ip, email, true)
    req.admin = { id: user.id, email, role }
    return next()
  }

  /* ---------- Mode repli : JWT local ---------- */
  try {
    const payload = jwt.verify(token, config.jwtSecret)
    await recordAuth(ip, payload.email, true)
    req.admin = payload
    next()
  } catch {
    return fail(req, res, 'Session expirée ou jeton invalide.')
  }
}
