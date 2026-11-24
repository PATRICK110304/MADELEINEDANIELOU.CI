// ============================================================
// server/src/services/audit.js — journal des actions admin
// Écrit dans public.audit_log via le pool PostgreSQL existant.
// L'échec d'une écriture d'audit ne doit jamais bloquer l'action.
// ============================================================
import { pool } from '../db.js'

export async function logAudit(action, actorEmail, detail = null) {
  try {
    await pool.query(
      'INSERT INTO public.audit_log (action, actor_email, detail) VALUES ($1, $2, $3)',
      [action, actorEmail || null, detail ? String(detail).slice(0, 500) : null],
    )
  } catch (err) {
    console.warn('⚠ Audit indisponible :', err.message)
  }
}
