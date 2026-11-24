// ============================================================
// server/src/routes/security.js — pilotage de la sécurité
// Toutes les routes sont protégées par requireAuth (JWT Supabase).
// ============================================================
import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { requireAuth } from '../middleware/auth.js'
import { runSentinel } from '../services/sentinel.js'
import { unblock } from '../services/security.js'
import { pool } from '../db.js'

const router = Router()
const limiter = rateLimit({ windowMs: 60 * 1000, limit: 4, standardHeaders: true, legacyHeaders: false })

router.post('/sentinel/run', limiter, requireAuth, async (_req, res) => {
  res.json(await runSentinel())
})

router.get('/blocks', requireAuth, async (_req, res) => {
  const { rows } = await pool.query(
    `SELECT ip, reason, blocked_until, active, created_at
     FROM public.blocked_ips WHERE active=true AND blocked_until > now()
     ORDER BY blocked_until DESC LIMIT 50`,
  )
  res.json({ items: rows })
})

router.post('/unblock', requireAuth, async (req, res) => {
  const ip = String(req.body?.ip || '').trim()
  if (!/^[0-9a-fA-F:.]+$/.test(ip)) return res.status(400).json({ message: 'Adresse IP invalide.' })
  const ok = await unblock(ip)
  res.json({ ok, message: ok ? 'IP débloquée.' : 'Aucun blocage actif pour cette IP.' })
})

export default router
