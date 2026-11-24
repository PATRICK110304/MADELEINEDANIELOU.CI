// ============================================================
// client/src/components/WebRadio.jsx
// Section #radio — Web Radio & Médias "Madeleine FM" :
// fond clair (blanc dominant), carte station blanche avec
// accent ORANGE, lecteur audio NATIF, playlist cliquable,
// égaliseur animé et téléchargement de chaque épisode.
// Épisodes : API (/api/podcasts) avec repli local.
// ============================================================
import { useRef, useState } from 'react'
import { usePodcasts } from '../services/api'
import Icon from './Icons'
import SectionHeader from './SectionHeader'
import Reveal from './Reveal'

export default function WebRadio() {
  const { items, offline, loading } = usePodcasts()
  const audioRef = useRef(null)          // élément <audio> natif unique
  const [current, setCurrent] = useState(0)
  const [playing, setPlaying] = useState(false)

  /* Change d'épisode et lance la lecture */
  const play = (i) => {
    if (!audioRef.current) return
    setCurrent(i)
    audioRef.current.src = items[i].src
    audioRef.current.play()
    setPlaying(true)
  }

  const toggle = () => {
    if (!audioRef.current) return
    if (playing) {
      audioRef.current.pause()
      setPlaying(false)
    } else {
      audioRef.current.play()
      setPlaying(true)
    }
  }

  const episode = items[current]
  const isPlayingRow = (i) => i === current && playing

  return (
    <section id="radio" className="relative scroll-mt-24 overflow-hidden bg-white py-20 lg:py-28">

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeader
            eyebrow="Web Radio & Médias"
            title="Daniélou FM — la voix de l'établissement"
            subtitle="Écoutez nos podcasts : mot du directeur, reportages des élèves, chroniques pédagogiques. Téléchargez les épisodes et écoutez-les hors ligne."
          />
        </Reveal>

        <Reveal delay={100}>
          <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.1fr_1fr]">
            {/* ================= CARTE STATION (lecteur) ================= */}
            <div className="overflow-hidden rounded-3xl bg-white shadow-xl shadow-ink/8 ring-1 ring-navy-100">
              {/* Bandeau supérieur : logo station + indicateur en ligne */}
              <div className="flex items-center justify-between border-b border-navy-100 bg-copper-500 px-7 py-5">
                <div className="flex items-center gap-3.5">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-white shadow-inner">
                    <Icon name="radio" className="h-6 w-6" />
                  </span>
                  <div>
                    <p className="font-display text-lg font-semibold text-white">Daniélou FM</p>
                    <p className="text-xs font-medium tracking-widest text-white/85 uppercase">Fréquence 100.0 · Abidjan</p>
                  </div>
                </div>
                {/* Point pulsant + mention live / sélection locale */}
                <span className="flex items-center gap-2 rounded-full bg-white/20 px-3.5 py-1.5 text-[0.7rem] font-semibold tracking-widest text-white uppercase">
                  <span className={`h-2 w-2 rounded-full bg-white ${offline ? '' : 'animate-pulse-dot'}`} />
                  {offline ? 'Sélection locale' : 'En ligne'}
                </span>
              </div>

              {/* Épisode courant : titre + égaliseur animé pendant la lecture */}
              <div className="px-7 py-7">
                <p className="text-xs font-semibold tracking-[0.25em] text-navy-500 uppercase">
                  Épisode {current + 1} / {items.length}
                </p>
                <div className="mt-2 flex items-center justify-between gap-4">
                  <h3 className="font-display text-2xl leading-snug font-semibold text-ink">{episode ? episode.title : 'Chargement…'}</h3>
                  {/* Égaliseur : 5 barres animées quand la lecture est en cours */}
                  <div className="flex h-10 w-8 shrink-0 items-end justify-center gap-1" aria-hidden="true">
                    {[0, 1, 2, 3, 4].map((b) => (
                      <span
                        key={b}
                        className={`w-1.5 rounded-full bg-copper-400 ${playing ? 'animate-eq' : ''}`}
                        style={{ height: playing ? undefined : '30%', animationDelay: `${b * 0.12}s` }}
                      />
                    ))}
                  </div>
                </div>
                {episode?.description && (
                  <p className="mt-2 text-sm leading-relaxed text-ink/95">{episode.description}</p>
                )}

                {/* Lecteur audio NATIF du navigateur (barre de contrôle) */}
                <audio
                  ref={audioRef}
                  src={episode?.src}
                  controls
                  preload="metadata"
                  className="mt-5 w-full"
                  onPlay={() => setPlaying(true)}
                  onPause={() => setPlaying(false)}
                  onEnded={() => setPlaying(false)}
                >
                  Votre navigateur ne prend pas en charge l'élément audio.
                </audio>

                {/* Téléchargement de l'épisode courant */}
                {episode && (
                  <a
                    href={episode.src}
                    download={episode.file}
                    className="group mt-5 inline-flex items-center gap-2 rounded-full bg-navy-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-navy-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <Icon name="download" className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
                    Télécharger cet épisode
                  </a>
                )}
              </div>
            </div>

            {/* ================= PLAYLIST ================= */}
            <div className="rounded-3xl bg-white p-5 shadow-xl shadow-ink/8 ring-1 ring-navy-100 sm:p-7">
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2.5 text-sm font-semibold tracking-[0.2em] text-navy-500 uppercase">
                  <Icon name="headphones" className="h-4.5 w-4.5" />
                  Playlist des podcasts
                </h3>
                <span className="text-xs text-ink/95">{items.length} épisodes</span>
              </div>

              <ul className="mt-5 space-y-3">
                {loading && <li className="px-4 py-6 text-center text-sm text-ink/95">Chargement des épisodes…</li>}
                {!loading && items.map((ep, i) => (
                  <li key={ep.id ?? ep.file}>
                    <div
                      className={`flex items-center gap-4 rounded-2xl p-3.5 transition-all duration-300 ${
                        i === current ? 'bg-navy-50 ring-1 ring-navy-200' : 'bg-navy-50 hover:bg-navy-50'
                      }`}
                    >
                      {/* Bouton lecture / pause de la rangée */}
                      <button
                        onClick={() => (i === current ? toggle() : play(i))}
                        aria-label={isPlayingRow(i) ? `Mettre en pause : ${ep.title}` : `Écouter : ${ep.title}`}
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all ${
                          isPlayingRow(i)
                            ? 'bg-navy-500 text-white shadow-md shadow-navy-500/20'
                            : 'bg-white text-ink shadow-sm ring-1 ring-navy-200 hover:bg-navy-500 hover:text-white hover:ring-navy-500'
                        }`}
                      >
                        <Icon name={isPlayingRow(i) ? 'pause' : 'play'} className={`h-4 w-4 ${isPlayingRow(i) ? '' : 'ml-0.5'}`} filled={isPlayingRow(i)} />
                      </button>

                      {/* Titre + description */}
                      <button onClick={() => (i === current ? toggle() : play(i))} className="min-w-0 flex-1 cursor-pointer text-left">
                        <p className={`truncate text-sm font-semibold ${i === current ? 'text-navy-500' : 'text-ink'}`}>{ep.title}</p>
                        <p className="truncate text-xs text-ink/95">{ep.description}</p>
                      </button>

                      {/* Durée + téléchargement */}
                      <span className="hidden shrink-0 text-xs font-medium text-ink/95 sm:block">{ep.duration}</span>
                      <a
                        href={ep.src}
                        download={ep.file}
                        aria-label={`Télécharger : ${ep.title}`}
                        className="shrink-0 rounded-lg p-2 text-ink/95 transition-all hover:bg-navy-50 hover:text-navy-500"
                      >
                        <Icon name="download" className="h-4 w-4" />
                      </a>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Note du club presse */}
              <p className="mt-5 flex items-start gap-2.5 rounded-xl bg-navy-50 p-4 text-xs leading-relaxed text-navy-800">
                <Icon name="music" className="mt-0.5 h-4 w-4 shrink-0 text-navy-500" />
                Les épisodes sont produits par le club presse de l'établissement.
                Disponibles en écoute libre et en téléchargement MP3.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
