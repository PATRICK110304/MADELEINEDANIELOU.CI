// ============================================================
// server/src/routes/security.js — pilotage de la sécurité
// Toutes les routes sont protégées par requireAuth (JWT Supabase).
// ============================================================
import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { requireAuth } from '../middleware/auth.js'
import { runSentinel } from '../services/sentinel.js'
import { unblock, blockIp } from '../services/security.js'
import { pool } from '../db.js'

const router = Router()
const limiter = rateLimit({ windowMs: 60 * 1000, limit: 4, standardHeaders: true, legacyHeaders: false })

router.post('/sentinel/run', limiter, requireAuth, async (_req, res) => {
  res.json(await runSentinel())
})

router.get('/blocks', requireAuth, async (_req, res) => {
  const { rows } = await pool.query(
    `SELECT ip, reason, blocked_until, active, created_at
     FROM public.blocked_ips WHERE active=true AND blocked_until > now()
     ORDER BY blocked_until DESC LIMIT 50`,
  )
  res.json({ items: rows })
})

router.post('/unblock', requireAuth, async (req, res) => {
  const ip = String(req.body?.ip || '').trim()
  if (!/^[0-9a-fA-F:.]+$/.test(ip)) return res.status(400).json({ message: 'Adresse IP invalide.' })
  const ok = await unblock(ip)
  res.json({ ok, message: ok ? 'IP débloquée.' : 'Aucun blocage actif pour cette IP.' })
})

/* ---------- Actions depuis le message reçu sur le téléphone ----------
   Le token contenu dans le lien est l'autorisation : pas de mot de passe,
   pas de session. Les réponses sont de petites pages lisibles sur mobile. */
function page(title, text) {
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title>
  <style>body{font-family:system-ui,sans-serif;background:#FAF8F5;color:#1a1a1a;margin:0;padding:2rem;line-height:1.6}
  main{max-width:32rem;margin:auto;background:#fff;padding:2rem;border-radius:1.5rem;box-shadow:0 10px 30px rgba(11,92,160,.08)}
  h1{color:#0B5CA0;font-size:1.4rem}p{font-size:1.05rem}a{color:#0B5CA0}</style></head>
  <body><main><h1>${title}</h1><p>${text}</p><p><a href="https://madeleinedanielou.vercel.app">Retour au site GSMD</a></p></main></body></html>`
}

router.get('/alert/:token/block', async (req, res) => {
  const token = String(req.params.token || '')
  if (!/^[0-9a-f]{48}$/.test(token)) return res.status(400).send(page('Lien invalide', 'Ce lien n’est plus valable.'))
  const { rows } = await pool.query(
    `SELECT * FROM public.security_alerts WHERE token=$1 AND status='en_attente'`,
    [token],
  )
  if (!rows.length) return res.send(page('Déjà traité', 'Cette alerte a déjà été traitée. Merci.'))
  const alert = rows[0]
  await blockIp(alert.ip, `Bloqué depuis l'alerte (${alert.reason})`, 60 * 60 * 1000)
  await pool.query(
    `UPDATE public.security_alerts SET status='bloqué', resolved_at=now() WHERE token=$1`,
    [token],
  )
  res.send(page('Connexion bloquée', `L’adresse ${alert.ip} est maintenant bloquée pendant 1 heure. Le secrétariat peut continuer à utiliser le site normalement.`))
})

router.get('/alert/:token/allow', async (req, res) => {
  const token = String(req.params.token || '')
  if (!/^[0-9a-f]{48}$/.test(token)) return res.status(400).send(page('Lien invalide', 'Ce lien n’est plus valable.'))
  const { rows } = await pool.query(
    `SELECT * FROM public.security_alerts WHERE token=$1 AND status='en_attente'`,
    [token],
  )
  if (!rows.length) return res.send(page('Déjà traité', 'Cette alerte a déjà été traitée. Merci.'))
  const alert = rows[0]
  await unblock(alert.ip)
  await pool.query(
    `UPDATE public.security_alerts SET status='ignoré', resolved_at=now() WHERE token=$1`,
    [token],
  )
  res.send(page('Signalement ignoré', `Le blocage de ${alert.ip} a été annulé. Aucune autre action n’est nécessaire.`))
})



export default router
