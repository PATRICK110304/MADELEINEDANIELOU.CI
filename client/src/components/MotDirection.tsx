// ============================================================
// client/src/components/MotDirection.tsx
// « Mot de la Direction » — page Présentation. Texte sobre
// fidèle au projet éducatif officiel (aucune invention de
// chiffre ou de nom : signé « La Direction » jusqu'à ce que
// le nom et la photo du directeur soient fournis).
// ============================================================
import { Link } from 'react-router-dom'
import { mission } from '../data/content'
import Icon from './Icons'
import Reveal from './Reveal'

export default function MotDirection() {
  return (
    <section className="bg-mist py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-16">
          {/* ----- Colonne signature ----- */}
          <Reveal className="lg:col-span-4">
            <p className="text-xs font-semibold tracking-[0.25em] text-navy-500 uppercase">Mot de la Direction</p>
            <h2 className="font-display mt-3 text-2xl leading-snug font-semibold text-copper-500 sm:text-3xl">
              Bienvenue à Daniélou Abidjan
            </h2>
            {/* Emplacement photo du directeur — à fournir par l'établissement */}
            <div className="mt-8 flex items-center gap-4 rounded-2xl bg-mist p-5 ring-1 ring-navy-200">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-navy-50 text-navy-500 ring-1 ring-navy-100">
                <Icon name="users" className="h-6 w-6" />
              </span>
              <div>
                <p className="text-sm font-semibold text-ink">Le Directeur et son équipe</p>
                <p className="mt-0.5 text-xs text-ink/95">
                  Secrétariat ouvert du lundi au vendredi, de 7 h à 16 h.
                </p>
              </div>
            </div>
          </Reveal>

          {/* ----- Texte de la direction ----- */}
          <Reveal delay={100} className="lg:col-span-8">
            <div className="space-y-5 text-base leading-relaxed text-ink/95">
              <p>
                Chers parents, chères élèves, chers partenaires, vous confier un enfant est une
                confiance que nous mesurons. Notre travail commence là : un cadre calme, une équipe
               stable, des classes où l'on connaît chaque élève par son prénom.
              </p>
              <p>
                Notre projet tient en une phrase :{' '}
                <strong className="font-semibold text-ink">« {mission.quote} »</strong> C'est la
                feuille de route de chaque enseignant, de la maternelle au lycée.
              </p>
              <p>
                Nous y ajoutons ce que le monde d'aujourd'hui exige : des langues vivantes dès le
                collège, l'initiation aux outils numériques, des projets qui emmènent les élèves —
                de la solidarité locale aux échanges internationaux du réseau Daniélou-Éducation.
              </p>
              <p>
                Je vous invite à nous écrire, à nous appeler, ou simplement à passer au secrétariat :
                nous répondons à toutes les questions, avant comme après l'inscription.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <Link
                to="/inscriptions#preinscription"
                className="group inline-flex items-center gap-2 rounded-full bg-navy-500 px-6 py-3 text-sm font-semibold text-white hover:bg-navy-600 transition-transform duration-300 hover:translate-x-0.5"
              >
                Pré-inscrire un enfant
                <Icon name="arrowRight" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link to="/contact" className="text-sm font-semibold text-navy-500 underline-offset-4 hover:underline">
                Ou nous contacter d'abord
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
