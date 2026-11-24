// ============================================================
// client/src/components/News.jsx
// Section « Actualités / Vie de l'établissement » — design
// éditorial épuré digne des grands établissements : fond mist
// avec dégradés RVB, filtres piluliers, cartes blanches à
// bordures fines, filet cuivré animé au survol des visuels.
// ============================================================
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { newsItems, newsCategories } from '../data/content'
import { galerieEvents } from '../data/galerie'
import Icon from './Icons'
import PhotoCard from './PhotoCard'
import SectionHeader from './SectionHeader'
import Reveal from './Reveal'

/* Relier une news à la galerie si un événement correspond (slug) */
function slugByNews(title) {
  const norm = (s) => s.toLowerCase().replace(/[^a-zàéèê0-9]+/g, ' ').trim()
  const wanted = norm(title)
  return galerieEvents.find((e) => {
    if (!e.title) return false
    const have = norm(e.title)
    return wanted.startsWith(have) || have.startsWith(wanted.slice(0, 20))
  })?.slug || null
}

export default function News() {
  /* Filtre courant : 'Tous' par défaut */
  const [filter, setFilter] = useState('Tous')

  const items = filter === 'Tous' ? newsItems : newsItems.filter((n) => n.category === filter)

  return (
    <section id="actualites" className="bg-white scroll-mt-24 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeader
            eyebrow="Actualités · Vie de l'établissement"
            title="Ce qui fait vivre Daniélou Abidjan"
            subtitle="Concours, projets innovants, événements : suivez le rythme de notre établissement, filtré par catégorie."
          />
        </Reveal>

        {/* ----- Filtres par catégorie (défilement horizontal mobile) ----- */}
        <Reveal>
          <div className="mb-12 flex gap-2 overflow-x-auto pb-2 lg:flex-wrap lg:justify-center" role="tablist" aria-label="Filtrer les actualités">
            {newsCategories.map((cat) => (
              <button
                key={cat}
                role="tab"
                aria-selected={filter === cat}
                onClick={() => setFilter(cat)}
                className={`shrink-0 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 ${
                  filter === cat
                    ? 'bg-navy-500 text-white shadow-md shadow-navy-500/25'
                    : 'bg-white text-ink shadow-sm ring-1 ring-navy-100 hover:bg-navy-50 hover:text-navy-500'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </Reveal>

        {/* ----- Grille éditoriale (1 → 2 → 3 colonnes) ----- */}
        <div key={filter} className="animate-fade-up grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <Reveal key={item.id} delay={i * 80}>
              <PhotoCard
                image={item.image}
                alt={item.title}
                title={item.title}
                desc={item.excerpt}
                href={slugByNews(item.title) ? `/galerie/${slugByNews(item.title)}` : undefined}
                buttonLabel={
                  <>
                    Lire la suite
                    <Icon name="arrowRight" className="h-3.5 w-3.5 ml-2 text-copper-500 transition-transform group-hover:translate-x-0.5" />
                  </>
                }
                className="h-56 sm:h-64 lg:h-72"
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
