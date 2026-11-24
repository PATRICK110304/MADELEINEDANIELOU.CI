// ============================================================
// client/src/components/CtaBand.tsx
// Bande d'appel à l'action finale : carte BEIGE claire bordée,
// fin trait orange au-dessus, CTA bleu principal.
// ============================================================
import { Link } from 'react-router-dom'
import Icon from './Icons'
import Reveal from './Reveal'

export default function CtaBand() {
  return (
    <section className="px-4 pt-12 pb-24 sm:px-6 lg:px-8">
      <Reveal>
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-mist ring-1 ring-navy-100">
          {/* Fin trait orange au-dessus de la carte */}
          <div className="absolute inset-x-0 top-0 h-1 bg-copper-500" aria-hidden="true" />

          <div className="flex flex-col items-center justify-between gap-6 px-8 py-12 text-center sm:px-12 lg:flex-row lg:text-left">
            <div className="max-w-2xl">
              <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-navy-100 bg-white px-4 py-1.5 text-[0.7rem] font-semibold tracking-[0.2em] text-navy-500 uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-copper-400" aria-hidden="true" />
                Admissions 2026 – 2027
              </p>
              <h2 className="font-display text-2xl leading-snug font-semibold text-copper-600 sm:text-3xl text-wrap:balance">
                Prêt à offrir l'excellence académique à votre enfant ?
              </h2>
              <p className="mt-2 text-sm font-medium text-ink/90 sm:text-base">
                Les places sont limitées — lancez la pré-inscription en ligne en moins de 5 minutes.
              </p>
            </div>
            <Link
              to="/inscriptions#preinscription"
              className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-navy-500 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-navy-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-navy-600 hover:shadow-xl"
            >
              Pré-inscrire maintenant
              <Icon name="arrowRight" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
