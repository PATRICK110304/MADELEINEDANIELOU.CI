// ============================================================
// client/src/services/api.js
// Couche d'accès à l'API Express + mécanisme de repli local.
//  • getPodcasts()      → /api/podcasts        (ou fallback local)
//  • getDocuments()     → /api/documents       (ou fallback local)
//  • submitInscription()→ POST /api/inscriptions
//  • reCAPTCHA v3       → chargé dynamiquement si VITE_RECAPTCHA_SITE_KEY
// ============================================================
import { useState, useEffect } from 'react'
import {
  fallbackPodcasts,
  fallbackDocuments,
} from '../data/content'

/* Base de l'API : '' en dev (proxy Vite) ou URL complète en prod */
export const API_BASE = import.meta.env.VITE_API_URL ?? ''

/* ------------------------------------------------------------
 * Requête générique : JSON + gestion d'erreurs explicite
 * ------------------------------------------------------------ */
async function request(path, options = {}) {
  const res = await fetch(API_BASE + path, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || `Erreur ${res.status}`)
  return data
}

/* ------------------------------------------------------------
 * reCAPTCHA v3 (Google) — chargé à la demande, jamais en dev
 * ------------------------------------------------------------ */
const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY ?? ''

export function ensureRecaptcha() {
  return new Promise((resolve) => {
    if (!RECAPTCHA_SITE_KEY) return resolve(null) // désactivé : mode dev
    if (window.grecaptcha?.execute) return resolve(window.grecaptcha)
    const s = document.createElement('script')
    s.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`
    s.onload = () => window.grecaptcha.ready(() => resolve(window.grecaptcha))
    s.onerror = () => resolve(null)
    document.head.appendChild(s)
  })
}

/** Retourne un token reCAPTCHA v3 pour l'action donnée (ou null si désactivé) */
export async function getRecaptchaToken(action = 'submit') {
  const g = await ensureRecaptcha()
  if (!g) return null
  return g.execute(RECAPTCHA_SITE_KEY, { action })
}

/* ------------------------------------------------------------
 * PODCASTS — liste des épisodes de la Web Radio
 * ------------------------------------------------------------ */
export function usePodcasts() {
  const [state, setState] = useState({
    items: [],
    offline: false,
    loading: true,
  })

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const data = await request('/api/podcasts')
        // Les URL renvoyées par l'API sont relatives (/audios/…) :
        // on les préfixe par la base si l'API tourne sur un autre domaine.
        const items = data.items.map((p) => ({
          ...p,
          src: (API_BASE || '') + p.url,
          file: p.url?.split('/').pop() ?? '',
        }))
        alive && setState({ items, offline: false, loading: false })
      } catch {
        // Repli : fichiers statiques de client/public/audios/
        const items = fallbackPodcasts.map((p) => ({
          ...p,
          src: `/audios/${p.file}`,
          url: `/audios/${p.file}`,
        }))
        alive && setState({ items, offline: true, loading: false })
      }
    })()
    return () => { alive = false }
  }, [])

  return state
}

/* ------------------------------------------------------------
 * DOCUMENTS — fiches PDF téléchargeables (Collège / Lycée)
 * ------------------------------------------------------------ */
export function useDocuments() {
  const [state, setState] = useState({
    items: [],
    offline: false,
    loading: true,
  })

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const data = await request('/api/documents')
        const items = data.items.map((d) => ({
          ...d,
          href: (API_BASE || '') + d.url,
          file: d.url?.split('/').pop() ?? '',
        }))
        alive && setState({ items, offline: false, loading: false })
      } catch {
        // Repli : fichiers statiques de client/public/documents/
        const items = fallbackDocuments.map((d) => ({
          ...d,
          href: `/documents/${d.file}`,
          url: `/documents/${d.file}`,
        }))
        alive && setState({ items, offline: true, loading: false })
      }
    })()
    return () => { alive = false }
  }, [])

  return state
}

/* ------------------------------------------------------------
 * PRÉ-INSCRIPTION — envoi du dossier
 * Le serveur génère un numéro de dossier unique (ex. INS-2026-8F3A21).
 * En cas d'indisponibilité réseau : repli local + référence MDL-….
 * ------------------------------------------------------------ */
export async function submitInscription(payload) {
  // Token reCAPTCHA v3 (null si la clé n'est pas configurée)
  const recaptchaToken = await getRecaptchaToken('preinscription')
  try {
    return await request('/api/inscriptions', {
      method: 'POST',
      body: JSON.stringify({ ...payload, recaptchaToken }),
    })
  } catch (err) {
    if (err instanceof TypeError) {
      // Réseau indisponible → génération locale de secours
      const ref = `MDL-2026-${Math.floor(1000 + Math.random() * 9000)}`
      return { reference: ref, offline: true }
    }
    // Erreur métier renvoyée par l'API (validation, captcha…)
    throw err
  }
}
