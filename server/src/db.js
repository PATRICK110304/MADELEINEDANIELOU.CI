// ============================================================
// server/src/db.js — stockage PostgreSQL (pg)
//
// Contrat PUBLIC identique à l'ancien db.json, pour ne pas
// réécrire les routes :
//   getDb()            -> cache en mémoire (noms camelCase)
//   loadDb()           -> Promise<void> (chargement depuis PG)
//   saveDb()           -> Promise<void> (persistance du cache)
//   updateDb(mutator)  -> Promise<R> (mutation sérialisée)
//
// Le cache conserve les noms de champs utilisés par l'API ;
// la conversion snake_case n'a lieu qu'à la frontière SQL.
// ============================================================
import pg from 'pg'

const { Pool } = pg

const url = process.env.DATABASE_URL
if (!url) {
  throw new Error(
    'DATABASE_URL est requise. Copiez server/.env.example vers server/.env ' +
    'et renseignez votre chaîne PostgreSQL.',
  )
}

const pool = new Pool({
  connectionString: url,
  // TLS obligatoire chez les hébergeurs managés (Supabase, Neon, Railway…)
  // mais inutile pour un PostgreSQL local.
  ssl: /localhost|127\.0\.0\.1/.test(url) ? undefined : { rejectUnauthorized: false },
  max: 10,
})

/* ------------------------------------------------------------
   Déclaration des collections : mapping exact db.json <-> SQL.
   Ne jamais inventer de champ : ce sont les 6 collections réelles.
   ------------------------------------------------------------ */
export const COLLECTIONS = {
  users: {
    table: 'users',
    order: 'created_at',
    from: (r) => ({ id: r.id, email: r.email, passwordHash: r.password_hash, createdAt: r.created_at }),
    to: (x) => [x.id, x.email, x.passwordHash, x.createdAt],
    cols: '(id, email, password_hash, created_at)',
  },
  inscriptions: {
    table: 'inscriptions',
    order: 'created_at',
    from: (r) => ({
      id: r.id, reference: r.reference,
      elevePrenom: r.eleve_prenom, eleveNom: r.eleve_nom, naissance: r.naissance,
      classe: r.classe, origine: r.origine,
      parentNom: r.parent_nom, lien: r.lien,
      email: r.email, telephone: r.telephone, adresse: r.adresse, message: r.message,
      status: r.status, createdAt: r.created_at,
    }),
    to: (x) => [
      x.id, x.reference, x.elevePrenom, x.eleveNom, x.naissance, x.classe, x.origine,
      x.parentNom, x.lien, x.email, x.telephone, x.adresse, x.message, x.status, x.createdAt,
    ],
    cols: '(id, reference, eleve_prenom, eleve_nom, naissance, classe, origine, parent_nom, lien, email, telephone, adresse, message, status, created_at)',
  },
  documents: {
    table: 'documents',
    order: 'uploaded_at',
    from: (r) => ({ id: r.id, section: r.section, title: r.title, url: r.url, size: Number(r.size), uploadedAt: r.uploaded_at }),
    to: (x) => [x.id, x.section, x.title, x.url, x.size, x.uploadedAt],
    cols: '(id, section, title, url, size, uploaded_at)',
  },
  podcasts: {
    table: 'podcasts',
    order: 'uploaded_at',
    from: (r) => ({
      id: r.id, title: r.title, description: r.description, duration: r.duration,
      url: r.url, size: Number(r.size), uploadedAt: r.uploaded_at,
    }),
    to: (x) => [x.id, x.title, x.description, x.duration, x.url, x.size, x.uploadedAt],
    cols: '(id, title, description, duration, url, size, uploaded_at)',
  },
  contactMessages: {
    table: 'contact_messages',
    order: 'created_at',
    from: (r) => ({
      id: r.id, name: r.name, email: r.email, phone: r.phone, subject: r.subject,
      message: r.message, acceptedConsent: r.accepted_consent, traite: r.traite,
      createdAt: r.created_at,
    }),
    to: (x) => [
      x.id, x.name, x.email, x.phone, x.subject, x.message,
      x.acceptedConsent ?? false, x.traite ?? false, x.createdAt,
    ],
    cols: '(id, name, email, phone, subject, message, accepted_consent, traite, created_at)',
  },
  photos: {
    table: 'photos',
    order: 'uploaded_at',
    from: (r) => ({
      id: r.id, section: r.section, title: r.title, description: r.description,
      url: r.url, size: Number(r.size), orientation: r.orientation,
      width: r.width, height: r.height, featured: r.featured, uploadedAt: r.uploaded_at,
    }),
    to: (x) => [
      x.id, x.section, x.title, x.description, x.url, x.size, x.orientation,
      x.width, x.height, x.featured ?? false, x.uploadedAt,
    ],
    cols: '(id, section, title, description, url, size, orientation, width, height, featured, uploaded_at)',
  },
}

const empty = () => Object.fromEntries(Object.keys(COLLECTIONS).map((k) => [k, []]))

let db = empty()
let loadPromise

/** Charge toutes les collections (une seule fois par processus). */
export function loadDb() {
  if (!loadPromise) {
    loadPromise = (async () => {
      const next = empty()
      for (const [key, spec] of Object.entries(COLLECTIONS)) {
        const { rows } = await pool.query(`SELECT * FROM ${spec.table} ORDER BY ${spec.order} DESC`)
        next[key] = rows.map(spec.from)
      }
      db = next
      return db
    })()
  }
  return loadPromise
}

/* ---------- File d'écriture sérialisée ----------
   Une seule écriture à la fois : évite qu'un DELETE d'une
   requête supprime les INSERT d'une autre.                      */
let queue = Promise.resolve()

/** Écrit un instantané complet dans une transaction. */
async function persist(snapshot) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    for (const [key, spec] of Object.entries(COLLECTIONS)) {
      await client.query(`DELETE FROM ${spec.table}`)
      const rows = snapshot[key] || []
      for (const item of rows) {
        const values = spec.to(item)
        const marks = values.map((_, i) => `$${i + 1}`).join(', ')
        await client.query(`INSERT INTO ${spec.table} ${spec.cols} VALUES (${marks})`, values)
      }
    }
    await client.query('COMMIT')
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
  }
}

function enqueue(task) {
  const next = queue.then(task, task)
  queue = next.catch(() => {}) // une erreur ne bloque pas les suivantes
  return next
}

/** Persiste l'état courant du cache (même contrat que l'ancien saveDb). */
export function saveDb() {
  const snapshot = structuredClone(db)
  return enqueue(() => persist(snapshot))
}

/** Mutation atomique et sérialisée (même contrat que l'ancien updateDb). */
export function updateDb(mutator) {
  return enqueue(async () => {
    await loadDb()
    const result = mutator(db)
    await persist(structuredClone(db))
    return result
  })
}

/** Accès synchrone au cache (routes GET). */
export function getDb() {
  return db
}

export { pool }
export default { getDb, loadDb, saveDb, updateDb, pool }
