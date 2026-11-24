// ============================================================
// server/src/routes/photos.js — Galerie photos intelligente
// GET    /api/photos?section=...  (public)
// POST   /api/photos              (JWT, upload photo → WebP traité)
// PUT    /api/photos/:id          (JWT, métadonnées / featured)
// DELETE /api/photos/:id          (JWT, fichier + fiche)
// Champs db.json : id, section, title, description, url, size,
// orientation, width, height, featured, uploadedAt
// ============================================================
import { Router } from 'express'
import path from 'node:path'
import crypto from 'node:crypto'
import multer from 'multer'
import { config } from '../config.js'
import { getDb, updateDb } from '../db.js'
import { saveFile, deleteFile } from '../services/storage.js'
import { cleanString } from '../middleware/sanitize.js'
import { requireAuth } from '../middleware/auth.js'
import { processPhoto, suggestSection } from '../services/photos.js'

const router = Router()

const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif', 'image/avif'])
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: config.uploadMaxMb * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED.has(file.mimetype)) cb(null, true)
    else cb(new Error('TYPE_REFUSE : formats acceptés JPEG, PNG, WebP, HEIC, AVIF.'))
  },
})

const SECTIONS = ['vie-scolaire', 'ceremonies', 'culture', 'sport', 'autres']

/* ---------- Liste publique (filtrable par section) ---------- */
router.get('/', (req, res) => {
  const section = cleanString(req.query.section, 60)
  let items = [...getDb().photos].sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt))
  if (section && section !== 'all') items = items.filter((p) => p.section === section)
  res.json({ items })
})

/* ---------- Ajout (JWT, traitement sharp) ---------- */
router.post('/', requireAuth, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Fichier photo requis (champ « file »).' })
  try {
    const out = await processPhoto(req.file.buffer, req.file.originalname)
    const stored = await saveFile({
      buffer: out.buffer,
      folder: 'photos',
      filename: out.name,
      resourceType: 'image',
    })
    const photo = {
      id: crypto.randomUUID(),
      section: SECTIONS.includes(req.body.section) ? req.body.section : suggestSection(req.file.originalname),
      title: cleanString(req.body.title, 200) || path.parse(req.file.originalname).name,
      description: cleanString(req.body.description, 400) || '',
      url: stored.url,
      size: stored.size,
      orientation: out.orientation,
      width: out.width,
      height: out.height,
      featured: req.body.featured === 'true' || req.body.featured === true,
      uploadedAt: new Date().toISOString(),
    }
    await updateDb((db) => { db.photos.unshift(photo) })
    res.status(201).json({ item: photo, message: 'Photo ajoutée, optimisée en WebP.' })
  } catch (err) {
    res.status(400).json({ message: `Traitement image impossible : ${err.message}` })
  }
})

/* ---------- Mise à jour des métadonnées (JWT) ---------- */
router.put('/:id', requireAuth, async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: 'Aucune donnée à mettre à jour.' })
  }
  const item = await updateDb((db) => {
    const p = db.photos.find((x) => x.id === req.params.id)
    if (!p) return null
    if (req.body.title !== undefined) p.title = cleanString(req.body.title, 200)
    if (req.body.description !== undefined) p.description = cleanString(req.body.description, 400)
    if (SECTIONS.includes(req.body.section)) p.section = req.body.section
    if (req.body.featured !== undefined) p.featured = req.body.featured === true || req.body.featured === 'true'
    return p
  })
  if (!item) return res.status(404).json({ message: 'Photo introuvable.' })
  res.json({ item, message: 'Photo mise à jour.' })
})

/* ---------- Suppression (JWT, fichier physique inclus) ---------- */
router.delete('/:id', requireAuth, async (req, res) => {
  const removed = await updateDb((db) => {
    const idx = db.photos.findIndex((p) => p.id === req.params.id)
    if (idx < 0) return null
    const [photo] = db.photos.splice(idx, 1)
    return photo
  })
  if (!removed) return res.status(404).json({ message: 'Photo introuvable.' })
  await deleteFile(removed.url)
  res.json({ message: 'Photo supprimée.' })
})

export default router
