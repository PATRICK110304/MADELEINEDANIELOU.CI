// ============================================================
// client/src/components/Footer.tsx
// Pied de page CLAIR : fond beige rgb(245,239,228) avec fin
// trait bleu principal au-dessus (plat, sans dégradé).
// Contenu : logo + réseaux, navigation multi-pages, pages
// utiles (routes internes React Router), coordonnées, admissions.
// ============================================================
import { Link } from 'react-router-dom'
import { contact, navLinks, pagesUtiles, social } from '../data/content'
import Icon from './Icons'
import Logo from './Logo'

/* Lien intelligent : <Link> pour les routes internes (commencent
   par « / »), <a> pour les liens externes (Google Maps, Facebook). */
function SmartLink({ href, className, children, ...rest }) {
  if (href.startsWith('/')) {
    return (
      <Link to={href} className={className} {...rest}>
        {children}
      </Link>
    )
  }
  return (
    <a href={href} className={className} {...rest}>
      {children}
    </a>
  )
}

export default function Footer() {
  return (
    <footer className="bg-mist text-ink/95">
      {/* Fin trait bleu principal au-dessus du pied de page */}
      <div className="h-[3px] bg-navy-500" aria-hidden="true" />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* ================= Ligne 1 : logo · navigation · contact ================= */}
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {/* ----- Logo + présentation + réseaux sociaux ----- */}
          <div>
            <div className="flex items-center gap-3">
              <Logo size={96} />
              <div>
                <p className="font-display text-lg font-semibold text-ink">Daniélou Abidjan</p>
                <p className="text-sm font-medium tracking-[0.3em] text-navy-500 uppercase">Groupe Scolaire · Abidjan</p>
              </div>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-ink/95">
              Quand une conscience rencontre une confiance… Ancré à Bingerville, le Groupe Scolaire
              Daniélou Abidjan forme, de la maternelle au lycée, des élèves responsables et ouverts sur le monde.
            </p>

            {/* ----- Réseaux sociaux (page Facebook officielle) ----- */}
            <div className="mt-6 flex items-center gap-3">
              <span className="text-[0.85rem] font-semibold tracking-[0.25em] text-navy-500 uppercase">Suivez-nous</span>
              {social.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${s.name} — Groupe Scolaire Daniélou Abidjan`}
                  title={`${s.name} (page officielle)`}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1877F2] text-white shadow-md shadow-blue-500/25 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <Icon name={s.icon} className="h-5 w-5" filled />
                </a>
              ))}
            </div>
          </div>

          {/* ----- Navigation multi-pages ----- */}
          <nav aria-label="Liens rapides">
            <h3 className="text-[0.85rem] font-semibold tracking-[0.25em] text-navy-500 uppercase">Navigation</h3>
            <ul className="mt-5 space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <SmartLink href={link.href} className="group flex items-center gap-2 text-sm text-ink/95 transition-colors hover:text-navy-500">
                    <span className="h-px w-3 bg-copper-400 transition-all group-hover:w-5" aria-hidden="true" />
                    {link.label}
                  </SmartLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* ----- Coordonnées ----- */}
          <div>
            <h3 className="text-[0.85rem] font-semibold tracking-[0.25em] text-navy-500 uppercase">Contact</h3>
            <ul className="mt-5 space-y-4 text-sm text-ink/95">
              <li className="flex items-start gap-3">
                <Icon name="mapPin" className="mt-0.5 h-4 w-4 shrink-0 text-navy-500" />
                <span>
                  {contact.adresse}
                  <span className="mt-0.5 block text-xs text-ink/95">{contact.bp}</span>
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Icon name="phone" className="h-4 w-4 shrink-0 text-navy-500" />
                {contact.telephone}
              </li>
              <li className="flex items-center gap-3">
                <Icon name="phone" className="h-4 w-4 shrink-0 text-navy-500" />
                {contact.telephoneMobile}
              </li>
              <li className="flex items-center gap-3">
                <Icon name="mail" className="h-4 w-4 shrink-0 text-navy-500" />
                {contact.email}
              </li>
              <li className="flex items-start gap-3">
                <Icon name="clock" className="mt-0.5 h-4 w-4 shrink-0 text-navy-500" />
                {contact.horaires}
              </li>
              <li>
                <a
                  href={contact.geoloc}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex min-h-[44px] items-center gap-2 rounded-full border border-navy-100 bg-white px-4 py-3 text-sm font-semibold text-ink transition-colors duration-300 hover:border-navy-300 hover:text-navy-500"
                >
                  <Icon name="mapPin" className="h-4 w-4 text-navy-500" />
                  Géolocalisation
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* ================= Ligne 2 : admissions + pages utiles ================= */}
        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_2fr]">
          {/* ----- Carte admissions : blanche bordée, fin trait orange ----- */}
          <div className="relative overflow-hidden rounded-3xl border border-navy-100 bg-white p-6">
            <span className="absolute right-0 top-0 h-1 w-1/3 bg-copper-500" aria-hidden="true" />
            <h3 className="text-[0.85rem] font-semibold tracking-[0.25em] text-navy-500 uppercase">Admissions</h3>
            <p className="mt-3 text-sm leading-relaxed text-ink/95">
              Les pré-inscriptions pour la rentrée 2026 – 2027 sont ouvertes. Les places restantes sont limitées.
            </p>
            <SmartLink
              href="/inscriptions#preinscription"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-navy-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-navy-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-navy-600 hover:shadow-lg"
            >
              <Icon name="cap" className="h-4 w-4" />
              Pré-inscrire mon enfant
            </SmartLink>
          </div>

          {/* ----- Pages utiles : toutes les pages du site ----- */}
          <nav aria-label="Pages utiles du site">
            <h3 className="text-[0.85rem] font-semibold tracking-[0.25em] text-navy-500 uppercase">Pages utiles</h3>
            <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2.5 sm:grid-cols-3 lg:grid-cols-4">
              {pagesUtiles.map((p) => (
                <li key={p.href}>
                  <SmartLink
                    href={p.href}
                    className="group flex items-center gap-1.5 text-[0.8rem] leading-snug text-ink/80 transition-colors hover:text-navy-500"
                  >
                    <span className="h-1 w-1 shrink-0 rounded-full bg-copper-400" aria-hidden="true" />
                    {p.label}
                  </SmartLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* ----- Barre de copyright ----- */}
      <div className="border-t border-navy-100">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-center text-xs text-ink/65 sm:flex-row sm:px-6 lg:px-8 lg:text-left">
          <p>© {new Date().getFullYear()} Groupe Scolaire Daniélou Abidjan — Tous droits réservés.</p>
          <p className="flex items-center gap-2">
            Excellence académique à <span className="font-semibold text-copper-500">Abidjan</span> · Côte d'Ivoire
            <Link
              to="/admin/dashboard"
              aria-label="Espace de gestion du site"
              className="ml-1 text-xs text-ink/75 underline-offset-4 transition-colors hover:text-navy-500 hover:underline focus-visible:ring-2 focus-visible:ring-navy-300"
            >
              Gestion
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
