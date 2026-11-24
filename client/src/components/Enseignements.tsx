// ============================================================
// client/src/components/Enseignements.jsx
// Section #enseignements — cycles PRÉSCOLAIRE & PRIMAIRE en
// cartes premium (photos officielles, responsables, classes).
// Les cycles COLLÈGE & LYCÉE sont mis en valeur séparément
// dans SecondaireTabs.jsx (onglets dédiés), conformément à
// l'exigence institutionnelle.
// ============================================================
import PhotoCard from './PhotoCard'
import { enseignements } from '../data/content'
import Icon from './Icons'
import SectionHeader from './SectionHeader'
import Reveal from './Reveal'

export default function Enseignements() {
  /* Préscolaire + Primaire (le secondaire → SecondaireTabs) */
  const premierCycle = enseignements.cycles.filter((c) => ['maternelle', 'primaire'].includes(c.id))
  const sec = enseignements.secondaire

  return (
    <section id="enseignements" className="mesh-mist scroll-mt-24 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeader as="h1"
            eyebrow="Enseignements"
            title="Du préscolaire au lycée"
            subtitle="Quatre cycles, un même projet pédagogique : former des jeunes filles responsables, réfléchies et ouvertes sur le monde."
          />
        </Reveal>

        {/* ----- Préscolaire & Primaire : cartes premium ----- */}
        <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2">
          {premierCycle.map((c, i) => (
            <Reveal key={c.id} delay={i * 80}>
              <PhotoCard
                id={c.id}
                className="h-44 sm:h-52"
                image={c.image}
                alt={c.label}
                title={c.label}
                desc={c.note}
              />
            </Reveal>
          ))}
        </div>

        {/* ----- À tous les niveaux + orientations pédagogiques ----- */}
        <div className="mx-auto mt-8 grid max-w-6xl gap-6 lg:grid-cols-2">
          <Reveal>
            <article className="h-full rounded-3xl bg-white p-7 ring-1 ring-navy-100 shadow-[0_10px_40px_-18px_rgb(26_26_26/0.10)]">
              <h3 className="font-display flex items-center gap-2.5 text-xl font-semibold text-ink">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy-50 text-navy-500 ring-1 ring-navy-100">
                  <Icon name="bookOpen" className="h-4.5 w-4.5" />
                </span>
                À tous les niveaux
              </h3>
              <ul className="mt-5 space-y-3">
                {enseignements.niveaux.map((n) => (
                  <li key={n} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink/95">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-copper-400" aria-hidden="true" />
                    {n}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
          <Reveal delay={100}>
            <article className="h-full rounded-3xl bg-white p-7 ring-1 ring-navy-100 shadow-[0_10px_40px_-18px_rgb(26_26_26/0.10)]">
              <h3 className="font-display flex items-center gap-2.5 text-xl font-semibold text-ink">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-copper-500 text-white">
                  <Icon name="check" className="h-4.5 w-4.5" />
                </span>
                Quelques orientations pédagogiques
              </h3>
              <p className="mt-3 text-xs font-semibold tracking-widest text-navy-500 uppercase">Développer</p>
              <ul className="mt-4 space-y-3">
                {enseignements.orientations.map((o) => (
                  <li key={o} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink/95">
                    <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-navy-500" />
                    {o}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        </div>

        {/* ----- Le secondaire : direction + effectif (résumé, détail → onglets Collège/Lycée) ----- */}
        <Reveal delay={120}>
          <div className="mx-auto mt-8 max-w-6xl rounded-3xl bg-mist p-7 ring-1 ring-navy-100 sm:p-9">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h3 className="font-display flex items-center gap-3 text-xl font-semibold text-ink sm:text-2xl">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white ring-1 ring-navy-100 text-navy-500">
                  <Icon name="cap" className="h-5 w-5" />
                </span>
                Le Secondaire — Collège &amp; Lycée
              </h3>
              <div className="flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-ink ring-1 ring-navy-100">
                  <Icon name="users" className="h-4 w-4 text-navy-500" />
                  Direction : {sec.directrice}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-ink ring-1 ring-navy-100">
                  <Icon name="check" className="h-4 w-4 text-navy-500" />
                  {sec.effectif}
                </span>
              </div>
            </div>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div className="rounded-2xl bg-white p-5 ring-1 ring-navy-100">
                <p className="text-xs font-semibold tracking-[0.2em] text-navy-500 uppercase">Collège</p>
                <p className="mt-2 text-sm font-medium text-ink/95">{sec.college.join(' · ')}</p>
              </div>
              <div className="rounded-2xl bg-white p-5 ring-1 ring-navy-100">
                <p className="text-xs font-semibold tracking-[0.2em] text-navy-500 uppercase">Lycée</p>
                <p className="mt-2 text-sm font-medium text-ink/95">{sec.lycee.join(' · ')}</p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* ----- Photos officielles (labo, couture, musée, lycée) ----- */}
        <Reveal delay={150}>
          <div className="mx-auto mt-8 grid max-w-6xl grid-cols-2 gap-4 lg:grid-cols-4">
            {enseignements.photos.map((p) => (
              <figure key={p.src} className="group overflow-hidden rounded-2xl ring-1 ring-navy-100 shadow-[0_8px_30px_-14px_rgb(26_26_26/0.12)] transition-all duration-300 hover:ring-copper-300">
                <img src={p.src} alt={p.alt} loading="lazy" className="h-36 w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:h-44" />
                <figcaption className="bg-white px-3 py-2 text-center text-[0.7rem] font-medium text-ink/95">{p.alt}</figcaption>
              </figure>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
