// ============================================================
// client/src/components/Institution.tsx
// Section éditoriale « Qui sommes-nous » : texte rédigé sur
// mesure (ton de l'établissement), photo historique réelle
// (Madeleine Daniélou, 1923) décalée, citation officielle.
// Composition asymétrique, aucune grille de cartes.
// ============================================================
import { Link } from 'react-router-dom'
import { about, mission } from '../data/content'
import Icon from './Icons'
import Reveal from './Reveal'

export default function Institution() {
  return (
    <section className="bg-white py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-x-12 lg:gap-y-24">
          {/* ----- Texte (colonne large) ----- */}
          <Reveal className="lg:col-span-7">
            <h2 className="font-display text-3xl leading-tight font-semibold text-navy-700 sm:text-4xl">
              Une école née d'une conviction,
              <br className="hidden sm:block" /> cent ans plus tôt à Paris
            </h2>

            <div className="mt-6 max-w-[65ch] space-y-4 text-base leading-relaxed text-ink/90">
              <p>
                En 1907, Madeleine Daniélou — l'une des premières agrégées de lettres de France —
                ouvre une école pour former des enseignantes. De cette première classe naît une
                communauté consacrée à l'éducation, présente aujourd'hui en Côte d'Ivoire depuis 1962.
              </p>
              <p>
                Depuis <strong className="font-semibold text-ink">2020</strong>, le Groupe Scolaire
                Daniélou Abidjan accueille les élèves de Bingerville et d'Abidjan, de la maternelle
                jusqu'au lycée. Un établissement de filles, d'inspiration chrétienne ouvert à toutes,
                animé par la Communauté Saint-François-Xavier.
              </p>
            </div>

            {/* Citation officielle — mise en valeur sobre */}
            <blockquote className="mt-8 border-l-2 border-accent pl-6">
              <p className="font-display text-lg leading-relaxed text-ink italic">
                « {mission.quote} »
              </p>
              <cite className="mt-3 block text-xs font-semibold tracking-widest text-ink/95 uppercase not-italic">
                Projet éducatif du GSMD
              </cite>
            </blockquote>

            <div className="mt-8 flex flex-wrap items-center gap-5">
              <Link
                to="/qui-sommes-nous"
                className="group inline-flex items-center gap-2 rounded-full bg-navy-500 px-6 py-3 text-sm font-semibold text-white hover:bg-navy-600 transition-transform duration-300 hover:translate-x-0.5"
              >
                Notre histoire en détail
                <Icon name="arrowRight" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <span className="text-xs font-medium text-ink/95">
                1907 Paris · 1962 Côte d'Ivoire · 2020 Bingerville
              </span>
            </div>
          </Reveal>

          {/* ----- Photo historique décalée + légende ----- */}
          <Reveal delay={120} className="lg:col-span-5">
            <div className="relative mx-auto max-w-sm lg:mr-0 lg:ml-auto">
              {/* Cadre offset (accent discret) */}
              <div className="absolute -right-4 -bottom-4 h-full w-full rounded-2xl bg-navy-50" aria-hidden="true" />
              <figure className="relative overflow-hidden rounded-2xl ring-1 ring-navy-200">
                <img
                  src={about.photo}
                  alt={about.photoCaption}
                  loading="lazy"
                  className="aspect-[4/5] w-full object-cover"
                />
              </figure>
              <figcaption className="relative mt-4 flex items-center gap-3 text-xs text-ink/90">
                <span className="h-px w-8 shrink-0 bg-accent" aria-hidden="true" />
                {about.photoCaption} — fondatrice de la première école Daniélou
              </figcaption>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
