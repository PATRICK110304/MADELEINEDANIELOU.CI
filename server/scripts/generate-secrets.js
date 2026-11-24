// ============================================================
// server/scripts/generate-secrets.js
// Génère des secrets aléatoires à copier dans server/.env
// (jamais dans le dépôt). Usage : npm --workspace server run secrets
// ============================================================
import crypto from 'node:crypto'

const SYMBOLS = 'AzErTyUiOpQsDfGhJkLmMwXcVbNn123456789!@#$%^&*'

// Au moins une minuscule, une majuscule, un chiffre et un symbole.
function makePassword(length = 24) {
  const out = []
  const groups = [
    'abcdefghijkmnopqrstuvwxyz',
    'ABCDEFGHJKLMNPQRSTUVWXYZ',
    '23456789',
    '!@#$%^&*',
  ]
  // Une lettre minuscule, une majuscule, un chiffre, un symbole, puis le reste.
  for (const g of groups) out.push(g[crypto.randomInt(g.length)])
  for (let i = out.length; i < length; i++) {
    out.push(SYMBOLS[crypto.randomInt(SYMBOLS.length)])
  }
  // Fisher–Yates pour ne pas laisser les catégories en tête.
  for (let i = out.length - 1; i > 0; i--) {
    const j = crypto.randomInt(i + 1)
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out.join('')
}

console.log('── Secrets à copier dans server/.env (NE JAMAIS les committer) ──')
console.log()
console.log(`JWT_SECRET=${crypto.randomBytes(32).toString('hex')}`)
console.log(`ADMIN_PASSWORD=${makePassword(24)}`)
console.log()
console.log('Le mot de passe admin sera hashé avec bcrypt (cost 12) au premier démarrage.')
