// ============================================================
// server/src/routes/podcasts.js — Web Radio
// GET /api/podcasts · POST · PUT /:id · DELETE /:id (JWT)
// Stockage : local (server/public/audios) ou Cloudinary.
// Formats : MP3, WAV, M4A, OGG (filtres MIME stricts).
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

const AUDIO_TYPES = {
  'audio/mpeg': '.mp3',
  'audio/wav': '.wav',
  'audio/x-wav': '.wav',
  'audio/mp4': '.m4a',
  'audio/ogg': '.ogg',
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: config.uploadMaxMb * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (AUDIO_TYPES[file.mimetype]) cb(null, true)
    else cb(new Error('TYPE_REFUSE : formats audio acceptés : MP3, WAV, M4A, OGG.'))
  },
})

function safeName(file) {
  const base = path.parse(file.originalname).name
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z0-9-_]+/g, '-').slice(0, 60)
  const ext = AUDIO_TYPES[file.mimetype] ?? path.extname(file.originalname).toLowerCase()
  return `${base || 'episode'}-${crypto.randomBytes(3).toString('hex')}${ext}`
}

router.get('/', (_req, res) => {
  res.json({ items: getDb().podcasts })
})

router.post('/', requireAuth, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Fichier audio requis (champ "file").' })
  try {
    const stored = await saveFile({
      buffer: req.file.buffer,
      folder: 'audios',
      filename: safeName(req.file),
      resourceType: 'video', // Cloudinary : un MP3 est uploadé comme ressource "video"
    })
    const episode = {
      id: crypto.randomUUID(),
      title: cleanString(req.body.title, 200) || req.file.originalname,
      description: cleanString(req.body.description, 400) || '',
      duration: cleanString(req.body.duration, 10) || '',
      url: stored.url,
      size: stored.size,
      uploadedAt: new Date().toISOString(),
    }
    getDb().podcasts.push(episode)
    await saveDb()
    res.status(201).json({ item: episode, message: 'Épisode ajouté.' })
  } catch (err) {
    res.status(502).json({ message: `Stockage impossible : ${err.message}` })
  }
})

router.put('/:id', requireAuth, upload.single('file'), async (req, res) => {
  const ep = getDb().podcasts.find((p) => p.id === req.params.id)
  if (!ep) return res.status(404).json({ message: 'Épisode introuvable.' })
  try {
    if (req.file) {
      const oldUrl = ep.url
      const stored = await saveFile({
        buffer: req.file.buffer,
        folder: 'audios',
        filename: safeName(req.file),
        resourceType: 'video',
      })
      ep.url = stored.url
      ep.size = stored.size
      await deleteFile(oldUrl)
    }
    if (req.body.title) ep.title = cleanString(req.body.title, 200)
    if (req.body.description !== undefined) ep.description = cleanString(req.body.description, 400)
    if (req.body.duration !== undefined) ep.duration = cleanString(req.body.duration, 10)
    await saveDb()
    res.json({ item: ep, message: 'Épisode mis à jour.' })
  } catch (err) {
    res.status(502).json({ message: `Stockage impossible : ${err.message}` })
  }
})

router.delete('/:id', requireAuth, async (req, res) => {
  const db = getDb()
  const ep = db.podcasts.find((p) => p.id === req.params.id)
  if (!ep) return res.status(404).json({ message: 'Épisode introuvable.' })
  db.podcasts = db.podcasts.filter((p) => p.id !== ep.id)
  await saveDb()
  await deleteFile(ep.url)
  res.json({ message: 'Épisode supprimé.' })
})

export default router
