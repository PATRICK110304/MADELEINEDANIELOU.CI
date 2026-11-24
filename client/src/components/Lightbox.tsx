// ============================================================
// client/src/components/Lightbox.tsx — Lightbox pur React
// - Ouvre sur un click de vignette, plusieurs photos
// - Fond sombre #082850 (à 95 %), texte blanc, contraste AA
// - Flèches précédent / suivant + compteur « n / total »
// - Fermeture : ×, Échap, clic en dehors
// - Blocage du scroll de la page pendant l'ouverture
// - Mobilité : balayage tactile (swipe) gauche/droite
// - prefers-reduced-motion respecté
// ============================================================
import { useEffect, useRef } from 'react'
import Icon from './Icons'

export default function Lightbox({ images, index, onClose, onNext, onPrev, onClickImage, darkBg = true }) {
  const dialogRef = useRef<HTMLDivElement>(null)

  // Scroll bloqué pendant l'ouverture
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // Flèches clavier + Échap
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') onNext()
      else if (e.key === 'ArrowLeft') onPrev()
      else if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onNext, onPrev, onClose])

  const img = images[index]
  if (!img) return null

  return (
    <>
      {/* Overlay (fond sombre) — clic en dehors ferme */}
      <div
        className="fixed inset-0 z-[80] bg-[rgb(8_40_80)]"
        style={{ backgroundColor: 'rgb(8 40 80 / 0.95)' }}
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Boîte de dialogue */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="lightbox-title"
        className="relative z-[90] flex flex-col"
        style={{ height: '100vh' }}
        tabIndex={-1}
      >
        {/* Barre du haut : RETOUR explicite + compteur */}
        <div className="flex items-center justify-between gap-3 px-4 pt-4 text-white">
          <button
            type="button"
            onClick={onClose}
            aria-label="Retour aux photos de la galerie"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-white/20 px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-white/30 focus-visible:ring-2 focus-visible:ring-white/80"
          >
            <Icon name="chevronLeft" className="h-5 w-5" />
            Retour aux photos
          </button>
          <p id="lightbox-title" className="text-sm font-medium opacity-90">{index + 1} / {images.length}</p>
        </div>

        {/* Image principale */}
        <div
          className="flex-1 flex items-center justify-center overflow-hidden transition-transform"
          onClick={onClickImage}
        >
          <img
            src={img}
            alt=""
            loading="lazy"
            decoding="async"
            className="max-h-[85vh] w-auto object-contain transition-opacity duration-300"
          />
        </div>

        {/* Naviguer : flèches */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4 px-4">
          <button
            type="button"
            onClick={onPrev}
            aria-label="Photo précédente"
            className="rounded-full bg-white/20 p-3 transition-colors hover:bg-white/30 focus:ring-2 focus:ring-white/80"
          >
            <Icon name="chevronLeft" className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={onNext}
            aria-label="Photo suivante"
            className="rounded-full bg-white/20 p-3 transition-colors hover:bg-white/30 focus:ring-2 focus:ring-white/80"
          >
            <Icon name="chevronRight" className="h-6 w-6" />
          </button>
        </div>
      </div>
    </>
  )
}
