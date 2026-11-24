// ============================================================
// client/src/components/Navbar.tsx
// Navigation CLAIRE du site multi-pages :
//   • Barre blanche fixe (léger flou + ombre au scroll)
//   • Fin trait orange signature au-dessus (plat, sans dégradé)
//   • Lien actif en BLEU (rgb 0,96,160) — détecté par la route
//   • Ligne 1 : logo + téléphone + CTA pré-inscription (bleu)
//   • Ligne 2 : onglets + menus déroulants blancs bordés
//   • Mobile : menu plein écran blanc + accordéons (mobile-first)
// Tous les liens internes utilisent <Link> ; les PDF et liens
// externes restent des <a>.
// ============================================================
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { navLinks, contact } from '../data/content'
import Icon from './Icons'
import Logo from './Logo'

/* Petit chevron pour les onglets déroulants */
function Caret({ className = 'h-3 w-3' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

/* Lien intelligent : <Link> pour les routes internes (commencent
   par « / »), <a> pour les PDF et liens externes. */
function SmartLink({ href, className, children, ...rest }) {
  if (href.startsWith('/')) {
    return (
      <Link to={href} className={className} {...rest}>
        {children}
      </Link>
    )
  }
  const external = href.startsWith('http')
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className={className}
      {...rest}
    >
      {children}
    </a>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [expanded, setExpanded] = useState(null) // index de l'accordéon ouvert (mobile)
  const { pathname } = useLocation()

  /* Ombre douce dès le scroll (> 40 px) */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Bloque le scroll du corps quand le menu mobile est ouvert */
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const closeMenu = () => setOpen(false)

  /* Onglet actif : la route courante correspond au lien */
  const isActive = (href) =>
    href.startsWith('/') &&
    (href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`))

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 bg-white/95 backdrop-blur-md transition-shadow duration-300 ${
        scrolled ? 'shadow-lg shadow-ink/10' : ''
      }`}
    >
      {/* Fin trait orange signature (plat, sans dégradé) */}
      <div className="relative h-[3px] bg-copper-500" aria-hidden="true" />

      {/* ============ Ligne 1 : logo + téléphone + CTA ============ */}
      <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="group flex items-center gap-3" aria-label="Accueil — Groupe Scolaire Daniélou Abidjan">
          <Logo size={48} />
          <span className="leading-tight">
            <span className="font-display block text-base font-semibold text-ink sm:text-lg">Daniélou Abidjan</span>
            <span className="block text-[0.75rem] font-medium tracking-[0.28em] text-navy-500 uppercase">Groupe Scolaire · Abidjan</span>
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {/* Téléphone officiel (desktop) */}
          <a href={`tel:${contact.telephone.replace(/\s/g, '')}`} className="hidden items-center gap-2 text-sm font-medium text-ink transition-colors hover:text-navy-500 xl:flex">
            <Icon name="phone" className="h-4 w-4 text-navy-500" />
            {contact.telephone}
          </a><SmartLink
            href="/inscriptions#preinscription"
            className="group inline-flex items-center gap-2 rounded-full bg-navy-500 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-navy-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-navy-600 hover:shadow-lg"
          >
            <Icon name="cap" className="h-5 w-5" />
            Pré-inscription
          </SmartLink>
          {/* Hamburger mobile */}
          <button
            onClick={() => setOpen(!open)}
            className="rounded-xl border border-navy-100 p-3 text-ink transition-colors hover:bg-mist hover:text-navy-500 lg:hidden"
            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={open}
          >
            <Icon name={open ? 'x' : 'menu'} className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* ============ Ligne 2 : les onglets (desktop) ============ */}
      <nav
        aria-label="Navigation principale"
        className="relative hidden border-t border-mist lg:block"
      >
        <ul className="mx-auto flex max-w-7xl flex-wrap items-stretch justify-center gap-x-1 px-4 sm:px-6 md:px-8">
          {navLinks.map((link) => (
            <li key={link.label} className="group relative">
              <SmartLink
                href={link.href}
                className={`relative flex items-center gap-1 px-2.5 py-2.5 text-[0.78rem] font-medium leading-tight transition-colors xl:text-[0.82rem] ${
                  isActive(link.href) ? 'font-semibold text-navy-500' : 'text-ink hover:text-navy-500'
                }`}
              >
                {link.label}
                {link.children && <Caret className="h-3 w-3 text-navy-500 transition-colors group-hover:text-navy-500" />}
                {/* Soulignement bleu (actif) / beige (survol) */}
                <span
                  className={`absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full transition-all duration-300 group-hover:w-[calc(100%-1rem)] ${
                    isActive(link.href) ? 'w-[calc(100%-1rem)] bg-navy-500' : 'bg-navy-300'
                  }`}
                  aria-hidden="true"
                />
              </SmartLink>

              {/* ----- Menu déroulant : blanc bordé ----- */}
              {link.children && (
                <ul className="invisible absolute left-0 top-full z-50 min-w-56 translate-y-2 rounded-2xl border border-navy-100 bg-white p-2 opacity-0 shadow-xl shadow-ink/10 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  {link.children.map((c) => (
                    <li key={c.label}>
                      <SmartLink
                        href={c.href}
                        className={`flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-[0.8rem] transition-colors ${
                          isActive(c.href) ? 'font-semibold text-navy-500' : 'text-ink hover:bg-navy-50 hover:text-navy-500'
                        }`}
                      >
                        <span className="h-1 w-1 shrink-0 rounded-full bg-copper-400" aria-hidden="true" />
                        {c.label}
                      </SmartLink>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* ============ Menu mobile plein écran (accordéons) ============ */}
      <div
        className={`fixed inset-0 top-[68px] z-40 overflow-y-auto bg-white transition-all duration-300 lg:hidden ${
          open ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        <ul className="flex flex-col gap-1 px-6 py-6">
          {navLinks.map((link, i) => (
            <li key={link.label} style={{ transitionDelay: `${i * 30}ms` }}>
              {link.children ? (
                <div className="border-b border-mist">
                  <button
                    onClick={() => setExpanded(expanded === i ? null : i)}
                    aria-expanded={expanded === i}
                    className={`flex w-full items-center justify-between py-3.5 text-left font-display text-lg font-medium ${
                      isActive(link.href) ? 'text-navy-500' : 'text-ink'
                    }`}
                  >
                    {link.label}
                    <Caret className={`h-4 w-4 text-copper-400 transition-transform duration-300 ${expanded === i ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${expanded === i ? 'max-h-72 pb-3' : 'max-h-0'}`}>
                    <ul className="space-y-1 pl-4">
                      <li>
                        <SmartLink
                          href={link.href}
                          onClick={closeMenu}
                          className="block min-h-[44px] rounded-xl px-3 py-2.5 text-sm font-semibold text-navy-500 transition-colors hover:bg-navy-50"
                        >
                          Voir « {link.label} »
                        </SmartLink>
                      </li>
                      {link.children.map((c) => (
                        <li key={c.label}>
                          <SmartLink
                            href={c.href}
                            onClick={closeMenu}
                            className="block min-h-[44px] rounded-xl px-3 py-2 text-sm text-ink transition-colors hover:bg-navy-50 hover:text-navy-500"
                          >
                            {c.label}
                          </SmartLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <SmartLink
                  href={link.href}
                  onClick={closeMenu}
                  className={`block border-b border-mist py-3.5 font-display text-lg font-medium transition-colors ${
                    isActive(link.href) ? 'text-navy-500' : 'text-ink hover:text-navy-500'
                  }`}
                >
                  {link.label}
                </SmartLink>
              )}
            </li>
          ))}
        </ul>
        <div className="px-6 pb-10">
          <SmartLink
            href="/inscriptions#preinscription"
            onClick={closeMenu}
            className="flex items-center justify-center gap-2 rounded-full bg-navy-500 px-6 py-4 font-semibold text-white shadow-lg shadow-navy-500/25"
          >
            <Icon name="cap" className="h-5 w-5" />
            Pré-inscrire mon enfant
          </SmartLink>
        </div>
      </div>
    </header>
  )
}
