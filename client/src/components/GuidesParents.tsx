// ============================================================
// client/src/components/GuidesParents.jsx
// Section « Guides parents » : les 3 PDF officiels
// (2026-2027) téléchargeables directement depuis le site.
// ============================================================
import { guidesParents } from '../data/content'
import Icon from './Icons'
import SectionHeader from './SectionHeader'
import Reveal from './Reveal'

export default function GuidesParents() {
  return (
    <section id="guides" className="scroll-mt-24 bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeader
            eyebrow="Guides parents"
            title="Tout savoir avant la rentrée"
            subtitle="Les guides officiels de l'établissement (année scolaire 2026 – 2027), téléchargeables en PDF pour chaque cycle."
          />
        </Reveal>

        <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-3">
          {guidesParents.map((g, i) => (
            <Reveal key={g.file} delay={i * 90}>
              <a
                href={g.file}
                download
                className="group flex h-full flex-col rounded-3xl bg-white p-7 text-center shadow-md shadow-ink/5 ring-1 ring-navy-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-ink/10"
              >
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-copper-500 text-white shadow-md shadow-navy-500/20 transition-transform duration-300 group-hover:scale-110">
                  <Icon name="download" className="h-6 w-6" />
                </span>
                <p className="mt-4 text-xs font-semibold tracking-[0.2em] text-navy-500 uppercase">{g.cycle}</p>
                <h3 className="font-display mt-2 text-lg leading-snug font-semibold text-ink">{g.title}</h3>
                <span className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-navy-100 px-4 py-2 text-xs font-semibold text-ink/95 transition-colors group-hover:bg-navy-500 group-hover:text-white">
                  <Icon name="fileText" className="h-4 w-4" />
                  Télécharger le PDF
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
