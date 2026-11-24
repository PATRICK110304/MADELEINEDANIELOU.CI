// ============================================================
// server/scripts/import.js — migration ponctuelle db.json → PostgreSQL
//
// Usage :
//   npm --workspace server run db:import
//
// Prérequis : DATABASE_URL dans server/.env (ou dans l'environnement).
// Le schéma est créé automatiquement s'il n'existe pas encore
// (server/migrations/001_init.sql), puis les 6 collections sont
// importées exactement telles quelles — aucun champ n'est inventé.
// ============================================================
import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import pg from 'pg'
import { COLLECTIONS } from '../src/db.js'

const { Pool } = pg
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dataFile = path.join(__dirname, '..', 'data', 'db.json')
const migrationsDir = path.join(__dirname, '..', 'migrations')

if (!process.env.DATABASE_URL) {
  console.error('✖ DATABASE_URL manquante — renseignez-la dans server/.env')
  process.exit(1)
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: /localhost|127\.0\.0\.1/.test(process.env.DATABASE_URL)
    ? undefined
    : { rejectUnauthorized: false },
})

async function main() {
  /* db.json est volontairement gitignoré : sur un déploiement frais
     il n'existe pas. On applique quand même les migrations, puis on
     laisse seed() créer le compte admin et les contenus par défaut. */
  const hasSource = fs.existsSync(dataFile)
  const raw = hasSource ? JSON.parse(fs.readFileSync(dataFile, 'utf8')) : null
  if (!hasSource) {
    console.warn(`• ${path.basename(dataFile)} absent : migrations seules, puis amorçage.`)
  }

  const client = await pool.connect()
  try {
    // 1) Schéma : toutes les migrations, dans l'ordre (idempotentes).
    const migrations = fs.readdirSync(migrationsDir).filter((f) => f.endsWith('.sql')).sort()
    for (const file of migrations) {
      console.log(`• Migration ${file}…`)
      await client.query(fs.readFileSync(path.join(migrationsDir, file), 'utf8'))
    }

    // 2) Import dans une transaction : tout ou rien.
    await client.query('BEGIN')
    for (const [key, spec] of Object.entries(COLLECTIONS)) {
      const items = raw && Array.isArray(raw[key]) ? raw[key] : []
      await client.query(`DELETE FROM ${spec.table}`)
      for (const item of items) {
        const values = spec.to(item)
        const marks = values.map((_, i) => `$${i + 1}`).join(', ')
        await client.query(`INSERT INTO ${spec.table} ${spec.cols} VALUES (${marks})`, values)
      }
      console.log(`  ✓ ${key.padEnd(16)} ${items.length} ligne(s) → ${spec.table}`)
    }
    await client.query('COMMIT')
    console.log('✔ Migration terminée.')
  } catch (err) {
    await client.query('ROLLBACK')
    console.error('✖ Échec de la migration :', err.message)
    process.exitCode = 1
  } finally {
    client.release()
    await pool.end()
  }

  if (!hasSource && !process.exitCode) {
    const { seed } = await import('../src/seed.js')
    await seed()
    console.log('✔ Amorçage terminé (admin local si mode JWT, documents, podcasts).')
  }
}

main()
