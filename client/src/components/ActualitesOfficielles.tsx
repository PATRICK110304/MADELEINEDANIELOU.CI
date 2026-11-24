// ============================================================
// client/src/components/ActualitesOfficielles.tsx — Nouvelles
// actualités transmises par l'établissement (dimensions fournies).
// ============================================================
import { actualitesInfo } from '../data/infos-ecole'
import SectionHeader from './SectionHeader'
import Reveal from './Reveal'
import Icon from './Icons'

export default function ActualitesOfficielles() {
  return (
    <section className="bg-mist py-20 lg:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeader as="h1" eyebrow="Vie du GSMD" title="Actualités de l'établissement" subtitle="Groupe Scolaire Madeleine-Daniélou, Abidjan" />
        </Reveal>
        <ol className="mt-12 divide-y divide-navy-100 border-y border-navy-100">
          {actualitesInfo.map((a) => (
            <Reveal key={a.date + a.titre}>
              <li className="grid gap-2 py-7 sm:grid-cols-[10rem_1fr] sm:gap-8">
                <p className="text-sm font-semibold text-navy-500">{a.date}</p>
                <div>
                  <h3 className="flex items-start gap-2 font-display text-xl font-semibold text-ink">
                    <Icon name="star" className="mt-1 h-4 w-4 shrink-0 text-copper-500" />
                    {a.titre}
                  </h3>
                  {a.description && <p className="mt-2 leading-relaxed text-ink/90">{a.description}</p>}
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
