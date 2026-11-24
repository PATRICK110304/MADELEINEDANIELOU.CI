// ============================================================
// PhotoCard.tsx — Carte photo nette
//   • Image en object-fit: cover, absolue derrière le contenu
//   • Voile dégradé #082850 du bas (95 %) vers le haut (0 %)
//   • Contenu DANS LE FLUX (flex, mt-auto) — plus de absolute :
//     fini le texte coupé en bas
//   • Texte blanc avec ombre portée (lisibilité sur photo)
//   • Petit libellé orange clair #FF9A6B
//   • Description limitée à 2 lignes (line-clamp-2)
// ============================================================
import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

interface PhotoCardProps {
  image: string
  alt?: string
  title: ReactNode
  desc?: ReactNode
  label?: ReactNode
  href?: string
  buttonLabel?: ReactNode
  onClick?: () => void
  className?: string
  id?: string
}

export default function PhotoCard({
  image, alt = '', title, desc, label, href, buttonLabel, onClick, className = '', id,
}: PhotoCardProps) {
  const shadow = { textShadow: '0 2px 10px rgba(8, 40, 80, 0.95)' }

  const body = (
    <>
      {/* Photo nette — absolue, derrière le contenu */}
      <img src={image} alt={alt} loading="lazy" decoding="async" width="1600" height="1000" className="absolute inset-0 h-full w-full object-cover" />
      {/* Dégradé sombre renforcé : fond du texte quasi opaque,
          puis fondu progressif vers le haut de la photo */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{ backgroundImage: 'linear-gradient(to top, rgb(8 40 80 / 0.98) 0%, rgb(8 40 80 / 0.94) 30%, rgb(8 40 80 / 0.82) 55%, rgb(8 40 80 / 0.45) 78%, rgb(8 40 80 / 0) 100%)' }}
        aria-hidden="true"
      />
      {/* Contenu en flux, aligné en bas : padding généreux, jamais rogné */}
      <div className="relative z-20 mt-auto flex w-full flex-col gap-2 p-6 pb-7 sm:p-8 sm:pb-9">
        {label && (
          <p className="text-[0.9rem] font-semibold tracking-[0.3em] uppercase text-[#FF9A6B]" style={shadow}>
            {label}
          </p>
        )}
        <h2 className="font-display text-2xl font-semibold leading-tight text-white line-clamp-3 sm:text-3xl lg:text-4xl" style={shadow}>
          {title}
        </h2>
        {desc && <p className="text-[0.9rem] leading-relaxed text-white/90 line-clamp-2 sm:text-base" style={shadow}>{desc}</p>}
        {buttonLabel && (
          <span className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-white transition-transform duration-300 group-hover:translate-x-1" style={shadow}>
            {buttonLabel}
          </span>
        )}
      </div>
    </>
  )

  const shell = `relative flex min-h-[380px] w-full flex-col overflow-hidden rounded-3xl text-left ring-1 ring-navy-100 transition-transform duration-300 hover:-translate-y-1 ${className}`

  if (href) {
    return <Link id={id} to={href} className={`group ${shell}`} onClick={onClick}>{body}</Link>
  }
  if (onClick) {
    return <button type="button" id={id} className={`group ${shell}`} onClick={onClick} aria-label={typeof buttonLabel === 'string' ? buttonLabel : undefined}>{body}</button>
  }
  /* Sans action, on reste un conteneur neutre : jamais de bouton vide,
     ni d'imbrication interactive dans un lien (carte d'événement). */
  return <div id={id} className={`group ${shell}`}>{body}</div>
}
