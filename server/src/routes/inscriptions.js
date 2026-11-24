// ============================================================
// server/src/routes/inscriptions.js — pré-inscriptions en ligne
// POST /api/inscriptions        (public)  → n° de dossier unique
// GET  /api/inscriptions/admin  (JWT)     → liste des dossiers
// DELETE /api/inscriptions/:id  (JWT)     → suppression d'un dossier
// Sécurité : sanitisation XSS, validation, reCAPTCHA v3,
// limiteur de débit anti-spam.
// ============================================================
import { Router } from 'express'
import crypto from 'node:crypto'
import https from 'node:https'
import rateLimit from 'express-rate-limit'
import { getDb, saveDb, updateDb } from '../db.js'
import { cleanString } from '../middleware/sanitize.js'
import { requireAuth } from '../middleware/auth.js'
import { auditRead } from '../middleware/audit.js'
import { config } from '../config.js'

const router = Router()

/* Anti-spam : 6 pré-inscriptions / heure / IP */
const inscribeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 6,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Trop de demandes depuis cette adresse. Réessayez plus tard.' },
})

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/* ---------- reCAPTCHA v3 (serveur → Google) ---------- */
function verifyRecaptcha(token) {
  return new Promise((resolve) => {
    // Pas de secret configuré (dev) → vérification ignorée
    if (!config.recaptchaSecret) return resolve(true)
    if (!token) return resolve(false) // secret exigé mais token absent

    const body = new URLSearchParams({ secret: config.recaptchaSecret, response: token })
    const req = https.request(
      {
        hostname: 'www.google.com',
        path: '/recaptcha/api/siteverify',
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      },
      (res) => {
        let data = ''
        res.on('data', (c) => (data += c))
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data)
            // Score minimal 0.5 (v3) + action validée
            resolve(parsed.success && (!parsed.score || parsed.score >= 0.5))
          } catch {
            resolve(false)
          }
        })
      },
    )
    req.on('error', () => resolve(false))
    req.write(body.toString())
    req.end()
  })
}

/* ---------- Création d'un dossier (public) ---------- */
router.post('/', inscribeLimiter, async (req, res) => {
  const b = req.body || {}

  // 1) reCAPTCHA v3
  const captchaOk = await verifyRecaptcha(b.recaptchaToken)
  if (!captchaOk) {
    return res.status(403).json({ message: 'Vérification anti-spam (reCAPTCHA) échouée.' })
  }

  // 2) Validation des champs obligatoires
  const errors = []
  if (!b.elevePrenom) errors.push('Prénom de l’élève requis.')
  if (!b.eleveNom) errors.push('Nom de l’élève requis.')
  if (!b.naissance) errors.push('Date de naissance requise.')
  if (!b.classe) errors.push('Classe demandée requise.')
  if (!b.parentNom) errors.push('Nom du responsable requis.')
  if (!EMAIL_RE.test(b.email || '')) errors.push('Adresse e-mail invalide.')
  if (String(b.telephone || '').replace(/\D/g, '').length < 8) errors.push('Numéro de téléphone invalide.')
  if (b.consent !== true && b.consent !== 'true') errors.push('Consentement requis.')
  if (errors.length) {
    return res.status(422).json({ message: errors[0], errors })
  }

  // 3) Génération du numéro de dossier UNIQUE : INS-<année>-<6 hex>
  const year = new Date().getFullYear()
  let reference
  const db = getDb()
  do {
    reference = `INS-${year}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`
  } while (db.inscriptions.some((i) => i.reference === reference))

  // 4) Enregistrement (champs déjà sanités par sanitizeBody)
  const dossier = {
    id: crypto.randomUUID(),
    reference,
    elevePrenom: b.elevePrenom,
    eleveNom: b.eleveNom,
    naissance: b.naissance,
    classe: b.classe,
    origine: b.origine || '',
    parentNom: b.parentNom,
    lien: b.lien || '',
    email: b.email.toLowerCase(),
    telephone: b.telephone,
    adresse: b.adresse || '',
    message: b.message || '',
    status: 'nouveau',
    createdAt: new Date().toISOString(),
  }
  db.inscriptions.push(dossier)
  saveDb()

  // 5) Confirmation : seul le n° de dossier est renvoyé au public
  res.status(201).json({ reference, message: 'Pré-inscription enregistrée.' })
})

/* ---------- Liste des dossiers (administration) ---------- */
router.get('/admin', requireAuth, auditRead('consultation_dossiers'), (_req, res) => {
  const items = [...getDb().inscriptions].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  res.json({ items })
})

/* ---------- Changement de statut (administration) ---------- */
const STATUTS = ['nouveau', 'en_attente', 'validee', 'refusee']
router.patch('/:id/statut', requireAuth, async (req, res) => {
  const statut = req.body?.statut
  if (!STATUTS.includes(statut)) {
    return res.status(400).json({ message: `Statut invalide. Valeurs acceptées : ${STATUTS.join(', ')}.` })
  }
  const item = await updateDb((db) => {
    const d = db.inscriptions.find((x) => x.id === req.params.id)
    if (d) d.status = statut
    return d || null
  })
  if (!item) return res.status(404).json({ message: 'Dossier introuvable.' })
  res.json({ item, message: 'Statut mis à jour.' })
})

/* ---------- Suppression d'un dossier (administration) ---------- */
router.delete('/:id', requireAuth, (req, res) => {
  const db = getDb()
  const before = db.inscriptions.length
  db.inscriptions = db.inscriptions.filter((i) => i.id !== req.params.id)
  if (db.inscriptions.length === before) {
    return res.status(404).json({ message: 'Dossier introuvable.' })
  }
  saveDb()
  res.json({ message: 'Dossier supprimé.' })
})

export default router
