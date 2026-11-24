// ============================================================
// client/src/components/Partners.jsx
// Section #partenaires — Réseau Daniélou-Éducation :
// grille des établissements partenaires avec leurs logos
// officiels (téléchargés depuis madeleinedanielou.ci),
// gris au repos → couleur au survol.
// ============================================================
import { Link } from 'react-router-dom'
import { partners, partnersIntro, identity } from '../data/content'
import Icon from './Icons'
import SectionHeader from './SectionHeader'
import Reveal from './Reveal'

/* Corps de carte partenaire (logo + nom + pays) */
function PartnerCardBody({ p }) {
  return (
    <>
      {/* Logo : gris au repos, couleur au survol */}
      <div className="flex h-20 w-full items-center justify-center">
        <img
          src={p.logo}
          alt={`Logo ${p.name}`}
          loading="lazy"
          className="max-h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div>
        <p className="text-sm leading-snug font-semibold text-ink">{p.name}</p>
        <p className="mt-1 flex items-center justify-center gap-1.5 text-[0.7rem] font-medium tracking-wide text-navy-500 uppercase">
          <Icon name="mapPin" className="h-3 w-3" />
          {p.country}
        </p>
      </div>
    </>
  )
}

export default function Partners() {
  return (
    <section id="partenaires" className="relative scroll-mt-24 overflow-hidden bg-mist py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeader
            eyebrow=""
            title="Un réseau international, une même exigence"
            subtitle={partnersIntro.text}
          />
        </Reveal>

        {/* ----- Bandeau de logos défilant (animation douce continue) ----- */}
        <Reveal>
          <div className="marquee-viewport mb-12 rounded-3xl bg-white py-5 ring-1 ring-navy-100" aria-label="Établissements partenaires du réseau Daniélou-Éducation">
            <div className="marquee-track">
              {[...partners, ...partners].map((p, i) => (
                <div key={`${p.name}-${i}`} className={`flex w-44 shrink-0 items-center justify-center px-5 ${i >= partners.length ? 'marquee-duplicate' : ''}`} aria-hidden={i >= partners.length ? true : undefined}>
                  <img src={p.logo} alt={i >= partners.length ? '' : `Logo ${p.name}`} loading="lazy" decoding="async" className="max-h-12 w-auto object-contain" />
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* ----- Grille des partenaires (logos officiels) ----- */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 lg:gap-6">
          {partners.map((p, i) => (
            <Reveal key={p.name} delay={i * 60}>
              {/* Carte partenaire : simple carte sans lien si p.url est absent,
                  <a> externe uniquement pour les partenaires du réseau (autres établissements). */}
              {p.url ? (
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full flex-col items-center gap-4 rounded-3xl bg-white p-6 text-center shadow-md shadow-ink/5 ring-1 ring-navy-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-ink/8"
                  aria-label={`${p.name} — ${p.country} (site externe)`}
                >
                  <PartnerCardBody p={p} />
                </a>
              ) : (
                <div
                  className="group flex h-full flex-col items-center gap-4 rounded-3xl bg-white p-6 text-center shadow-md shadow-ink/5 ring-1 ring-navy-100"
                  aria-label={`${p.name} — ${p.country}`}
                >
                  <PartnerCardBody p={p} />
                </div>
              )}
            </Reveal>
          ))}
        </div>

        {/* ----- Encart d'identité (formation + appartenance) ----- */}
        <Reveal delay={150}>
          <div className="mt-10 flex flex-col items-center justify-between gap-5 rounded-3xl bg-white p-7 text-center shadow-md shadow-ink/5 ring-1 ring-navy-100 sm:flex-row sm:text-left lg:px-10">
            <div>
              <p className="text-xs font-semibold tracking-[0.25em] text-navy-500 uppercase">Qui sommes-nous ?</p>
              <p className="font-display mt-2 text-xl font-semibold text-ink sm:text-2xl">
                {identity.name} — animé par la Communauté Saint-François-Xavier
              </p>
              <p className="mt-2 text-sm text-ink/95">
                Membre du Réseau des Centres éducatifs Madeleine-Daniélou, école associée à l'UNESCO.
              </p>
            </div>
            <Link
              to="/inscriptions#preinscription"
              className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-navy-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-navy-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
            >
              Rejoindre le GSMD
              <Icon name="arrowRight" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
