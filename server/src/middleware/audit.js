// ============================================================
// server/src/middleware/audit.js — journalise une consultation
// admin une fois la réponse envoyée avec succès.
// ============================================================
import { logAudit } from '../services/audit.js'

export function auditRead(action) {
  return (req, res, next) => {
    res.on('finish', () => {
      if (res.statusCode >= 400) return
      void logAudit(action, req.admin?.email, req.path)
    })
    next()
  }
}
