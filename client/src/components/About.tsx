// ============================================================
// client/src/components/About.jsx
// Section #apropos — « Qui sommes-nous ? » :
// TEXTE OFFICIEL de la page du site. Chronologie réelle
// 1907 → 2020, photo historique « Madeleine en 1923 ».
// ============================================================
import PhotoCard from './PhotoCard'
import { about, mission } from '../data/content'
import Icon from './Icons'
import SectionHeader from './SectionHeader'
import Reveal from './Reveal'

export default function About() {
  return (
    <section id="apropos" className="scroll-mt-24 bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeader
            eyebrow="Qui sommes-nous ?"
            title={about.title}
            subtitle={about.accent}
          />
        </Reveal>

        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.15fr_1fr]">
          {/* ----- Colonne texte : histoire officielle + chronologie ----- */}
          <Reveal>
            <div className="flex h-full flex-col">
              <p className="leading-relaxed text-ink/95">{about.text}</p>

              {/* Chronologie réelle (lignes temporelles orange) */}
              <ol className="relative mt-8 space-y-6 border-l-2 border-navy-200 pl-6">
                {about.timeline.map((t, i) => (
                  <li key={t.year} className="relative">
                    {/* Puce orange */}
                    <span
                      className={`absolute -left-[1.95rem] flex h-6 w-6 items-center justify-center rounded-full text-[0.55rem] font-bold ${
                        i === about.timeline.length - 1 ? 'bg-navy-500 text-white' : 'bg-navy-100 text-navy-700'
                      }`}
                      aria-hidden="true"
                    >
                      {t.year.slice(2)}
                    </span>
                    <p className="text-sm font-semibold text-navy-500">{t.year}</p>
                    <p className="mt-1 text-sm leading-relaxed text-ink/95">{t.text}</p>
                  </li>
                ))}
              </ol>

              <p className="mt-8 flex items-start gap-2.5 rounded-xl bg-navy-50 p-4 text-xs leading-relaxed text-navy-800">
                <Icon name="users" className="mt-0.5 h-4 w-4 shrink-0 text-navy-500" />
                {about.reseau}
              </p>
            </div>
          </Reveal>

          {/* ----- Colonne visuelle : photo historique + citation ----- */}
          <Reveal delay={120}>
            <div className="flex h-full flex-col gap-6">
              <PhotoCard image={about.photo} alt={about.photoCaption} title={about.photoCaption} className="h-72 sm:h-80" />

              {/* Citation de Madeleine Daniélou (officielle) */}
              <div className="flex-1 rounded-3xl bg-mist p-7 ring-1 ring-navy-100">
                <span className="font-display text-5xl leading-none text-copper-400" aria-hidden="true">“</span>
                <blockquote className="font-display text-lg leading-relaxed font-medium text-ink italic">
                  {mission.citation}
                </blockquote>
                <p className="mt-4 text-sm font-semibold tracking-wide text-navy-500">— {mission.citationAuteur}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
