// ============================================================
// server/src/routes/documents.js — gestion des fiches PDF
// GET    /api/documents      (public)  → liste des fiches
// POST   /api/documents      (JWT)     → ajout (upload PDF via multer)
// PUT    /api/documents/:id  (JWT)     → remplacer fichier/métadonnées
// DELETE /api/documents/:id  (JWT)     → suppression (fichier + fiche)
// Stockage : server/public/documents/  (servi à l'URL /documents/…)
// ============================================================
import { Router } from 'express'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import multer from 'multer'
import { config } from '../config.js'
import { getDb, saveDb } from '../db.js'
import { cleanString } from '../middleware/sanitize.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

/* Dossier de stockage des PDF (créé si absent) */
fs.mkdirSync(config.documentsDir, { recursive: true })

/* Multer : PDF uniquement, nommage sûr, taille plafonnée */
const upload = multer({
  storage: multer.diskStorage({
    destination: config.documentsDir,
    filename: (_req, file, cb) => {
      // Slug sûr : base nettoyée + suffixe unique
      const base = path.parse(file.originalname).name
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // retire accents
        .toLowerCase().replace(/[^a-z0-9-_]+/g, '-').slice(0, 60)
      cb(null, `${base}-${crypto.randomBytes(3).toString('hex')}.pdf`)
    },
  }),
  limits: { fileSize: config.uploadMaxMb * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true)
    else cb(new Error('TYPE_REFUSE : seul le format PDF est accepté.'))
  },
})

/* ---------- Liste publique ---------- */
router.get('/', (_req, res) => {
  res.json({ items: getDb().documents })
})

/* ---------- Ajout d'une fiche (administration) ---------- */
router.post('/', requireAuth, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Fichier PDF requis (champ "file").' })

  const doc = {
    id: crypto.randomUUID(),
    section: ['college', 'lycee', 'commun'].includes(req.body.section) ? req.body.section : 'commun',
    title: cleanString(req.body.title, 200) || req.file.originalname,
    url: `/documents/${req.file.filename}`,
    size: req.file.size,
    uploadedAt: new Date().toISOString(),
  }
  getDb().documents.push(doc)
  saveDb()
  res.status(201).json({ item: doc, message: 'Fiche ajoutée.' })
})

/* ---------- Remplacement / mise à jour (administration) ---------- */
router.put('/:id', requireAuth, upload.single('file'), (req, res) => {
  const db = getDb()
  const doc = db.documents.find((d) => d.id === req.params.id)
  if (!doc) return res.status(404).json({ message: 'Fiche introuvable.' })

  // Remplacement du fichier physique (ancien supprimé)
  if (req.file) {
    const oldPath = path.join(config.documentsDir, path.basename(doc.url))
    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath)
    doc.url = `/documents/${req.file.filename}`
    doc.size = req.file.size
  }
  if (req.body.title) doc.title = cleanString(req.body.title, 200)
  if (req.body.section && ['college', 'lycee', 'commun'].includes(req.body.section)) {
    doc.section = req.body.section
  }
  saveDb()
  res.json({ item: doc, message: 'Fiche mise à jour.' })
})

/* ---------- Suppression (administration) ---------- */
router.delete('/:id', requireAuth, (req, res) => {
  const db = getDb()
  const doc = db.documents.find((d) => d.id === req.params.id)
  if (!doc) return res.status(404).json({ message: 'Fiche introuvable.' })

  const filePath = path.join(config.documentsDir, path.basename(doc.url))
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
  db.documents = db.documents.filter((d) => d.id !== doc.id)
  saveDb()
  res.json({ message: 'Fiche supprimée.' })
})

export default router
