// ============================================================
// server/src/routes/podcasts.js — gestion des épisodes Web Radio
// GET    /api/podcasts      (public)  → liste des épisodes
// POST   /api/podcasts      (JWT)     → ajout (upload audio via multer)
// PUT    /api/podcasts/:id  (JWT)     → remplacer fichier/métadonnées
// DELETE /api/podcasts/:id  (JWT)     → suppression (fichier + épisode)
// Stockage : server/public/audios/     (servi à l'URL /audios/…)
// Formats acceptés : MP3, WAV, M4A, OGG — filtres MIME stricts.
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

/* Dossier de stockage des audios (créé si absent) */
fs.mkdirSync(config.audiosDir, { recursive: true })

/* Types MIME audio autorisés + extension associée */
const AUDIO_TYPES = {
  'audio/mpeg': '.mp3',
  'audio/wav': '.wav',
  'audio/x-wav': '.wav',
  'audio/mp4': '.m4a',
  'audio/ogg': '.ogg',
}

const upload = multer({
  storage: multer.diskStorage({
    destination: config.audiosDir,
    filename: (_req, file, cb) => {
      const base = path.parse(file.originalname).name
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .toLowerCase().replace(/[^a-z0-9-_]+/g, '-').slice(0, 60)
      const ext = AUDIO_TYPES[file.mimetype] ?? path.extname(file.originalname).toLowerCase()
      cb(null, `${base}-${crypto.randomBytes(3).toString('hex')}${ext}`)
    },
  }),
  limits: { fileSize: config.uploadMaxMb * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (AUDIO_TYPES[file.mimetype]) cb(null, true)
    else cb(new Error('TYPE_REFUSE : formats audio acceptés : MP3, WAV, M4A, OGG.'))
  },
})

/* ---------- Liste publique ---------- */
router.get('/', (_req, res) => {
  res.json({ items: getDb().podcasts })
})

/* ---------- Ajout d'un épisode (administration) ---------- */
router.post('/', requireAuth, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Fichier audio requis (champ "file").' })

  const episode = {
    id: crypto.randomUUID(),
    title: cleanString(req.body.title, 200) || req.file.originalname,
    description: cleanString(req.body.description, 400) || '',
    duration: cleanString(req.body.duration, 10) || '',
    url: `/audios/${req.file.filename}`,
    size: req.file.size,
    uploadedAt: new Date().toISOString(),
  }
  getDb().podcasts.push(episode)
  saveDb()
  res.status(201).json({ item: episode, message: 'Épisode ajouté.' })
})

/* ---------- Remplacement / mise à jour (administration) ---------- */
router.put('/:id', requireAuth, upload.single('file'), (req, res) => {
  const db = getDb()
  const ep = db.podcasts.find((p) => p.id === req.params.id)
  if (!ep) return res.status(404).json({ message: 'Épisode introuvable.' })

  if (req.file) {
    const oldPath = path.join(config.audiosDir, path.basename(ep.url))
    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath)
    ep.url = `/audios/${req.file.filename}`
    ep.size = req.file.size
  }
  if (req.body.title) ep.title = cleanString(req.body.title, 200)
  if (req.body.description !== undefined) ep.description = cleanString(req.body.description, 400)
  if (req.body.duration !== undefined) ep.duration = cleanString(req.body.duration, 10)
  saveDb()
  res.json({ item: ep, message: 'Épisode mis à jour.' })
})

/* ---------- Suppression (administration) ---------- */
router.delete('/:id', requireAuth, (req, res) => {
  const db = getDb()
  const ep = db.podcasts.find((p) => p.id === req.params.id)
  if (!ep) return res.status(404).json({ message: 'Épisode introuvable.' })

  const filePath = path.join(config.audiosDir, path.basename(ep.url))
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
  db.podcasts = db.podcasts.filter((p) => p.id !== ep.id)
  saveDb()
  res.json({ message: 'Épisode supprimé.' })
})

export default router
