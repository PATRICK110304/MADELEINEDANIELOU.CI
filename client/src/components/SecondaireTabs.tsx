// ============================================================
// client/src/components/SecondaireTabs.tsx
// Section « Collège & Lycée » — mise en valeur CLAIRE des deux
// cycles du secondaire :
//   • Onglets distincts Collège ⇄ Lycée (a11y : role=tab)
//   • Panneau blanc bordé, accents bleu et orange discrets
//   • Règlement intérieur secondaire (PDF local)
//   • CTA pré-inscription (bleu)
// Ancres #college / #lycee gérées.
// ============================================================
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { enseignements, infosPratiques } from '../data/content'
import Icon from './Icons'
import SectionHeader from './SectionHeader'
import Reveal from './Reveal'

const tabs = [
  {
    id: 'college',
    label: 'Collège',
    icon: 'bookOpen',
    tagline: '6ème → 3ème · construire les fondations',
    details: [
      "Langues vivantes : Allemand, Espagnol dès la 5ème · Portugais dès la 6ème",
      "Options ouvertes dès la 4ème : Environnement & techniques agricoles, Économie Sociale et Familiale",
      "Bibliothèque-CDI : initiation à la recherche documentaire et aux TIC",
      "Formation humaine, enseignement religieux, projets interdisciplinaires",
    ],
  },
  {
    id: 'lycee',
    label: 'Lycée',
    icon: 'cap',
    tagline: '2nde → Terminale · préparer l’excellence',
    details: [
      "Séries : 2nde A · 2nde C — 1ère A · C · D — Tle A1 · A2 · C · D",
      "Latin au Lycée · cours de méthodologie du travail personnel en Seconde",
      "Effectif maximum : 35 élèves par classe",
      "Préparation aux examens nationaux (BAC) et orientation post-bac",
    ],
  },
]

export default function SecondaireTabs() {
  /* Onglet actif : Collège par défaut, ou Lycée si l'URL porte #lycee */
  const [active, setActive] = useState('college')
  const secondaire = enseignements.secondaire
  const reglementSec = infosPratiques.reglements.find((r) => r.file.includes('secondaire'))

  /* Si on arrive via /enseignements#lycee (ou #college), activer l'onglet */
  useEffect(() => {
    const sync = () => {
      if (window.location.hash === '#lycee') setActive('lycee')
      if (window.location.hash === '#college') setActive('college')
    }
    sync()
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [])

  const current = tabs.find((t) => t.id === active)

  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeader
            eyebrow="Le secondaire · Collège & Lycée"
            title="Deux cycles, une même exigence d'excellence"
            subtitle={`Sous la direction de ${secondaire.directrice} — programmes rigoureux, langues vivantes, méthodologie du travail personnel.`}
          />
        </Reveal>

        {/* ================= ONGLETS Collège ⇄ Lycée ================= */}
        <Reveal>
          <div
            role="tablist"
            aria-label="Choisir un cycle du secondaire"
            className="mx-auto mb-8 flex max-w-xl gap-2 rounded-2xl border border-navy-100 bg-mist p-2 sm:mb-10"
          >
            {tabs.map((t) => (
              <button
                key={t.id}
                id={t.id}
                role="tab"
                aria-selected={active === t.id}
                onClick={() => setActive(t.id)}
                className={`group relative flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-semibold transition-all duration-300 sm:text-base ${
                  active === t.id
                    ? 'bg-navy-500 text-white shadow-md shadow-navy-500/25'
                    : 'text-ink hover:bg-white hover:text-navy-500'
                }`}
              >
                <Icon name={t.icon} className="h-4.5 w-4.5" />
                {t.label}
              </button>
            ))}
          </div>
        </Reveal>

        {/* ================= Panneau de l'onglet actif ================= */}
        <div key={active} className="animate-fade-up">
          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-white ring-1 ring-navy-100 shadow-xl shadow-ink/5">
            {/* Fin trait orange en haut */}
            <div className="absolute inset-x-0 top-0 h-1 bg-copper-500" aria-hidden="true" />

            <div className="relative grid gap-0 lg:grid-cols-[1.15fr_1fr]">
              {/* ----- Colonne gauche : programme du cycle ----- */}
              <div className="p-8 sm:p-10 lg:p-12">
                <p className="inline-flex items-center gap-2 rounded-full border border-copper-200 bg-copper-50 px-4 py-1.5 text-[0.7rem] font-semibold tracking-[0.2em] text-copper-600 uppercase">
                  <Icon name="shield" className="h-3.5 w-3.5" />
                  {current.tagline}
                </p>
                <h3 className="font-display mt-5 text-3xl font-semibold text-ink sm:text-4xl">
                  {current.label} <span className="text-copper-500">Daniélou</span>
                </h3>
                <p className="mt-3 text-sm font-medium text-ink/95">
                  {secondaire.effectif} · direction {secondaire.directrice}
                </p>

                {/* Liste du programme : puces bleues */}
                <ul className="mt-7 space-y-3.5">
                  {current.details.map((d) => (
                    <li key={d} className="flex items-start gap-3 text-sm leading-relaxed text-ink/95">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-navy-50 ring-1 ring-navy-200">
                        <Icon name="check" className="h-3 w-3 text-navy-500" />
                      </span>
                      {d}
                    </li>
                  ))}
                </ul>

                {/* Classes du cycle */}
                <div className="mt-7 flex flex-wrap gap-2">
                  {(current.id === 'college' ? secondaire.college : secondaire.lycee).map((c) => (
                    <span
                      key={c}
                      className="rounded-full border border-navy-100 bg-navy-50 px-4 py-2 text-xs font-semibold text-navy-500"
                    >
                      {c}
                    </span>
                  ))}
                </div>

                {/* CTA : pré-inscription + règlement secondaire (PDF local) */}
                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                  <Link
                    to="/inscriptions#preinscription"
                    className="group inline-flex items-center justify-center gap-2 rounded-full bg-navy-500 px-7 py-3.5 text-sm font-semibold text-white shadow-md shadow-navy-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-navy-600 hover:shadow-lg"
                  >
                    Pré-inscrire pour le {current.label.toLowerCase()}
                    <Icon name="arrowRight" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                  {reglementSec && (
                    <a
                      href={reglementSec.file}
                      download
                      className="group inline-flex items-center justify-center gap-2 rounded-full border border-navy-100 bg-white px-7 py-3.5 text-sm font-semibold text-ink transition-colors duration-300 hover:border-navy-300 hover:text-navy-500"
                    >
                      <Icon name="download" className="h-4 w-4 text-navy-500" />
                      Règlement {current.label.toLowerCase()} (PDF)
                    </a>
                  )}
                </div>
              </div>

              {/* ----- Colonne droite : langues & options (fond beige) ----- */}
              <div className="border-t border-navy-100 bg-mist p-8 sm:p-10 lg:border-t-0 lg:border-l">
                <p className="text-xs font-semibold tracking-[0.25em] text-navy-500 uppercase">Langues & options</p>
                <ul className="mt-5 space-y-3">
                  {enseignements.langues.map((l) => (
                    <li
                      key={l.label}
                      className="flex items-center justify-between gap-3 rounded-2xl bg-white px-5 py-3.5 ring-1 ring-navy-100 transition-shadow duration-300 hover:shadow-md hover:shadow-ink/5"
                    >
                      <span className="text-sm font-semibold text-ink">{l.label}</span>
                      <span className="text-xs font-medium text-ink/65">{l.detail}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-7 text-xs font-semibold tracking-[0.25em] text-navy-500 uppercase">Options</p>
                <ul className="mt-4 space-y-2.5">
                  {enseignements.options.map((o) => (
                    <li key={o} className="flex items-start gap-2.5 text-sm text-ink/95">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-copper-400" aria-hidden="true" />
                      {o}
                    </li>
                  ))}
                </ul>
                {/* Méthodologie */}
                <div className="mt-7 rounded-2xl border border-navy-100 bg-white p-4 text-xs leading-relaxed text-ink/80">
                  <span className="font-semibold text-copper-500">Méthodologie — </span>
                  {enseignements.methode}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
