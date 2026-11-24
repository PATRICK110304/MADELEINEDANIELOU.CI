// ============================================================
// server/src/routes/audit.js — traçabilité des exports
// POST /api/audit/export (JWT) → journalise un export CSV/route.
// ============================================================
import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { logAudit } from '../services/audit.js'

const router = Router()

router.post('/export', requireAuth, async (req, res) => {
  const format = String(req.body?.format || 'csv').slice(0, 20)
  const count = Number(req.body?.count) || 0
  await logAudit('export_donnees', req.admin?.email, `${format} — ${count} ligne(s)`)
  res.json({ ok: true })
})

export default router
