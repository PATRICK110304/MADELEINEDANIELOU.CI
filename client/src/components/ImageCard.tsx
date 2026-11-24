// ============================================================
// ImageCard.tsx — Carte photo avec texte lisible (contraste AA)
//   • Photo nette, object-fit: cover
//   • Voile #082850 renforcé : dégradé BAS→HAUT quasi opaque
//     sous le texte + dégradé GAUCHE→DROITE pour détacher la zone
//   • Texte blanc avec ombre portée, libellé corail clair #FF9A6B
// ============================================================
import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

type CardBody = {
  image: string
  alt?: string
  href?: string
  title?: ReactNode
  label?: ReactNode
  badge?: ReactNode
  className?: string
  imageClassName?: string
  id?: string
  children?: ReactNode
}

export default function ImageCard({
  image, alt, href, title, label, badge, className = '', imageClassName = '', id, children, onClick,
}: CardBody & { onClick?: () => void }) {
  const shadow = { textShadow: '0 2px 10px rgba(8, 40, 80, 0.95)' }

  const body = (
    <>
      <img src={image} alt={alt} loading="lazy" decoding="async" className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02] ${imageClassName}`} />
      {/* Voile bas → haut renforcé (garantie 4,5:1) */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{ backgroundImage: 'linear-gradient(to top, rgb(8 40 80 / 0.98) 0%, rgb(8 40 80 / 0.92) 30%, rgb(8 40 80 / 0.75) 58%, rgb(8 40 80 / 0.35) 80%, rgb(8 40 80 / 0) 100%)' }}
        aria-hidden="true"
      />
      {badge && <div className="pointer-events-none absolute right-4 top-4 z-10">{badge}</div>}
      {/* Contenu plus haut que le voile, ancré en bas, avec ombre */}
      <div className="absolute inset-0 z-20 flex flex-col justify-end gap-2 p-6 pb-7 sm:p-8 sm:pb-9">
        {label && <p className="text-[0.75rem] font-semibold tracking-[0.28em] uppercase text-[#FF9A6B] line-clamp-2" style={shadow}>{label}</p>}
        {title && <h3 className="font-display text-2xl leading-snug font-semibold text-white line-clamp-2 sm:text-3xl" style={shadow}>{title}</h3>}
        {children}
      </div>
    </>
  )

  const base = `relative overflow-hidden rounded-3xl ring-1 ring-navy-100 shadow-lg shadow-ink/5 transition-transform duration-300 hover:-translate-y-1 ${className}`
  if (href) return <Link id={id} to={href} className={`group ${base}`} onClick={onClick}>{body}</Link>
  return <div id={id} className={`group ${base}`} onClick={onClick}>{body}</div>
}
