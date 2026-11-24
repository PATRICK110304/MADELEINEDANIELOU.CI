// ============================================================
// server/src/services/notify.js — alertes d'administration
//
// Canaux possibles (tous optionnels, aucun secret dans le code) :
//  1) EMAIL  : RESEND_API_KEY + ADMIN_NOTIFY_EMAIL  (gratuit dans le quota)
//  2) TWILIO : TWILIO_ACCOUNT_SID + TWILIO_AUTH_TOKEN +
//              TWILIO_WHATSAPP_FROM + TWILIO_WHATSAPP_TO → WhatsApp
//              TWILIO_CALL_FROM + TWILIO_CALL_TO → appel vocal
//  3) WEBHOOK: NOTIFY_WEBHOOK_URL (CallMeBot, Zapier, Make, n8n…)
//
// Une alerte ne doit JAMAIS bloquer la connexion : tous les échecs
// sont journalisés en WARN et avalés. Aucun mot de passe ni token
// n'est transmis dans les notifications.
// ============================================================
import crypto from 'node:crypto'
import { Resend } from 'resend'
import { pool } from '../db.js'

const emailEnabled = Boolean(process.env.RESEND_API_KEY && process.env.ADMIN_NOTIFY_EMAIL)
const webhookUrl = process.env.NOTIFY_WEBHOOK_URL || ''
const twilio = {
  sid: process.env.TWILIO_ACCOUNT_SID || '',
  token: process.env.TWILIO_AUTH_TOKEN || '',
  whatsappFrom: process.env.TWILIO_WHATSAPP_FROM || '',
  whatsappTo: process.env.TWILIO_WHATSAPP_TO || '',
  callFrom: process.env.TWILIO_CALL_FROM || '',
  callTo: process.env.TWILIO_CALL_TO || '',
}


const PUBLIC_API = process.env.PUBLIC_API_URL || 'https://madeleinedanielou-api.fly.dev'

/** Crée une alerte interactive et retourne les deux liens d'action. */
export async function createSecurityAlert(ip, reason = '', email = null) {
  const token = crypto.randomBytes(24).toString('hex')
  await pool.query(
    `INSERT INTO public.security_alerts (token, ip, email, reason)
     VALUES ($1,$2,$3,$4)`,
    [token, ip || 'inconnue', email, reason || 'activité suspecte'],
  )
  return {
    block: `${PUBLIC_API}/api/security/alert/${token}/block`,
    allow: `${PUBLIC_API}/api/security/alert/${token}/allow`,
  }
}

export function actionLinks(links) {
  return `\n\nBloquer cette connexion : ${links.block}\nCe n'est pas une attaque : ${links.allow}`
}

export const notifyChannels = [
  emailEnabled && 'email',
  webhookUrl && 'webhook',
  twilio.sid && twilio.whatsappFrom && twilio.whatsappTo && 'whatsapp',
  twilio.sid && twilio.callFrom && twilio.callTo && 'appel',
].filter(Boolean)

function twilioUrl(path) {
  return `https://api.twilio.com/2010-04-01/Accounts/${encodeURIComponent(twilio.sid)}/${path}.json`
}

async function twilioPost(path, body) {
  const auth = Buffer.from(`${twilio.sid}:${twilio.token}`).toString('base64')
  const res = await fetch(twilioUrl(path), {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(body),
  })
  if (!res.ok) throw new Error(`Twilio ${res.status}: ${(await res.text()).slice(0, 120)}`)
  return res.json()
}

async function sendEmail(title, message) {
  const client = new Resend(process.env.RESEND_API_KEY)
  const { error } = await client.emails.send({
    from: process.env.CONTACT_EMAIL_FROM || 'Groupe Scolaire Daniélou <groupescolaire@madeleinedanielou.ci>',
    to: process.env.ADMIN_NOTIFY_EMAIL,
    subject: `[GSMD] ${title}`,
    text: message,
  })
  if (error) throw new Error(error.message)
}

async function sendWebhook(title, message) {
  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, message }),
  })
  if (!res.ok) throw new Error(`Webhook ${res.status}`)
}

/** Notification publiques : titre court + texte, sans données sensibles. */
export async function notifyAdmin(title, message) {
  const results = []
  if (emailEnabled) {
    try { await sendEmail(title, message); results.push('email:ok') }
    catch (e) { results.push(`email:erreur (${e.message.slice(0, 80)})`) }
  }
  if (webhookUrl) {
    try { await sendWebhook(title, message); results.push('webhook:ok') }
    catch (e) { results.push(`webhook:erreur (${e.message.slice(0, 80)})`) }
  }
  if (twilio.sid && twilio.whatsappFrom && twilio.whatsappTo) {
    try {
      await twilioPost('Messages', {
        From: twilio.whatsappFrom,
        To: twilio.whatsappTo,
        Body: `${title}\n${message}`,
      })
      results.push('whatsapp:ok')
    } catch (e) { results.push(`whatsapp:erreur (${e.message.slice(0, 80)})`) }
  }
  if (twilio.sid && twilio.callFrom && twilio.callTo) {
    try {
      const twiml = `<Response><Say language="fr-FR" voice="alice">Alerte GSMD. ${title}. Un administrateur vient de se connecter. Consultez le journal d'audit.</Say></Response>`
      await twilioPost('Calls', { From: twilio.callFrom, To: twilio.callTo, Twiml: twiml })
      results.push('appel:ok')
    } catch (e) { results.push(`appel:erreur (${e.message.slice(0, 80)})`) }
  }
  if (results.length) console.log('• Notification admin :', results.join(' | '))
  return results
}
