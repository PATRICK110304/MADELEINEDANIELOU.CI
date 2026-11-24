// ============================================================
// server/src/services/email.js — Envoi d'emails via Nodemailer.
// Vars d'env (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS,
// CONTACT_EMAIL_FROM, CONTACT_EMAIL_TO, CONTACT_EMAIL_SUBJECT).
// Sans SMTP_HOST configuré → les emails sont ENREGISTRÉS dans la
// db (visible via /api/contact/admin) — test sans infra.
// ============================================================
import nodemailer from 'nodemailer'
import { config } from '../config.js'

export const EMAIL_ENABLED = Boolean(
  process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS,
)

let cachedTransport = null

function getTransport() {
  if (cachedTransport) return cachedTransport
  if (!EMAIL_ENABLED) return null
  cachedTransport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT || 587) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  })
  return cachedTransport
}

/** Envoie l'email (le message est déjà persisté par la route) */
export async function sendContactEmail(form) {
  const transport = getTransport()
  if (!transport) return { emailSent: false, emailReason: 'SMTP non configuré — sauvegardé dans la base' }

  const to = process.env.CONTACT_EMAIL_TO || form.email
  const from = process.env.CONTACT_EMAIL_FROM || form.email
  const res = await transport.sendMail({
    from,
    to,
    subject: `[GSMD] ${form.subject} — ${form.name}`,
    text: `${form.name} (${form.email})${form.phone ? ` — ${form.phone}` : ''}\n\n${form.message}`,
  })
  return { emailSent: true, emailReason: `Envoyé à ${res.envelope.to}`, id }
}
