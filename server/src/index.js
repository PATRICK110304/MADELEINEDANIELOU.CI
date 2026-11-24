// ============================================================
// server/src/index.js — point d'entrée de l'API Express
// Sécurité : Helmet (en-têtes HTTP), CORS restreint (liste
// blanche), limiteurs de débit, sanitisation XSS, JWT, Multer.
// Assets statiques : /documents → public/documents/, /audios → public/audios/
// ============================================================
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import fs from 'node:fs'
import path from 'node:path'
import { config } from './config.js'
import { loadDb } from './db.js'
import { seed } from './seed.js'
import { sanitizeBody } from './middleware/sanitize.js'
import { notFound, errorHandler } from './middleware/errorHandler.js'
import authRoutes from './routes/auth.js'
import contactRoutes from './routes/contact.js'
import inscriptionsRoutes from './routes/inscriptions.js'
import documentsRoutes from './routes/documents.js'
import podcastsRoutes from './routes/podcasts.js'
import photosRoutes from './routes/photos.js'
import auditRoutes from './routes/audit.js'

const app = express()
app.set('trust proxy', 1) // nécessaire derrière Vercel/Netlify/Nginx

/* ---------- En-têtes de sécurité (Helmet) ---------- */
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // PDF/MP3 accessibles depuis le client
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        'img-src': ["'self'", 'data:', 'https:'],   // images distantes (photos de démonstration)
        'media-src': ["'self'", 'data:', 'https:'], // lecteurs audio
        'script-src': ["'self'", "'unsafe-inline'", 'https://www.google.com/recaptcha/'], // reCAPTCHA v3
        'frame-src': ["'self'", 'https://www.google.com'],
      },
    },
  }),
)

/* ---------- CORS restreint (liste blanche du client) ---------- */
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || config.clientOrigins.includes(origin)) return cb(null, true)
      cb(new Error('Origine non autorisée par la politique CORS.'))
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  }),
)

/* ---------- Limiteur global : 300 requêtes / 15 min / IP ---------- */
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: true, legacyHeaders: false }))

/* ---------- Parsers + sanitisation anti-XSS ---------- */
app.use(express.json({ limit: '1mb' }))
app.use(sanitizeBody)

/* ---------- Assets statiques (chemins clairs) ---------- */
app.use('/documents', express.static(config.documentsDir, { maxAge: '1d' }))
app.use('/audios', express.static(config.audiosDir, { maxAge: '1d' }))
app.use('/media/photos', express.static(path.join(config.publicDir, 'photos'), { maxAge: '7d' }))

/* ---------- Routes API ---------- */
app.use('/api/auth', authRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/inscriptions', inscriptionsRoutes)
app.use('/api/documents', documentsRoutes)
app.use('/api/podcasts', podcastsRoutes)
app.use('/api/photos', photosRoutes)
app.use('/api/audit', auditRoutes)

/* Route de santé (monitoring) */
app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'mdc-api' }))

/* ---------- 404 + gestion d'erreurs ---------- */
app.use(notFound)
app.use(errorHandler)

/* ---------- Démarrage ----------
   On attend la base AVANT d'ouvrir le port : aucun appel ne peut
   tomber sur un cache vide pendant le chargement initial.         */
async function start() {
  await loadDb()
  await seed()
  fs.mkdirSync(config.dataDir, { recursive: true })
  app.listen(config.port, () => {
    console.log(`✔ API MDC : http://localhost:${config.port}`)
    console.log(`  • Documents : ${config.documentsDir}`)
    console.log(`  • Audios    : ${config.audiosDir}`)
    console.log(`  • Base      : PostgreSQL (${process.env.CLOUDINARY_URL ? 'Cloudinary' : 'stockage local'})`)
  })
}

start().catch((err) => {
  console.error('✖ Démarrage impossible :', err.message)
  process.exit(1)
})
