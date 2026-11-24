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
          <SectionHeader as="h1"
            eyebrow="Galerie photos"
            title="Retrouvez chaque événement du GSMD"
            subtitle="Cérémonies, fêtes et sorties pédagogiques : ouvrez une galerie pour parcourir les photos de l’événement."
          />
        </Reveal>

        {galerieEvents.filter((e) => e.title && e.vignettes?.length).length === 0 ? (
          <p className="text-center text-ink/80">Les galeries photos seront publiées prochainement.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {galerieEvents.filter((e) => e.title && e.vignettes?.length).map((e) => (
              <Reveal key={e.slug} delay={50}>
                <Link to={`/galerie/${e.slug}`} className="block h-full transition-transform duration-300 hover:scale-[1.02]">
                  <PhotoCard
                    image={e.vignettes[0] || ''}
                    title={e.title}
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
