// ============================================================
// Cycles.tsx — « Deux portes d'entrée » — composition
// éditoriale asymétrique. Cartes photos via PhotoCard.
// ============================================================
import { Link } from 'react-router-dom'
import Icon from './Icons'
import PhotoCard from './PhotoCard'
import Reveal from './Reveal'

export default function Cycles() {
  return (
    <section className="bg-mist mt-24 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ----- Titre éditorial aligné à gauche (pas de header centré) ----- */}
        <Reveal>
          <div className="mb-12 max-w-2xl lg:mb-16">
            <h2 className="font-display text-3xl leading-tight font-semibold text-copper-500 sm:text-4xl">
              Deux portes d'entrée dans l'établissement
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink/95">
              De la toute petite section à la terminale, chaque cycle a ses repères, son rythme
              et son équipe. Choisissez la porte qui correspond à votre enfant.
            </p>
          </div>
        </Reveal>

        {/* ----- Composition asymétrique 7 / 5 ----- */}
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
          {/* ============ Panneau large : LE SECONDAIRE ============ */}
          <Reveal className="lg:col-span-7">
            <PhotoCard
              image="/images/photo-lycee.webp"
              alt="Élèves du secondaire du Groupe Scolaire Daniélou Abidjan"
              href="/enseignements#college"
              title="Seconde → Terminale, la préparation aux grandes étapes"
              label="COLLÈGE · LYCÉE"
              className="h-full"
            />
          </Reveal>

          {/* ============ Colonne latérale : L'ÉCOLE (2 panneaux empilés) ============ */}
          <div className="grid gap-6 lg:col-span-5 lg:grid-rows-2 lg:gap-8">
            <Reveal delay={80}>
              <PhotoCard
                image="/images/primaire.webp"
                alt="Classe de primaire du Groupe Scolaire Daniélou Abidjan"
                href="/enseignements#maternelle"
                title="Les fondations, en douceur et en confiance"
                label="MATERNELLE · PRIMAIRE"
                className="h-full"
                buttonLabel="Découvrir l'école"
              />
            </Reveal>

            <Reveal delay={160}>
              <Link
                to="/inscriptions"
                className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-navy-100 bg-white p-7 sm:p-8"
                aria-label="Pré-inscrire un enfant"
              >
                <div>
                  <p className="text-xs font-semibold tracking-[0.3em] text-navy-500 uppercase">Admissions 2026 – 2027</p>
                  <h3 className="font-display mt-3 text-2xl leading-snug font-semibold text-ink">
                    Pré-inscrire un enfant, en 3 étapes simples
                  </h3>
                  <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink/95">
                    Formulaire en ligne, suivi par le secrétariat sous 48 heures.
                  </p>
                </div>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-navy-500 transition-transform duration-300 group-hover:translate-x-1">
                  Commencer le dossier
                  <Icon name="arrowRight" className="h-4 w-4" />
                </span>
                <span className="absolute right-0 top-0 h-1 w-1/3 bg-copper-500" aria-hidden="true" />
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
