// ============================================================
// server/src/middleware/sanitize.js — nettoyage des entrées.
// Supprime toute balise HTML/script des champs texte avant
// traitement : protection XSS de base sur les formulaires.
// ============================================================

/** Supprime les balises <> , les caractères de contrôle et trim */
export function cleanString(value = '', maxLength = 500) {
  return String(value)
    .replace(/<[^>]*>?/g, '')           // retire <script>, <img …>, etc.
    .replace(/[\u0000-\u001F\u007F]/g, ' ') // caractères de contrôle
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength)
}

/**
 * Middleware : passe dans req.body et nettoie tous les champs texte.
 * Les nombres/booléens sont préservés ; les objets sont ignorés.
 */
export function sanitizeBody(req, _res, next) {
  if (req.body && typeof req.body === 'object') {
    for (const key of Object.keys(req.body)) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = cleanString(req.body[key])
      }
    }
  }
  next()
}
