// ============================================================
// client/src/pages/LegalNoticePage.tsx — mentions légales
// Coordonnées réelles du GSMD ; champs d'hébergement à renseigner
// par l'établissement avant la mise en ligne (non inventés).
// ============================================================
import { Link } from 'react-router-dom'
import { contact } from '../data/content'

/* Les champs manquants restent visibles en interne quand ce drapeau est vrai.
   En production ils sont masqués jusqu'à réception des informations de l'école. */
const SHOW_PLACEHOLDERS = import.meta.env.VITE_SHOW_LEGAL_PLACEHOLDERS === 'true'

const h2 = 'font-display mt-10 text-xl font-semibold text-ink'
const p = 'mt-3 text-sm leading-relaxed text-ink/90'
const warn = 'mt-3 rounded-xl border border-copper-500/30 bg-copper-500/10 p-4 text-sm leading-relaxed text-ink'

export default function LegalNoticePage() {
  return (
    <div className="bg-mist">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <nav aria-label="Fil d’Ariane" className="text-xs font-semibold tracking-wider text-navy-500 uppercase">
          <Link to="/" className="hover:underline">Accueil</Link> <span aria-hidden="true">/</span> Mentions légales
        </nav>
        <h1 className="font-display mt-4 text-3xl font-semibold text-ink sm:text-4xl">Mentions légales</h1>

        <section className="mt-10 rounded-3xl bg-white p-6 ring-1 ring-navy-100 sm:p-8">
          <h2 className={h2}>1. Éditeur du site</h2>
          <p className={p}>
            Ce site est édité par la <strong>Communauté Saint-François-Xavier</strong>, qui anime le
            Groupe Scolaire Madeleine-Daniélou Abidjan (GSMD).<br />
            {contact.adresse}<br />
            {contact.bp}<br />
            Téléphone du secrétariat : {contact.telephone} · {contact.telephoneMobile}<br />
            Email du secrétariat : <a className="text-navy-500 underline" href={`mailto:${contact.email}`}>{contact.email}</a><br />
            Téléphone de la Communauté : +225 27 22 44 01 86<br />
            Email de la Communauté : <a className="text-navy-500 underline" href="mailto:sfx-abidjan@communaute-sfx.com">sfx-abidjan@communaute-sfx.com</a>
          </p>
          {SHOW_PLACEHOLDERS ? (
            <p className={p}>
              <strong className="font-semibold text-copper-700">À COMPLÉTER PAR L'ÉCOLE :</strong>{' '}
              nom et qualité du directeur de publication.
            </p>
          ) : (
            <p className={p}>Le secrétariat du GSMD est l'interlocuteur pour toute question relative à cette publication.</p>
          )}

          <h2 className={h2}>2. Hébergement</h2>
          {SHOW_PLACEHOLDERS ? (
            <div className={warn}>
              <strong className="font-semibold text-ink">Information à compléter avant la mise en ligne.</strong>
              <br />
              <strong className="font-semibold text-copper-700">À COMPLÉTER PAR L'ÉCOLE :</strong>{' '}
              nom de l'hébergeur, adresse postale, téléphone, email de contact et lieu d'hébergement
              du serveur. Aucune information d'hébergement n'a été inventée dans cette page.
            </div>
          ) : (
            <p className={p}>Les coordonnées de l'hébergeur sont communiquées sur demande par le secrétariat de l'établissement.</p>
          )}

          <h2 className={h2}>3. Accès administrateur</h2>
          <p className={p}>
            L'espace de gestion (<Link className="text-navy-500 underline" to="/admin/dashboard">/admin/dashboard</Link>)
            est réservé au personnel autorisé du GSMD. Tout accès non autorisé est interdit et
            susceptible d'être signalé.
          </p>

          <h2 className={h2}>4. Propriété intellectuelle</h2>
          <p className={p}>
            L'ensemble des contenus du site — textes, photographies, logos, documents et éléments
            graphiques — est la propriété du Groupe Scolaire Madeleine-Daniélou Abidjan ou de ses
            ayants droit. Toute reproduction, même partielle, sans autorisation écrite préalable
            est interdite.
          </p>

          <h2 className={h2}>5. Liens externes</h2>
          <p className={p}>
            Les liens vers des sites tiers (réseaux sociaux, cartes, ressources pédagogiques) sont
            fournis à titre informatif. Le GSMD n'exerce aucun contrôle sur leur contenu et
            décline toute responsabilité quant à leur utilisation.
          </p>

          <h2 className={h2}>6. Droit applicable</h2>
          <p className={p}>
            Les présentes mentions sont régies par le droit ivoirien. Les données personnelles
            collectées via le site sont traitées conformément à la loi n° 2013-450 du 19 novembre
            2013 relative à la protection des données personnelles et aux prescriptions de l'ARTCI.
            Consultez la{' '}
            <Link className="text-navy-500 underline" to="/politique-confidentialite">politique de confidentialité</Link>{' '}
            pour en savoir plus sur vos droits.
          </p>

          <p className="mt-8 text-xs text-ink/90">Dernière révision : {new Date().getFullYear()}</p>
        </section>
      </div>
    </div>
  )
}
