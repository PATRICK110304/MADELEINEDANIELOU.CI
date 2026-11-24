// ============================================================
// client/src/components/Videos.jsx
// Section #videos — Vidéo & Diaporama classé PAR ÉVÉNEMENT :
//   • Lecteur VIMEO officiel (embed exact du site, chargé au clic)
//   • Diaporama DÉROULANT LENT (défilement automatique doux,
//     pause au survol) avec FILTRE PAR ÉVÉNEMENT — classification
//     reprise de leurs pages « Albums » officielles.
// ============================================================
import { useEffect, useMemo, useRef, useState } from 'react'
import { video, gallery } from '../data/content'
import Icon from './Icons'
import PhotoCard from './PhotoCard'
import SectionHeader from './SectionHeader'
import Reveal from './Reveal'

const SCROLL_STEP = 0.35 // vitesse du défilement auto : TRÈS LENT (px / tick)
const SCROLL_TICK = 60   // ms entre deux pas (≈ 6 px/s)

export default function Videos() {
  const [playing, setPlaying] = useState(false)   // embed Vimeo chargé au clic
  const [selected, setSelected] = useState('Tous') // événement sélectionné
  const trackRef = useRef(null)                    // piste de défilement du diaporama
  const autoRef = useRef(true)                     // défilement auto actif (pause au survol)

  /* Diaporama automatique TRÈS LENT (boucle infinie) */
  useEffect(() => {
    const id = setInterval(() => {
      const el = trackRef.current
      if (!el || !autoRef.current) return
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 2) {
        el.scrollTo({ left: 0 }) // boucle : retour au début
      } else {
        el.scrollBy({ left: SCROLL_STEP })
      }
    }, SCROLL_TICK)
    return () => clearInterval(id)
  }, [])

  /* Remise à zéro du défilement quand on change d'événement */
  useEffect(() => {
    trackRef.current?.scrollTo({ left: 0 })
  }, [selected])

  /* Photos filtrées : « Tous » = toutes les photos, avec leur événement */
  const photos = useMemo(() => {
    const withEvent = (ev) => ev.images.map((img) => ({ ...img, event: ev.name, period: ev.period }))
    return selected === 'Tous'
      ? gallery.events.flatMap(withEvent)
      : withEvent(gallery.events.find((e) => e.name === selected))
  }, [selected])

  /* Défilement manuel d'une "page" vers la gauche/droite */
  const scrollTrack = (dir) => {
    const el = trackRef.current
    if (!el) return
    const step = el.querySelector('li')?.clientWidth ?? 320
    el.scrollBy({ left: dir * (step + 16), behavior: 'smooth' })
  }

  return (
    <section id="videos" className="scroll-mt-24 bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeader
            eyebrow="Vidéo & Diaporama"
            title="Découvrir le GSMD en images"
            subtitle="La vidéo institutionnelle et les souvenirs de la vie du groupe scolaire, classés par événement comme dans leurs Albums officiels."
          />
        </Reveal>

        <div className="mx-auto max-w-6xl">
          {/* ================= LECTEUR VIMEO (lazy) — ancre #video ================= */}
          <Reveal>
            <div id="video" className="group relative aspect-video scroll-mt-32 overflow-hidden rounded-3xl bg-white shadow-lg shadow-ink/5 ring-1 ring-navy-100">
              {playing ? (
                /* Iframe chargée UNIQUEMENT après le clic (code embed officiel du site) */
                <iframe
                  src={`https://player.vimeo.com/video/${video.id}?h=${video.hash}&autoplay=1&autopause=0&loop=0&muted=0&title=1&portrait=1&byline=1`}
                  title={video.title}
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                  className="absolute inset-0 h-full w-full"
                />
              ) : (
                /* Photo nette : PhotoCard avec gradient du bas vers le haut */
                <PhotoCard
                  image="/images/hero-ceremonie_up1600.webp"
                  alt={video.title}
                  title={video.title}
                  desc={video.description}
                  label="Vidéo institutionnelle"
                  className="h-full"
                  onClick={() => setPlaying(true)}
                />
              )}
            </div>
          </Reveal>

          {/* ================= DIAPORAMA PAR ÉVÉNEMENT — ancre #photos ================= */}
          <Reveal delay={120}>
            <div id="photos" className="mt-10 scroll-mt-32">
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2.5 text-sm font-semibold tracking-[0.2em] text-navy-500 uppercase">
                  <Icon name="star" className="h-4 w-4" />
                  {gallery.title}
                </h3>
                {/* Flèches de navigation manuelle */}
                <div className="flex gap-2">
                  <button
                    onClick={() => scrollTrack(-1)}
                    aria-label="Images précédentes"
                    className="rounded-full border border-navy-100 bg-white p-2.5 text-ink/95 shadow-sm transition-all hover:border-navy-300 hover:text-navy-500"
                  >
                    <Icon name="chevronLeft" className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => scrollTrack(1)}
                    aria-label="Images suivantes"
                    className="rounded-full border border-navy-100 bg-white p-2.5 text-ink/95 shadow-sm transition-all hover:border-navy-300 hover:text-navy-500"
                  >
                    <Icon name="chevronRight" className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <p className="mt-2 text-sm text-ink/95">{gallery.subtitle}</p>

              {/* ----- Filtre PAR ÉVÉNEMENT (puces défilantes) ----- */}
              <div className="mt-5 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <button
                  onClick={() => setSelected('Tous')}
                  className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold shadow-sm ring-1 transition-all duration-300 ${
                    selected === 'Tous'
                      ? 'bg-navy-500 text-white ring-navy-500'
                      : 'bg-white text-ink/95 ring-navy-200 hover:text-navy-500 hover:ring-navy-300'
                  }`}
                >
                  Tous ({gallery.events.reduce((n, e) => n + e.images.length, 0)})
                </button>
                {gallery.events.map((e) => (
                  <button
                    key={e.name}
                    onClick={() => setSelected(e.name)}
                    className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold shadow-sm ring-1 transition-all duration-300 ${
                      selected === e.name
                        ? 'bg-navy-500 text-white ring-navy-500'
                        : 'bg-white text-ink/95 ring-navy-200 hover:text-navy-500 hover:ring-navy-300'
                    }`}
                  >
                    {e.name} ({e.images.length})
                  </button>
                ))}
              </div>

              {/* ----- Piste défilante LENTE : images de l'événement sélectionné ----- */}
              <ul
                key={selected} // reset du scroll au changement d'événement
                ref={trackRef}
                onMouseEnter={() => (autoRef.current = false)}
                onMouseLeave={() => (autoRef.current = true)}
                className="mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {photos.map((p) => (
                  <li key={p.src + p.event} className="w-64 shrink-0 snap-start sm:w-72 lg:w-80">
                    <figure className="group overflow-hidden rounded-2xl shadow-md shadow-ink/5 ring-1 ring-navy-100">
                      <img
                        src={p.src}
                        alt={p.alt}
                        loading="lazy"
                        className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:h-48"
                      />
                      {/* Légende : événement + période */}
                      <figcaption className="bg-white px-3.5 py-2.5">
                        <p className="truncate text-[0.72rem] font-semibold text-navy-500">{p.event}</p>
                        <p className="truncate text-[0.68rem] text-ink/95">{p.period}</p>
                      </figcaption>
                    </figure>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
