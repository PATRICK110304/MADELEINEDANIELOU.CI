// ============================================================
// client/src/pages/EcolePage.tsx — À propos / Notre école
// Contenus strictement transmis par l'établissement.
// ============================================================
import { ecole } from '../data/infos-ecole'
import SectionHeader from '../components/SectionHeader'
import Reveal from '../components/Reveal'
import Icon from '../components/Icons'

export default function EcolePage() {
  return (
    <div className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeader
            eyebrow="Notre école"
            title={ecole.nom}
            subtitle={ecole.nature}
          />
        </Reveal>

        {/* Cycles */}
        <Reveal delay={60}>
          <section className="mt-12">
            <h2 className="font-display text-2xl font-semibold text-ink">Les cycles</h2>
            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {ecole.cycles.map((cycle) => (
                <div key={cycle} className="rounded-3xl bg-mist p-6 text-center ring-1 ring-navy-100">
                  <p className="font-display text-lg font-semibold text-navy-500">{cycle}</p>
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        {/* Origines + Philosophie */}
        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          <Reveal>
            <section className="rounded-3xl bg-mist p-8 ring-1 ring-navy-100">
              <h2 className="font-display text-2xl font-semibold text-ink">Nos origines</h2>
              <ul className="mt-5 space-y-3">
                {ecole.origines.map((o) => (
                  <li key={o} className="flex gap-3 text-ink/90">
                    <Icon name="check" className="mt-0.5 h-5 w-5 shrink-0 text-navy-500" />
                    {o}
                  </li>
                ))}
              </ul>
            </section>
          </Reveal>
          <Reveal delay={80}>
            <section className="rounded-3xl bg-white p-8 ring-1 ring-navy-100">
              <h2 className="font-display text-2xl font-semibold text-ink">Notre philosophie</h2>
              <p className="mt-4 leading-relaxed text-ink/90">{ecole.philosophie}</p>
            </section>
          </Reveal>
        </div>

        {/* Horaires + Uniforme */}
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <Reveal>
            <section className="rounded-3xl bg-white p-8 ring-1 ring-navy-100">
              <h2 className="font-display text-2xl font-semibold text-ink">Horaires</h2>
              <dl className="mt-5 space-y-3 text-ink/90">
                <div className="flex justify-between gap-4 border-b border-navy-100 pb-2">
                  <dt>Matin</dt><dd className="font-semibold text-navy-500">{ecole.horaires.matin}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt>Après-midi</dt><dd className="font-semibold text-navy-500">{ecole.horaires.apresMidi}</dd>
                </div>
              </dl>
            </section>
          </Reveal>
          <Reveal delay={80}>
            <section className="rounded-3xl bg-mist p-8 ring-1 ring-navy-100">
              <h2 className="font-display text-2xl font-semibold text-ink">Uniforme</h2>
              <p className="mt-4 leading-relaxed text-ink/90">{ecole.uniforme}</p>
            </section>
          </Reveal>
        </div>
      </div>
    </div>
  )
}
