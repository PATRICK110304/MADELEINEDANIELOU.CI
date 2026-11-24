// ============================================================
// client/src/components/Reussites.tsx
// Page « Résultats et réussites » — contenu STRICTEMENT
// officiel (aucun taux inventé) :
//   • Points d'honneur : label UNESCO, réseau, effectifs
//   • Réalisations des élèves (timeline rédactionnelle)
//   • Renvoi vers la galerie photos et les actualités
// ============================================================
import { Link } from 'react-router-dom'
import Icon from './Icons'
import PhotoCard from './PhotoCard'
import Reveal from './Reveal'

const honneurs = [
  {
    label: 'École associée UNESCO',
    text: "Le GSMD appartient au réseau international des établissements associés à l'UNESCO, un engagement d'ouverture et de paix.",
  },
  {
    label: 'Réseau Daniélou-Éducation',
    text: 'Huit établissements dans le monde — Rueil, Neuilly, Bobigny, Garges, Paris, Rome, Séoul et Abidjan — partagent le même projet éducatif.',
  },
  {
    label: 'Effectifs maîtrisés',
    text: '30 élèves maximum en primaire, 35 en secondaire : chaque élève est suivi, connu, accompagné.',
  },
]

const realisations = [
  {
    date: 'Septembre 2025',
    title: 'Action sociale à EPP Djorogobité 2',
    text: "Les élèves du GSMD ont offert des latrines neuves à une école primaire publique de Cocody qui en était dépourvue depuis deux ans. Une leçon de solidarité vécue, pas récitées.",
    image: '/images/news-memoire.webp',
  },
  {
    date: 'Mai 2026',
    title: 'Séjour pédagogique à Daniélou-Reuil',
    text: "Une délégation d'élèves a passé une semaine au Lycée Madeleine-Daniélou de Rueil-Malmaison : classes partagées, échanges, découverte de la France.",
    image: '/images/news-reuil-1.webp',
  },
  {
    date: 'Octobre 2026',
    title: 'Le club coréen ouvre la voie',
    text: "Langue, culture et échanges avec le Lycée International Xavier de Séoul — et une audience à l'Ambassadeur de Corée en Côte d'Ivoire.",
    image: '/images/news-coree-1.webp',
  },
]

export default function Reussites() {
  return (
    <section className="bg-mist py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ----- En-tête éditorial ----- */}
        <Reveal>
          <div className="mb-14 max-w-2xl">
            <p className="mb-3 flex items-center gap-3 text-xs font-semibold tracking-[0.25em] text-navy-500 uppercase">
              <span className="h-px w-10 bg-accent" aria-hidden="true" />
              Résultats &amp; réussites
            </p>
            <h2 className="font-display text-3xl leading-tight font-semibold text-navy-700 sm:text-4xl">
              Ce dont nos élèves sont capables
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink/95">
              La réussite ne se résume pas à un taux de réussite : c'est aussi ce que les élèves
              construisent, transmettent et partagent, à Bingerville et au-delà.
            </p>
          </div>
        </Reveal>

        {/* ----- Points d'honneur : liste rédactionnelle (pas de cartes identiques) ----- */}
        <div className="mx-auto max-w-4xl">
          <ol className="divide-y divide-navy-100 border-y border-navy-100">
            {honneurs.map((h, i) => (
              <Reveal key={h.label} delay={i * 80}>
                <li className="grid gap-2 py-7 sm:grid-cols-[auto_1fr] sm:gap-8">
                  <span className="font-display text-2xl font-semibold text-accent/90 sm:text-3xl">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-ink">{h.label}</h3>
                    <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-ink/95">{h.text}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>

        {/* ----- Réalisations des élèves : rangées alternées ----- */}
        <div className="mx-auto mt-16 max-w-5xl space-y-10 lg:space-y-14">
          {realisations.map((r, i) => (
            <Reveal key={r.title} delay={i * 60}>
              <article
                className={`grid items-center gap-7 lg:gap-12 ${i % 2 === 1 ? 'lg:[direction:rtl]' : ''}`}
              >
                <figure className={`lg:w-2/5 lg:[direction:ltr] ${i % 2 === 1 ? 'lg:justify-self-end' : ''}`}>
                  <PhotoCard image={r.image} alt={r.title} title={r.title} className="aspect-[16/10] lg:w-full" />
                </figure>
                <div className="lg:w-3/5 lg:[direction:ltr]">
                  <p className="text-xs font-semibold tracking-[0.25em] text-navy-500 uppercase">{r.date}</p>
                  <p className="mt-2 text-sm leading-relaxed text-ink/95">{r.text}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {/* ----- Renvoi galerie ----- */}
        <Reveal delay={80}>
          <div className="mx-auto mt-16 flex max-w-5xl flex-col items-center gap-4 rounded-2xl bg-mist px-8 py-10 text-center ring-1 ring-navy-100 sm:flex-row sm:justify-between sm:text-left">
            <div>
              <h3 className="font-display text-xl font-semibold text-ink">Voir la vie de l'établissement en images</h3>
              <p className="mt-1.5 text-sm text-ink/95">
                Albums classés par événement, de la rentrée aux voyages du réseau.
              </p>
            </div>
            <Link
              to="/galerie"
              className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-navy-500 px-6 py-3 text-sm font-semibold text-white transition-transform duration-300 hover:translate-x-1"
            >
              Ouvrir la galerie
              <Icon name="arrowRight" className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
