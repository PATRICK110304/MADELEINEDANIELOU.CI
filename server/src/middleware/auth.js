// ============================================================
// server/src/middleware/auth.js — garde JWT pour les routes
// d'administration (CRUD documents, podcasts, dossiers).
// ============================================================
import jwt from 'jsonwebtoken'
import { config } from '../config.js'

/**
 * Vérifie l'en-tête "Authorization: Bearer <token>" et décode le JWT.
 * Attache le payload décodé à req.admin.
 */
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) {
    return res.status(401).json({ message: 'Authentification requise.' })
  }
  try {
    req.admin = jwt.verify(token, config.jwtSecret)
    next()
  } catch {
    return res.status(401).json({ message: 'Session expirée ou jeton invalide.' })
  }
}
