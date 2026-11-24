// ============================================================
// server/src/routes/auth.js — authentification administrateur
// POST /api/auth/login  → JWT signé (bcrypt en comparaison)
// GET  /api/auth/me     → profil de l'admin connecté
// ============================================================
import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import rateLimit from 'express-rate-limit'
import { config } from '../config.js'
import { getDb } from '../db.js'
import { cleanString } from '../middleware/sanitize.js'
import { requireAuth } from '../middleware/auth.js'
import { supabaseAuthEnabled } from '../services/supabase.js'

const router = Router()

/* Anti-force-brute resserré : 5 tentatives / 15 min / IP sur /login */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Trop de tentatives. Réessayez dans 15 minutes.' },
})

/* Aucune mise en cache des réponses d'authentification */
router.use((_req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private')
  res.set('Pragma', 'no-cache')
  next()
})

/* ---------- Connexion ---------- */
router.post('/login', loginLimiter, async (req, res) => {
  /* En mode Supabase Auth, l'authentification se fait côté client
     avec supabase.auth.signInWithPassword() : le mot de passe ne
     transite jamais par notre API et le token est rafraîchi par le SDK. */
  if (supabaseAuthEnabled) {
    return res.status(400).json({
      message: 'Connectez-vous via Supabase Auth (supabase.auth.signInWithPassword).',
    })
  }

  const email = cleanString(req.body?.email, 200).toLowerCase()
  const password = String(req.body?.password || '')

  const user = getDb().users.find((u) => u.email === email)
  /* bcrypt.compare ne révèle pas l'existence du compte en cas d'échec */
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ message: 'Identifiants incorrects.' })
  }

  const token = jwt.sign({ id: user.id, email: user.email }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  })
  res.json({ token, email: user.email })
})

/* ---------- Profil connecté (protegé) ---------- */
router.get('/me', requireAuth, (req, res) => {
  res.json({ email: req.admin.email, role: req.admin.role || null })
})

export default router
