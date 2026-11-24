// ============================================================
// server/src/services/sentinel.js — agent de surveillance
//
// Toutes les 15 min, analyse les événements d'authentification.
// Si une anomalie est détectée :
//  1) produit un résumé en français (LLM si AI_API_KEY est fourni,
//     sinon résumé deterministe),
//  2) bloque prudemment les IP les plus actives (>= 4 échecs/30 min),
//  3) alerte l'administrateur via les canaux configurés.
//
// Le LLM est optionnel et appelé UNIQUEMENT en cas d'anomalie.
// Aucun mot de passe ni token n'est envoyé au modèle.
// ============================================================
import { pool } from '../db.js'
import { notifyAdmin, createSecurityAlert, actionLinks } from './notify.js'
import { blockIp, isTrusted } from './security.js'
import { logAudit } from './audit.js'

const AI_URL = process.env.AI_API_URL || 'https://api.openai.com/v1/chat/completions'
const AI_KEY = process.env.AI_API_KEY || ''
const AI_MODEL = process.env.AI_MODEL || 'gpt-4o-mini'

async function stats() {
  const { rows } = await pool.query(
    `SELECT
       count(*)::int AS failures,
       count(DISTINCT ip)::int AS ips,
       count(DISTINCT email)::int AS emails,
       coalesce(max(created_at), now()) AS last_seen
     FROM public.auth_events
     WHERE success=false AND counted=true AND created_at > now() - interval '15 minutes'`,
  )
  const top = await pool.query(
    `SELECT ip, count(*)::int AS n, max(email) AS email
     FROM public.auth_events
     WHERE success=false AND counted=true AND created_at > now() - interval '15 minutes'
     GROUP BY ip ORDER BY n DESC LIMIT 5`,
  )
  return { ...rows[0], top: top.rows }
}

async function summarize(data) {
  const facts = `Échecs de connexion admin sur 15 min : ${data.failures}. IP distinctes : ${data.ips}. Emails visés : ${data.emails}. Détail : ${data.top.map((x) => `${x.ip} (${x.n} essais, email ${x.email || 'inconnu'})`).join(' ; ')}.`
  if (!AI_KEY) return `Activité suspecte détectée sur l'administration GSMD. ${facts}Blocage préventif des IP les plus actives. Consultez le journal d'audit.`

  try {
    const res = await fetch(AI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${AI_KEY}` },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [
          { role: 'system', content: 'Tu es un agent de sécurité. Réponds en français, en 3 phrases maximum, sans conseil d\'escalade. Décris factuellement les faits et la action prise.' },
          { role: 'user', content: facts },
        ],
        max_tokens: 120,
      }),
    })
    if (!res.ok) throw new Error(`IA ${res.status}`)
    const json = await res.json()
    return json.choices?.[0]?.message?.content?.trim() || `Activité suspecte. ${facts}`
  } catch (err) {
    console.warn('⚠ Résumé IA indisponible :', err.message)
    return `Activité suspecte détectée. ${facts}Blocage préventif appliqué.`
  }
}

export async function runSentinel() {
  try {
    const data = await stats()
    const anomalous = data.failures >= 8 || data.ips >= 3 || data.top.some((x) => x.n >= 4)
    if (!anomalous) return { scanned: true, anomalous: false, failures: data.failures }

    const blocked = []
    for (const entry of data.top) {
      if (entry.n >= 4 && !isTrusted(entry.ip)) {
        const ok = await blockIp(entry.ip, `${entry.n} échecs détectés par l'agent de surveillance`, 30 * 60 * 1000)
        if (ok) blocked.push(entry.ip)
      }
    }

    const summary = await summarize(data)
    if (!blocked.length) {
      const links = await createSecurityAlert(
        data.top[0]?.ip || 'inconnue',
        `${data.failures} échecs de connexion en 15 min`,
      )
      await notifyAdmin('Activité suspecte détectée', `${summary}${actionLinks(links)}`)
    }
    await logAudit('sentinel', null, `${data.failures} échecs / ${data.ips} IP — bloquées: ${blocked.length}`)
    return { scanned: true, anomalous: true, failures: data.failures, blocked }
  } catch (err) {
    console.warn('⚠ Sentinel indisponible :', err.message)
    return { scanned: false, error: err.message }
  }
}
