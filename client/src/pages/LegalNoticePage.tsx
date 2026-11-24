// ============================================================
// client/src/pages/LegalNoticePage.tsx — mentions légales
// Coordonnées réelles du GSMD ; champs d'hébergement à renseigner
// par l'établissement avant la mise en ligne (non inventés).
// ============================================================
import { Link } from 'react-router-dom'
import { contact } from '../data/content'

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
            Groupe Scolaire Madeleine-Daniélou Abidjan (GSMD)<br />
            {contact.adresse}<br />
            {contact.bp}<br />
            Téléphone : {contact.telephone} · {contact.telephoneMobile}<br />
            Email : <a className="text-navy-500 underline" href={`mailto:${contact.email}`}>{contact.email}</a>
          </p>
          <p className={p}>
            Directeur de publication : la Direction du Groupe Scolaire Madeleine-Daniélou Abidjan.
          </p>

          <h2 className={h2}>2. Hébergement</h2>
          <div className={warn}>
            <strong className="font-semibold text-ink">Information à compléter avant la mise en ligne.</strong>
            <br />
            Nom de l'hébergeur, adresse postale, téléphone et email de contact, ainsi que le lieu
            d'hébergement du serveur, doivent être renseignés ici par l'établissement dès que le
            prestataire de production est retenu (front statique et API Node/PostgreSQL).
            Aucune information d'hébergement n'a été inventée dans cette page.
          </div>

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
