// ============================================================
// client/src/components/Project.jsx
// Section #projet — « Projet éducatif » : TEXTE OFFICIEL
// intégral. 4 engagements + Responsables de Division + Les Avis.
// ============================================================
import { projetEducatif } from '../data/content'
import Icon from './Icons'
import SectionHeader from './SectionHeader'
import Reveal from './Reveal'

/* Icônes attribuées aux 4 engagements officiels */
const icons = ['users', 'heart', 'star', 'shield']

export default function Project() {
  return (
    <section id="projet" className="relative scroll-mt-24 overflow-hidden bg-white py-20 lg:py-28">

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeader as="h1"
            eyebrow="Projet éducatif"
            title="Une éducation selon l'esprit"
            subtitle={projetEducatif.intro}
          />
        </Reveal>

        {/* ----- Les 4 engagements officiels ----- */}
        <div className="mx-auto mt-10 grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {projetEducatif.engagements.map((e, i) => (
            <Reveal key={e.title} delay={i * 70}>
              <article className="group flex h-full flex-col rounded-3xl bg-white p-6 shadow-lg shadow-ink/5 ring-1 ring-navy-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-ink/10">
                <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-copper-500 text-white shadow-md shadow-navy-500/20 transition-transform duration-300 group-hover:scale-110">
                  <Icon name={icons[i]} className="h-5 w-5" />
                </span>
                <h3 className="font-display text-lg leading-snug font-semibold text-ink">{e.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/95">{e.text}</p>
              </article>
            </Reveal>
          ))}
        </div>

        {/* ----- Spécificités officielles ----- */}
        <div className="mx-auto mt-10 grid max-w-6xl gap-6 lg:grid-cols-2">
          <Reveal>
            <article className="h-full rounded-3xl bg-copper-500 p-8 shadow-lg shadow-ink/10">
              <h3 className="font-display flex items-center gap-2.5 text-xl font-semibold text-white">
                <Icon name="cap" className="h-5 w-5" />
                {projetEducatif.division.title}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-white/90">{projetEducatif.division.text}</p>
            </article>
          </Reveal>
          <Reveal delay={100}>
            <article className="h-full rounded-3xl bg-navy-50/70 p-8 ring-1 ring-navy-100">
              <h3 className="font-display flex items-center gap-2.5 text-xl font-semibold text-ink">
                <Icon name="users" className="h-5 w-5 text-navy-600" />
                {projetEducatif.avis.title}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-ink/95">{projetEducatif.avis.text}</p>
            </article>
          </Reveal>
        </div>

        {/* ----- Conclusion officielle ----- */}
        <Reveal delay={140}>
          <p className="mx-auto mt-10 max-w-3xl text-center font-display text-lg font-medium text-ink italic sm:text-xl">
            {projetEducatif.conclusion}
          </p>
        </Reveal>
      </div>
    </section>
  )
}
