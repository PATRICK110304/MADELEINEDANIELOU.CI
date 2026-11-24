// ============================================================
// client/src/components/CookieBanner.tsx
// Bandeau de consentement (RGPD / loi ivoirienne n° 2013-450).
// Deux choix de même taille : tout accepter / tout refuser.
// Le choix est conservé dans localStorage et peut être modifié
// depuis la page « Politique de confidentialité ».
// ============================================================
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export const CONSENT_KEY = 'gsmd-cookie-consent'

type Choice = 'all' | 'none'

export function readConsent(): Choice | null {
  try {
    const v = localStorage.getItem(CONSENT_KEY)
    return v === 'all' || v === 'none' ? v : null
  } catch {
    return null
  }
}

export default function CookieBanner() {
  const [choice, setChoice] = useState<Choice | null>(() => readConsent())

  useEffect(() => {
    // Permet à la page de confidentialité de mettre à jour le choix.
    const sync = () => setChoice(readConsent())
    window.addEventListener('gsmd:consent', sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener('gsmd:consent', sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  if (choice !== null) return null

  const decide = (value: Choice) => {
    try { localStorage.setItem(CONSENT_KEY, value) } catch { /* navigation privée */ }
    window.dispatchEvent(new Event('gsmd:consent'))
    setChoice(value)
  }

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-title"
      aria-describedby="cookie-desc"
      className="fixed inset-x-0 bottom-0 z-[70] border-t-4 border-navy-500 bg-white px-4 py-3 shadow-[0_-10px_40px_rgba(11,92,160,0.12)] sm:px-6 sm:py-5"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-3xl">
          <h2 id="cookie-title" className="font-display text-lg font-semibold text-ink">
            Votre vie privée compte
          </h2>
          <p id="cookie-desc" className="mt-1 text-sm leading-relaxed text-ink/90">
            Nous utilisons des cookies pour assurer le fonctionnement du site et mesurer son audience.
            Vous pouvez accepter ou refuser — votre choix s'applique immédiatement et reste modifiable
            à tout moment depuis la{' '}
            <Link to="/politique-confidentialite" className="font-semibold text-navy-500 underline underline-offset-2 focus-visible:ring-2 focus-visible:ring-navy-300">
              politique de confidentialité
            </Link>.
          </p>
        </div>
        <div className="flex w-full gap-3 sm:w-auto">
          <button
            type="button"
            onClick={() => decide('all')}
            className="min-h-[48px] w-full flex-1 rounded-full bg-navy-500 px-6 text-sm font-semibold text-white transition-colors hover:bg-navy-600 focus-visible:ring-2 focus-visible:ring-navy-300 sm:w-40 sm:flex-none"
          >
            Tout accepter
          </button>
          <button
            type="button"
            onClick={() => decide('none')}
            className="min-h-[48px] w-full flex-1 rounded-full border border-navy-200 bg-white px-6 text-sm font-semibold text-ink transition-colors hover:border-navy-400 hover:bg-mist focus-visible:ring-2 focus-visible:ring-navy-300 sm:w-40 sm:flex-none"
          >
            Tout refuser
          </button>
        </div>
      </div>
    </div>
  )
}
