// ============================================================
// server/src/routes/documents.js — fiches PDF
// GET /api/documents · POST · PUT /:id · DELETE /:id (JWT)
// Stockage : local (server/public/documents) ou Cloudinary.
// ============================================================
import { Router } from 'express'
import crypto from 'node:crypto'
import path from 'node:path'
import multer from 'multer'
import { config } from '../config.js'
import { getDb, saveDb } from '../db.js'
import { saveFile, deleteFile } from '../services/storage.js'
import { cleanString } from '../middleware/sanitize.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

/* Le fichier est gardé en mémoire : on décide du stockage après
   validation (et on peut convertir les images avant envoi). */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: config.uploadMaxMb * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true)
    else cb(new Error('TYPE_REFUSE : seul le format PDF est accepté.'))
  },
})

function safeName(originalname) {
  const base = path.parse(originalname).name
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z0-9-_]+/g, '-').slice(0, 60)
  return `${base || 'document'}-${crypto.randomBytes(3).toString('hex')}.pdf`
}

/* ---------- Liste publique ---------- */
router.get('/', (_req, res) => {
  res.json({ items: getDb().documents })
})

/* ---------- Ajout (administration) ---------- */
router.post('/', requireAuth, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Fichier PDF requis (champ "file").' })
  try {
    const stored = await saveFile({
      buffer: req.file.buffer,
      folder: 'documents',
      filename: safeName(req.file.originalname),
      resourceType: 'raw',
    })
    const doc = {
      id: crypto.randomUUID(),
      section: ['college', 'lycee', 'commun'].includes(req.body.section) ? req.body.section : 'commun',
      title: cleanString(req.body.title, 200) || req.file.originalname,
      url: stored.url,
      size: stored.size,
      uploadedAt: new Date().toISOString(),
    }
    getDb().documents.push(doc)
    await saveDb()
    res.status(201).json({ item: doc, message: 'Fiche ajoutée.' })
  } catch (err) {
    res.status(502).json({ message: `Stockage impossible : ${err.message}` })
  }
})

/* ---------- Remplacement / mise à jour ---------- */
router.put('/:id', requireAuth, upload.single('file'), async (req, res) => {
  const doc = getDb().documents.find((d) => d.id === req.params.id)
  if (!doc) return res.status(404).json({ message: 'Fiche introuvable.' })
  try {
    if (req.file) {
      const oldUrl = doc.url
      const stored = await saveFile({
        buffer: req.file.buffer,
        folder: 'documents',
        filename: safeName(req.file.originalname),
        resourceType: 'raw',
      })
      doc.url = stored.url
      doc.size = stored.size
      await deleteFile(oldUrl)
    }
    if (req.body.title) doc.title = cleanString(req.body.title, 200)
    if (req.body.section && ['college', 'lycee', 'commun'].includes(req.body.section)) {
      doc.section = req.body.section
    }
    await saveDb()
    res.json({ item: doc, message: 'Fiche mise à jour.' })
  } catch (err) {
    res.status(502).json({ message: `Stockage impossible : ${err.message}` })
  }
})

/* ---------- Suppression ---------- */
router.delete('/:id', requireAuth, async (req, res) => {
  const db = getDb()
  const doc = db.documents.find((d) => d.id === req.params.id)
  if (!doc) return res.status(404).json({ message: 'Fiche introuvable.' })
  db.documents = db.documents.filter((d) => d.id !== doc.id)
  await saveDb()
  await deleteFile(doc.url)
  res.json({ message: 'Fiche supprimée.' })
})

export default router
