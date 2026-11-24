// ============================================================
// client/src/pages/GalleryPage.tsx — /galerie
// Grille d'événements (PhotoCard) → routes /galerie/:slug.
// (La page dédiée = GalerieEventPage — photos masonry + Lightbox)
// ============================================================
import { galerieEvents } from '../data/galerie'
import PhotoCard from '../components/PhotoCard'
import Reveal from '../components/Reveal'
import SectionHeader from '../components/SectionHeader'
import { Link } from 'react-router-dom'

export default function GalleryPage() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeader
            eyebrow="Galerie photos"
            title="Retrouvez chaque événement du GSMD"
            subtitle="Fêtes, centenaire, rentals, saluts honorifiques — cliquez sur chaque carte pour voir toute la galerie photos (mosaïque + lightbox)."
          />
        </Reveal>

        {galerieEvents.length === 0 ? (
          <p className="text-center text-ink/80">Aucun événement pour le moment — dossier public/galerie/ vide ?</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {galerieEvents.map((e) => (
              <Reveal key={e.slug} delay={50}>
                <Link to={`/galerie/${e.slug}`} className="block h-full transition-transform duration-300 hover:scale-[1.02]">
                  <PhotoCard
                    image={e.vignettes[0] || ''}
                    title={e.title || e.slug}
                    label={e.date || undefined}
                    desc={`${e.vignettes.length} photos`}
                    className="h-64"
                  />
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
