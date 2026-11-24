// ============================================================
// server/src/middleware/errorHandler.js — filet de sécurité
// global : renvoie du JSON, jamais de trace de pile en prod.
// ============================================================

export function notFound(_req, res) {
  res.status(404).json({ message: 'Ressource introuvable.' })
}

export function errorHandler(err, _req, res, _next) {
  // Erreurs Multer (fichier trop lourd / type refusé)
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ message: 'Fichier trop volumineux.' })
  }
  if (err.message?.startsWith('TYPE_REFUSE')) {
    return res.status(415).json({ message: err.message.replace('TYPE_REFUSE : ', '') })
  }
  console.error('[API]', err)
  res.status(500).json({ message: 'Erreur interne du serveur.' })
}
