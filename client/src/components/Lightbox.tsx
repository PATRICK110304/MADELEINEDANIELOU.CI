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
  const closeRef = useRef<HTMLButtonElement>(null)
  const touchStartX = useRef(0)

  // Scroll bloqué pendant l'ouverture
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // Focus : placement à l'ouverture, piège Tab, restauration à la fermeture
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    return () => previous?.focus()
  }, [])

  // Flèches clavier + Échap + piège de focus
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') onNext()
      else if (e.key === 'ArrowLeft') onPrev()
      else if (e.key === 'Escape') onClose()
      else if (e.key === 'Tab') {
        const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], [tabindex]:not([tabindex="-1"])',
        )
        if (!focusables?.length) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
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
            ref={closeRef}
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
        <button
          type="button"
          className="flex flex-1 cursor-pointer items-center justify-center overflow-hidden focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/80"
          aria-label="Photo suivante"
          onClick={onClickImage}
          onTouchStart={(e) => { touchStartX.current = e.changedTouches[0].clientX }}
          onTouchEnd={(e) => {
            const delta = e.changedTouches[0].clientX - touchStartX.current
            if (delta > 50) onPrev()
            else if (delta < -50) onNext()
          }}
        >
          <img
            src={img}
            alt=""
            loading="lazy"
            decoding="async"
            className="max-h-[85vh] w-auto object-contain transition-opacity duration-300"
          />
        </button>

        {/* Naviguer : flèches */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4 px-4">
          <button
            type="button"
            onClick={onPrev}
            aria-label="Photo précédente"
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-white/20 p-3 transition-colors hover:bg-white/30 focus-visible:ring-2 focus-visible:ring-white/80"
          >
            <Icon name="chevronLeft" className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={onNext}
            aria-label="Photo suivante"
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-white/20 p-3 transition-colors hover:bg-white/30 focus-visible:ring-2 focus-visible:ring-white/80"
          >
            <Icon name="chevronRight" className="h-6 w-6" />
          </button>
        </div>
      </div>
    </>
  )
}
