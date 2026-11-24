// ============================================================
// server/src/db.js — base JSON (zéro dépendance), écriture atomique.
// Collections : users, inscriptions, documents, podcasts, contactMessages.
// ============================================================
import fs from 'node:fs'
import path from 'node:path'
import { config } from './config.js'

const DB_FILE = path.join(config.dataDir, 'db.json')
let db = null

/** Charge la base (crée le dossier + le fichier si nécessaire) */
export function loadDb() {
  fs.mkdirSync(config.dataDir, { recursive: true })
  if (fs.existsSync(DB_FILE)) {
    db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'))
  } else {
    db = { users: [], inscriptions: [], documents: [], podcasts: [], contactMessages: [], photos: [] }
    saveDb()
  }
  if (!Array.isArray(db.contactMessages)) db.contactMessages = []
  if (!Array.isArray(db.photos)) db.photos = []
  return db
}

/** Persistance atomique (tmp + rename) */
export function saveDb() {
  const tmp = `${DB_FILE}.${process.pid}.tmp`
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2))
  fs.renameSync(tmp, DB_FILE)
}

/**
 * Mutation sérialisée : toutes les écritures passent par ici pour
 * éviter les courses (plusieurs handlers qui écrivent le même fichier).
 * Le mutateur est synchrone; sa valeur de retour est renvoyée.
 */
let queue = Promise.resolve()
export function updateDb(mutator) {
  const run = () => {
    const database = loadDb()
    const result = mutator(database)
    saveDb()
    return result
  }
  const next = queue.then(run, run)
  queue = next.catch(() => {})
  return next
}

export function getDb() {
  return db ?? loadDb()
}
