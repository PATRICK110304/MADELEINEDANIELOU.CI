// ============================================================
// client/src/components/Heritage.jsx
// Section #heritage — Héritage & Fondatrice :
//   • Portrait d'Odile de Vasselot (pionnière Daniélou-Éducation CI)
//   • Hommage officiel du site madeleinedanielou.ci
//   • Citation de Madeleine Daniélou + mission du GSMD
// ============================================================
import { heritage, mission } from '../data/content'
import PhotoCard from './PhotoCard'
import Icon from './Icons'
import SectionHeader from './SectionHeader'
import Reveal from './Reveal'

export default function Heritage() {
  return (
    <section id="heritage" className="scroll-mt-24 bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeader
            eyebrow="Héritage & Fondatrice"
            title="Des femmes debout, une tradition fidèle"
            subtitle="L'histoire du GSMD est portée par de grandes figures d'éducation, de Madeleine Daniélou à Odile de Vasselot."
          />
        </Reveal>

        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">
          {/* ----- Carte hommage à Odile de Vasselot (photo nette + gradient) ----- */}
          <Reveal>
            <PhotoCard
              image={heritage.photo}
              alt="Hommage à Odile de Vasselot — Côte d'Ivoire et France"
              title={heritage.title}
              label={heritage.role}
              className="h-72 sm:h-80"
            />
          </Reveal>

          {/* ----- Citations : mission + Madeleine Daniélou ----- */}
          <Reveal delay={120}>
            <div className="flex h-full flex-col gap-6">
              {/* Mission du groupe scolaire (texte officiel) */}
              <div className="flex-1 rounded-3xl bg-mist p-8 ring-1 ring-navy-100">
                <p className="text-xs font-semibold tracking-[0.25em] text-navy-500 uppercase">Notre mission</p>
                <blockquote className="font-display mt-4 text-xl leading-relaxed font-medium text-copper-500 sm:text-2xl">
                  « {mission.quote} »
                </blockquote>
              </div>

              {/* Citation de Madeleine Daniélou */}
              <div className="flex-1 rounded-3xl bg-navy-50/70 p-8 ring-1 ring-navy-100">
                <span className="font-display text-5xl leading-none text-navy-500" aria-hidden="true">“</span>
                <blockquote className="font-display mt-1 text-lg leading-relaxed text-ink italic sm:text-xl text-wrap:balance">
                  {mission.citation}
                </blockquote>
                <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-navy-700">
                  <Icon name="heart" className="h-4 w-4" />
                  {mission.citationAuteur}
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* ----- Peintures murales du campus (photos officielles) ----- */}
        <Reveal delay={150}>
          <div className="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2">
            <figure className="overflow-hidden rounded-3xl shadow-md shadow-ink/5 ring-1 ring-navy-100">
              <img src="/images/peinture-murale.webp" alt="Peinture murale du campus" loading="lazy" className="h-56 w-full object-cover transition-transform duration-500 hover:scale-105" />
            </figure>
            <figure className="overflow-hidden rounded-3xl shadow-md shadow-ink/5 ring-1 ring-navy-100">
              <img src="/images/peinture-jeunefille.webp" alt="Œuvre d'art du campus" loading="lazy" className="h-56 w-full object-cover transition-transform duration-500 hover:scale-105" />
            </figure>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
