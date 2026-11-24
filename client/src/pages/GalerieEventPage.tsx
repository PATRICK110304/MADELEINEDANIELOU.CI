// ============================================================
// client/src/pages/GalerieEventPage.tsx
// /galerie/:slug — En-tête (titre, date, description) + mosaïque
// légère (CSS `columns`, responsive 1→2→3→4 colonnes).
// Clique sur une vignette → Lightbox (photos/), back-link.
// ============================================================
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { galerieEvents } from '../data/galerie'
import Lightbox from '../components/Lightbox'
import Reveal from '../components/Reveal'
import SectionHeader from '../components/SectionHeader'

export default function GalerieEventPage() {
  const { slug } = useParams<{ slug: string }>()
  const event = slug ? galerieEvents.find((e) => e.slug === slug) : undefined
  const [lbIndex, setLbIndex] = useState<number | null>(null)

  if (!event) {
    return (
      <section className="py-20">
        <SectionHeader
          eyebrow="Galerie"
          title="Événement introuvable"
          subtitle="Cette galerie n'est pas disponible. Retrouvez toutes les galeries d'événements depuis la page Galerie photos."
        />
        <Link to="/galerie" className="mt-6 inline-flex items-center gap-2 rounded-full bg-navy-500 px-6 py-3 text-base font-semibold text-white hover:bg-navy-600">
          ← Toutes les galeries
        </Link>
      </section>
    )
  }

  return (
    <>
      <section className="bg-white scroll-mt-8">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link to="/galerie" className="inline-flex items-center gap-1 text-base font-semibold text-navy-500 transition-colors hover:text-navy-600">
              ← Toutes les galeries
            </Link>
          </div>

          <Reveal>
            <SectionHeader as="h1"
              eyebrow="Galerie photo"
              title={event.title || 'Galerie photos'}
              subtitle={event.date ? `${event.date} — ${event.description || ''}` : 'Photos de l’événement.'}
              align="left"
            />
          </Reveal>

          {/* Mosaïque CSS : 1 col mobile, 2 tablette, 3-4 desktop */}
          <div
            className="columns-1 gap-3 sm:columns-2 lg:columns-3 xl:columns-4 [&>*]:mb-3"
            style={{ marginBottom: 12, columnFill: 'balance' }}
          >
            {event.vignettes.map((src, i) => {
              const p = Math.min(event.photos.length - 1, Math.round((i / Math.max(1, event.vignettes.length - 1)) * event.photos.length))
              return (
                <button
                  key={src}
                  type="button"
                  onClick={() => setLbIndex(p)}
                  aria-label={`Ouvrir la photo ${i + 1} de ${event.title || 'la galerie'}`}
                  className="group block w-full overflow-hidden rounded-2xl shadow-md shadow-ink/5 ring-1 ring-navy-100 transition-transform duration-500 hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-navy-500"
                >
                  <img
                    src={src}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    width="800"
                    height="600"
                    className="w-full"
                  />
                </button>
              )
            })}
            {event.photos.length > 0 && event.vignettes.length === 0 && (
              <p className="text-sm text-ink/90">Les photos de cet événement seront publiées prochainement.</p>
            )}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {event.photos.length > 0 && lbIndex !== null && (
        <Lightbox
          images={event.photos}
          index={lbIndex}
          onClose={() => setLbIndex(null)}
          onNext={() => setLbIndex((i) => (i + 1) % event.photos.length)}
          onPrev={() => setLbIndex((i) => (i - 1 + event.photos.length) % event.photos.length)}
          onClickImage={() => setLbIndex((i) => (i + 1) % event.photos.length)}
        />
      )}
    </>
  )
}
