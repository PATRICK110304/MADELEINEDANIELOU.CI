// ============================================================
// server/scripts/db-check.js — diagnostic de connexion PostgreSQL
// Vérifie l'accès et la présence des 6 tables attendues.
// Usage : npm --workspace server run db:check
// Aucun secret n'est écrit dans ce fichier : tout vient de .env
// ============================================================
import 'dotenv/config'
import pg from 'pg'

const { Pool } = pg
const EXPECTED = ['users', 'inscriptions', 'documents', 'podcasts', 'contact_messages', 'photos']

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

try {
  const client = await pool.connect()
  try {
    console.log('✔ Connexion PostgreSQL OK')

    const { rows } = await client.query(
      `SELECT table_name FROM information_schema.tables
       WHERE table_schema = 'public' AND table_name = ANY($1)
       ORDER BY table_name`,
      [EXPECTED],
    )
    const found = rows.map((r) => r.table_name)
    const missing = EXPECTED.filter((t) => !found.includes(t))
    console.log(`  Tables présentes : ${found.join(', ') || '(aucune)'}`)
    if (missing.length) {
      console.error(`✖ Tables manquantes : ${missing.join(', ')}`)
      console.error('  → Lancez : npm --workspace server run db:import')
      process.exitCode = 1
    } else {
      for (const table of EXPECTED) {
        const { rows: c } = await client.query(`SELECT count(*)::int AS n FROM ${table}`)
        console.log(`  • ${table.padEnd(17)} ${c[0].n} ligne(s)`)
      }
      console.log('✔ Schéma conforme au projet')
    }
  } finally {
    client.release()
  }
} catch (err) {
  console.error('✖ Connexion impossible :', err.message)
  process.exitCode = 1
} finally {
  await pool.end()
}
