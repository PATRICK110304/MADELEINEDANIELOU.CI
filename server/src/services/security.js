// ============================================================
// server/src/services/security.js — blocage deterministe des IP
//
// Règles conservatrices et réversibles :
//  - 10 échecs / 15 min sur une même IP → blocage 30 min
//  - les IP de TRUSTED_IPS ne sont jamais bloquées
//  - un succès remet le compteur à zéro
//  - le blocage est toujours notifié etJournalisé
// ============================================================
import { pool } from '../db.js'
import { notifyAdmin } from './notify.js'

const WINDOW_MS = 15 * 60 * 1000
const FAILURE_LIMIT = 10
const BLOCK_MS = 30 * 60 * 1000

const trusted = (process.env.TRUSTED_IPS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

export function isTrusted(ip) {
  return Boolean(ip) && trusted.some((t) => ip === t || ip.startsWith(`${t}/`))
}

export async function isBlocked(ip) {
  if (!ip || isTrusted(ip)) return false
  const { rows } = await pool.query(
    `SELECT id FROM public.blocked_ips
     WHERE ip=$1 AND active=true AND blocked_until > now() LIMIT 1`,
    [ip],
  )
  return rows.length > 0
}

export async function recordAuth(ip, email, success) {
  if (!ip) return { blocked: false }
  try {
    if (success) {
      await pool.query('UPDATE public.auth_events SET counted=false WHERE ip=$1 AND counted=true', [ip])
      return { blocked: false }
    }

    await pool.query(
      'INSERT INTO public.auth_events (ip, email, success, counted) VALUES ($1,$2,false,true)',
      [ip, email || null],
    )

    if (isTrusted(ip)) return { blocked: false }

    const { rows } = await pool.query(
      `SELECT count(*)::int AS n FROM public.auth_events
       WHERE ip=$1 AND counted=true AND created_at > now() - ($2::int * interval '1 millisecond')`,
      [ip, WINDOW_MS],
    )
    if (rows[0].n >= FAILURE_LIMIT) {
      await blockIp(ip, `${rows[0].n} échecs de connexion en 15 min`, BLOCK_MS)
      return { blocked: true }
    }
    return { blocked: false, failures: rows[0].n }
  } catch (err) {
    console.warn('⚠ Sécurité indisponible :', err.message)
    return { blocked: false }
  }
}

export async function blockIp(ip, reason, durationMs = BLOCK_MS) {
  if (!ip || isTrusted(ip)) return false
  try {
    await pool.query(
      `INSERT INTO public.blocked_ips (ip, reason, blocked_until, active)
       VALUES ($1,$2, now() + ($3::int * interval '1 millisecond'), true)`,
      [ip, reason || 'blocage automatique', durationMs],
    )
    await notifyAdmin('IP bloquée automatiquement', `Adresse IP : ${ip}\nMotif : ${reason}\nDurée : ${Math.round(durationMs / 60000)} min`)
    return true
  } catch (err) {
    console.warn('⚠ Blocage impossible :', err.message)
    return false
  }
}

export async function unblock(ip) {
  const { rowCount } = await pool.query(
    'UPDATE public.blocked_ips SET active=false WHERE ip=$1 AND active=true',
    [ip],
  )
  return rowCount > 0
}
