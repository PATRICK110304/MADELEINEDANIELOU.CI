// ============================================================
// server/src/config.js — configuration centralisée (variables
// d'environnement + valeurs par défaut sûres).
// ============================================================
import 'dotenv/config'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const config = {
  port: Number(process.env.PORT || 4000),

  /* CORS restreint : localhost ET 127.0.0.1 en dev (le navigateur
     envoie l'origine exacte de la barre d'adresse) */
  clientOrigins: (process.env.CLIENT_URL || 'http://localhost:5173,http://127.0.0.1:5173')
    .split(',')
    .map((o) => o.trim()),

  /* Supabase Auth (optionnel) — uniquement la clé PUBLISHABLE côté API.
     La clé secrète / service_role ne doit jamais apparaître ici. */
  supabase: {
    url: process.env.SUPABASE_URL || '',
    publishableKey: process.env.SUPABASE_PUBLISHABLE_KEY || '',
  },

  /* JWT (mode repli si Supabase Auth n'est pas configuré) */
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-a-remplacer-en-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',

  /* Compte administrateur initial (créé/seedé au démarrage) */
  admin: {
    email: process.env.ADMIN_EMAIL || 'admin@madeleinedanielou.ci',
    password: process.env.ADMIN_PASSWORD || 'Secret@2026!',
    /* Rôles autorisés (app_metadata.role dans Supabase).
       Vide = pas de restriction de rôle, seule l'adresse admin compte. */
    roles: (process.env.ADMIN_ROLES || '').split(',').map((r) => r.trim()).filter(Boolean),
  },

  /* reCAPTCHA v3 — vide en dev : la vérification est ignorée */
  recaptchaSecret: process.env.RECAPTCHA_SECRET || '',

  /* Uploads */
  uploadMaxMb: Number(process.env.UPLOAD_MAX_MB || 20),

  /* Chemins de stockage : fichiers servis à /documents et /audios */
  publicDir: path.join(__dirname, '..', 'public'),
  documentsDir: path.join(__dirname, '..', 'public', 'documents'),
  audiosDir: path.join(__dirname, '..', 'public', 'audios'),
  dataDir: path.join(__dirname, '..', 'data'),
}
