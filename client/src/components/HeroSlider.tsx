// ============================================================
// client/src/components/HeroSlider.tsx
// HERO : photos nettes (rotation automatique permanente, 9 500 ms),
// Structure en flux normal (aucun position:absolute sauf
// photos de fond + dégradé) :
//   1. Zone de texte (min-h fixe, titre line-clamp-4, p line-clamp-3)
//   2. Bouton (fixe — toujours au même endroit, en flux)
//   3. Pastilles (rangée séparée, sans chevauchement)
//   4. Points de navigation du carrousel
// Dégradé bleu #082850 de gauche à droite (90 % → 10 %),
// texte blanc, accent clair #FF9A6B sur fond sombre.
// prefers-reduced-motion respecté.
// ============================================================
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { heroSlides, heroBadges } from '../data/content'
import Icon from './Icons'

const SLIDE_INTERVAL = 9500 // ms entre deux diapositives

export default function HeroSlider() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  /* Trois diapositives officielles suffisent : on ne recycle pas les mêmes
   textes sur six photos supplémentaires. */
  const allSlides = heroSlides

  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => setIndex((i) => (i + 1) % allSlides.length), SLIDE_INTERVAL)
    return () => clearInterval(id)
  }, [paused, allSlides.length])

  const slide = allSlides[index]
  const go = (i) => setIndex((i + allSlides.length) % allSlides.length)

  return (
    <section id="accueil" className="relative mb-8 overflow-hidden bg-white">
      {/* ----- Photos PLEIN ÉCRAN, nettes, en flux (background de la section) ----- */}
      {allSlides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-out ${
            i === index ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ backgroundImage: `url('${s.image}')` }}
          aria-hidden="true"
        />
      ))}

      {/* ----- Voile bleu #082850 gauche → droite (90 % → 10 %) ----- */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to right, rgb(8 40 80 / 0.9) 0%, rgb(8 40 80 / 0.5) 40%, rgb(8 40 80 / 0.1) 60%, rgb(8 40 80 / 0.1) 100%)',
        }}
        aria-hidden="true"
      />

      {/* ----- Zone de texte : min-h fixe, titre line-clamp-4, p line-clamp-3 ----- */}
      <div className="relative z-10 flex min-h-[320px] items-center justify-center sm:min-h-[380px] px-4 pt-20 sm:px-6 lg:px-8">
        <div className="w-full max-w-[75ch] lg:max-w-[75ch]">
          {/* Titre serif Playfair très grand, blanc, aucune coupe */}
          <h1 className="font-display text-3xl leading-[1.05] font-semibold text-white line-clamp-4 sm:text-4xl lg:text-[3.75rem] drop-shadow-[0_2px_16px_rgb(8_40_80_/_0.4)]">
            {slide.titleLine}{' '}
            <span className="text-[#FF9A6B]">{slide.titleAccent}</span>
          </h1>

          {/* Paragraphe — 3 lignes max */}
          <p className="mt-5 max-w-[72ch] text-base leading-relaxed text-white/90 line-clamp-3">
            {slide.text}
          </p>
        </div>
      </div>

      {/* ----- Bouton — en flux, toujours au même endroit ----- */}
      <div className="relative z-10 flex justify-center py-6">
        <Link
          to={slide.cta.href}
          className="inline-flex items-center gap-2 rounded-full bg-navy-500 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-navy-500/30 transition-colors duration-200 hover:bg-navy-600 hover:translate-y-0.5 hover:shadow-xl"
        >
          {slide.cta.label}
          <Icon name="arrowRight" className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* ----- Pastilles : rangée séparée, fixe, sans chevauchement ----- */}
      <div className="relative z-10 mx-auto flex max-w-7xl flex-wrap justify-center gap-3 px-4 sm:px-6">
        {heroBadges.map((b) => (
          <div key={b.label} className="rounded-full bg-white/85 px-4 py-2.5 shadow-sm">
            <span className="font-display text-xl font-semibold text-navy-900 sm:text-2xl">{b.value}</span>
            <span className="ml-2 text-[0.85rem] font-semibold text-ink/90">{b.label}</span>
          </div>
        ))}
      </div>

      {/* ----- Contrôles du carrousel : pause + points (cibles 44 px) ----- */}
      <div className="relative z-10 mt-8 flex items-center justify-center gap-3 pb-4">
        <button
          type="button"
          onClick={() => setPaused((v) => !v)}
          aria-pressed={paused}
          aria-label={paused ? 'Reprendre le défilement des photos' : 'Mettre en pause le défilement des photos'}
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-white/20 px-3 text-sm font-semibold text-white transition-colors hover:bg-white/30 focus-visible:ring-2 focus-visible:ring-white/80"
        >
          <Icon name={paused ? 'play' : 'pause'} className="h-4 w-4" />
        </button>
        {allSlides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => go(i)}
            aria-label={`Aller à la diapositive ${i + 1}`}
            aria-current={i === index ? 'true' : undefined}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full focus-visible:ring-2 focus-visible:ring-white/80"
          >
            <span className={`block h-2.5 rounded-full transition-[width,background-color] duration-300 ${
              i === index ? 'w-10 bg-navy-500' : 'w-2.5 bg-white/70'
            }`} />
          </button>
        ))}
      </div>
    </section>
  )
}
