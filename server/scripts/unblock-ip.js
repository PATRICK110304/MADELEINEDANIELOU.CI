// ============================================================
// server/scripts/unblock-ip.js — débloquer une IP en cas d'erreur
// Usage : node server/scripts/unblock-ip.js 1.2.3.4
// ============================================================
import 'dotenv/config'
import { unblock } from '../src/services/security.js'
import { pool } from '../src/db.js'

const ip = process.argv[2]
if (!ip || !/^[0-9a-fA-F:.]+$/.test(ip)) {
  console.error('Usage : node server/scripts/unblock-ip.js <adresse IP>')
  process.exit(1)
}

const ok = await unblock(ip)
console.log(ok ? `✔ IP ${ip} débloquée.` : `• Aucun blocage actif pour ${ip}.`)
await pool.end()
