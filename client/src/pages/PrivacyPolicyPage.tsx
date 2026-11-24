// ============================================================
// client/src/pages/PrivacyPolicyPage.tsx
// Politique de confidentialité — collecte réelle des données
// (pré-inscriptions + messages de contact), RGPD / loi ivoirienne
// n° 2013-450 et prescriptions de l'ARTCI.
// ============================================================
import { Link } from 'react-router-dom'
import { contact } from '../data/content'
import { CONSENT_KEY, readConsent } from '../components/CookieBanner'

const h2 = 'font-display mt-10 text-xl font-semibold text-ink'
const p = 'mt-3 text-sm leading-relaxed text-ink/90'
const li = 'mt-2 text-sm leading-relaxed text-ink/90'

export default function PrivacyPolicyPage() {
  const choice = readConsent()
  const setChoice = (v: 'all' | 'none') => {
    try { localStorage.setItem(CONSENT_KEY, v) } catch { /* navigation privée */ }
    window.dispatchEvent(new Event('gsmd:consent'))
    window.location.reload()
  }

  return (
    <div className="bg-mist">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <nav aria-label="Fil d’Ariane" className="text-xs font-semibold tracking-wider text-navy-500 uppercase">
          <Link to="/" className="hover:underline">Accueil</Link> <span aria-hidden="true">/</span> Confidentialité
        </nav>
        <h1 className="font-display mt-4 text-3xl font-semibold text-ink sm:text-4xl">
          Politique de confidentialité
        </h1>
        <p className="mt-4 text-base leading-relaxed text-ink/90">
          Le Groupe Scolaire Daniélou Abidjan (« GSMD », « nous ») s'engage à protéger les données
          personnelles que vous nous confiez. Cette politique explique ce que nous collectons,
          pourquoi, combien de temps nous les conservons et quels sont vos droits.
        </p>

        <section className="mt-10 rounded-3xl bg-white p-6 ring-1 ring-navy-100 sm:p-8">
          <h2 className={h2}>1. Responsable du traitement</h2>
          <p className={p}>
            Groupe Scolaire Madeleine-Daniélou Abidjan<br />
            {contact.adresse}<br />
            {contact.bp}<br />
            Téléphone : {contact.telephone} · {contact.telephoneMobile}<br />
            Email : <a className="text-navy-500 underline" href={`mailto:${contact.email}`}>{contact.email}</a>
          </p>
          <p className={p}>
            Pour toute question relative à vos données ou pour exercer vos droits, écrivez à
            l'adresse email ci-dessus en précisant « Données personnelles ».
          </p>

          <h2 className={h2}>2. Données collectées</h2>
          <ul className="mt-3 list-disc pl-5">
            <li className={li}><strong>Pré-inscriptions</strong> : nom et prénom de l'élève, date de naissance, classe, établissement d'origine, nom du parent ou tuteur, lien de parenté, email, téléphone, adresse et message libre.</li>
            <li className={li}><strong>Messages de contact</strong> : nom, email, téléphone (facultatif), sujet, message et confirmation de votre accord.</li>
            <li className={li}><strong>Données techniques</strong> : adresse IP et horodatage des requêtes, limités à la sécurité et à la lutte contre le spam.</li>
            <li className={li}><strong>Cookies</strong> : seul votre choix de consentement est conservé dans votre navigateur (localStorage). Nous ne déposons aucun cookie publicitaire.</li>
          </ul>
          <p className={p}>
            Les champs obligatoires sont signalés dans les formulaires. Nous ne collectons pas de
            données sensibles (religion, santé, origine ethnique) via ce site.
          </p>

          <h2 className={h2}>3. Finalités et bases légales</h2>
          <ul className="mt-3 list-disc pl-5">
            <li className={li}>Instruction des pré-inscriptions et prise de contact par le secrétariat — <strong>exécution de la demande</strong> et <strong>intérêt légitime</strong> de l'établissement.</li>
            <li className={li}>Réponse aux messages de contact — <strong>consentement</strong> que vous donnez en cochant la case dédiée.</li>
            <li className={li}>Sécurité du site et prévention des abus — <strong>intérêt légitime</strong>.</li>
          </ul>

          <h2 className={h2}>4. Destinataires</h2>
          <p className={p}>
            Vos données sont accessibles uniquement au secrétariat et à l'équipe administrative
            habilitée du GSMD. Elles peuvent être hébergées chez un prestataire PostgreSQL et un
            service d'envoi d'emails, liés par des obligations de confidentialité. Elles ne sont
            ni vendues ni transmises à des tiers à des fins commerciales.
          </p>

          <h2 className={h2}>5. Durée de conservation</h2>
          <p className={p}>
            Les dossiers de pré-inscription sont conservés le temps de l'admission et de l'année
            scolaire concernée, puis archivés selon les obligations légales et réglementaires
            applicables aux établissements scolaires. Les messages de contact sont conservés
            jusqu'à leur traitement, puis supprimés. Les journaux techniques sont conservés
            brièvement à des fins de sécurité.
          </p>

          <h2 className={h2}>6. Sécurité</h2>
          <p className={p}>
            Les échanges sont chiffrés en HTTPS. Les accès administrateurs sont protégés par un
            jeton JWT et les mots de passe sont hachés avec bcrypt (facteur de coût 12). Les données
            sont stockées dans PostgreSQL et les fichiers uploadés sont traités puis enregistrés
            sur un stockage contrôlé. L'accès à l'espace d'administration est réservé aux comptes
            autorisés.
          </p>

          <h2 className={h2}>7. Vos droits</h2>
          <p className={p}>
            Conformément à la loi n° 2013-450 du 19 novembre 2013 relative à la protection des
            données personnelles et aux prescriptions de l'ARTCI (Autorité de régulation des
            télécommunications / TIC de Côte d'Ivoire), vous disposez d'un droit d'accès, de
            rectification, de suppression et d'opposition au traitement de vos données.
            Pour les exercer, adressez votre demande à <a className="text-navy-500 underline" href={`mailto:${contact.email}`}>{contact.email}</a>.
            Vous pouvez également retirer votre consentement à tout moment, sans préjudice de la
            licéité des traitements effectués auparavant.
          </p>

          <h2 className={h2}>8. Cookies et choix de consentement</h2>
          <p className={p}>
            Votre choix (« Tout accepter » ou « Tout refuser ») est enregistré localement dans
            votre navigateur sous la clé <code className="rounded bg-mist px-1">{CONSENT_KEY}</code>.
            Aucun traceur publicitaire n'est utilisé.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setChoice('all')}
              className={`min-h-[44px] rounded-full px-5 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-navy-300 ${choice === 'all' ? 'bg-navy-500 text-white' : 'border border-navy-200 bg-white text-ink hover:border-navy-400'}`}
            >
              Tout accepter
            </button>
            <button
              type="button"
              onClick={() => setChoice('none')}
              className={`min-h-[44px] rounded-full px-5 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-navy-300 ${choice === 'none' ? 'bg-navy-500 text-white' : 'border border-navy-200 bg-white text-ink hover:border-navy-400'}`}
            >
              Tout refuser
            </button>
          </div>

          <h2 className={h2}>9. Modifications</h2>
          <p className={p}>
            Cette politique peut être mise à jour. La date de dernière révision est indiquée
            ci-dessous ; toute modification substantielle sera signalée sur le site.
          </p>
          <p className="mt-6 text-xs text-ink/90">Dernière révision : {new Date().getFullYear()}</p>
        </section>

        <p className="mt-8 text-sm text-ink/90">
          Voir aussi : <Link to="/mentions-legales" className="font-semibold text-navy-500 underline">Mentions légales</Link>
          {' '}et <Link to="/contact" className="font-semibold text-navy-500 underline">formulaire de contact</Link>.
        </p>
      </div>
    </div>
  )
}
