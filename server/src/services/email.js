// ============================================================
// server/src/services/email.js — envoi des messages de contact
//
// 1) RESEND_API_KEY définie  -> API HTTPS Resend (recommandé,
//    fonctionne derrière un réseau qui bloque les ports SMTP).
// 2) Sinon SMTP_HOST/USER/PASS -> Nodemailer (fallback générique).
// 3) Rien de configuré -> le message reste enregistré en base
//    (emailSent:false), visible dans /api/contact/admin.
//
// La route a déjà persisté le message AVANT cet appel : une erreur
// d'envoi ne doit jamais faire échouer la réponse au visiteur.
// ============================================================
import nodemailer from 'nodemailer'
import { Resend } from 'resend'

const RESEND_ENABLED = Boolean(process.env.RESEND_API_KEY)
const SMTP_ENABLED = Boolean(
  process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS,
)

export const EMAIL_ENABLED = RESEND_ENABLED || SMTP_ENABLED
export const EMAIL_PROVIDER = RESEND_ENABLED ? 'resend' : SMTP_ENABLED ? 'smtp' : 'none'

let cachedResend = null
let cachedTransport = null

function getResend() {
  if (!cachedResend) cachedResend = new Resend(process.env.RESEND_API_KEY)
  return cachedResend
}

function getTransport() {
  if (cachedTransport) return cachedTransport
  cachedTransport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT || 587) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  })
  return cachedTransport
}

/** Envoie l'email (le message est déjà persisté par la route). */
export async function sendContactEmail(form) {
  if (!EMAIL_ENABLED) {
    return { emailSent: false, emailReason: 'Email non configuré — sauvegardé dans la base' }
  }

  const to = process.env.CONTACT_EMAIL_TO || 'groupescolaire@madeleinedanielou.ci'
  const from = process.env.CONTACT_EMAIL_FROM || process.env.EMAIL_FROM
    || 'Groupe Scolaire Daniélou <groupescolaire@madeleinedanielou.ci>'
  const subject = `[GSMD] ${form.subject} — ${form.name}`
  const text = `${form.name} (${form.email})${form.phone ? ` — ${form.phone}` : ''}\n\n${form.message}`

  if (RESEND_ENABLED) {
    const { data, error } = await getResend().emails.send({
      from,
      to,
      reply_to: form.email,
      subject,
      text,
    })
    if (error) throw new Error(`Resend : ${error.message}`)
    return { emailSent: true, emailReason: `Envoyé via Resend à ${to}`, id: data?.id }
  }

  const res = await getTransport().sendMail({ from, to, subject, text })
  return { emailSent: true, emailReason: `Envoyé à ${res.envelope.to}`, id: res.messageId }
}
