// ============================================================
// server/src/routes/contact.js — Route /api/contact (public)
//   POST /api/contact  → validation, sauvegarde, envoi email
//   GET  /api/contact/admin (JWT) → liste des messages (admin)
//   DELETE /api/contact/:id (JWT) → suppression
// Sécurité : XSS sanitization + validation + rate limit anti-spam.
// ============================================================
import { Router } from 'express'
import crypto from 'node:crypto'
import rateLimit from 'express-rate-limit'
import { getDb, saveDb, updateDb } from '../db.js'
import { requireAuth } from '../middleware/auth.js'
import { auditRead } from '../middleware/audit.js'
import { sendContactEmail } from '../services/email.js'

const router = Router()

/* Anti-spam : 5 messages de contact / heure / IP */
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Trop de demandes depuis cette adresse. Réessayez plus tard.' },
})

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/* Sanitisation XSS (minimal, déjà nettoyé par validator) */
function cleanText(v) {
  return String(v ?? '').trim().replace(/<[^>]*>/g, '')
}

router.post('/', contactLimiter, async (req, res) => {
  const b = req.body || {}
  const errors = []

  if (!b.name || !cleanText(b.name)) errors.push('Nom complet requis')
  if (!b.email || !EMAIL_RE.test(cleanText(b.email))) errors.push('Email requis')
  if (!b.subject || !cleanText(b.subject)) errors.push('Sujet requis')
  if (!b.message || !cleanText(b.message)) errors.push('Message requis')

  if (errors.length) return res.status(400).json({ success: false, message: errors[0] })

  if (b.phone && String(b.phone).length > 30) errors.push('Téléphone trop long')

  const form = {
    id: crypto.randomUUID(),
    name: cleanText(b.name), email: cleanText(b.email),
    phone: cleanText(b.phone) || null,
    subject: cleanText(b.subject), message: cleanText(b.message),
    acceptedConsent: b.consent === true,
    createdAt: new Date().toISOString(),
  }
  // Une SEULE écriture, incluant acceptedConsent
  await updateDb((db) => { db.contactMessages.unshift(form) })

  /* L'enregistrement est déjà fait : un incident email ne doit pas
     renvoyer une erreur au visiteur (le secrétariat relit la base). */
  let out
  try {
    out = await sendContactEmail(form)
  } catch (err) {
    out = { emailSent: false, emailReason: `Email non envoyé : ${err.message}` }
  }

  res.json({ success: true, message: 'Demande enregistrée. Vous recevrez une réponse par email.', ...out })
})

/* ---------- Admin : liste des messages (JWT) ---------- */
router.get('/admin', requireAuth, auditRead('consultation_messages'), (_req, res) => {
  const db = getDb()
  res.json({ messages: Array.isArray(db.contactMessages) ? db.contactMessages : [] })
})

/* ---------- Admin : marquer traité / non traité (JWT) ---------- */
router.patch('/:id/traite', requireAuth, async (req, res) => {
  if (typeof req.body?.traite !== 'boolean') {
    return res.status(400).json({ message: 'Le champ « traite » doit être un booléen.' })
  }
  const found = await updateDb((db) => {
    const m = db.contactMessages.find((x) => x.id === req.params.id)
    if (!m) return null
    m.traite = req.body.traite
    return m
  })
  if (!found) return res.status(404).json({ message: 'Message introuvable' })
  res.json({ message: 'Statut mis à jour.', item: found })
})

/* ---------- Admin : suppression d'un message (JWT) ---------- */
router.delete('/:id', requireAuth, (req, res) => {
  const db = getDb()
  const idx = db.contactMessages?.findIndex((m) => m.id === req.params.id)
  if (idx < 0 || idx === undefined) return res.status(404).json({ message: 'Message introuvable' })
  db.contactMessages.splice(idx, 1)
  saveDb()
  res.json({ message: 'Supprimé.' })
})

export default router
