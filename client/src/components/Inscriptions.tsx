// ============================================================
// client/src/components/Inscriptions.jsx
// Section #inscriptions — interface 2 colonnes (Collège / Lycée)
// avec liste des fiches PDF téléchargeables. Les documents
// proviennent de l'API (/api/documents, gérée par
// l'administration) avec repli sur client/public/documents/.
// ============================================================
import ImageCard from './ImageCard'
import { Link } from 'react-router-dom'
import { inscriptionColumns, contact } from '../data/content'
import { useDocuments } from '../services/api'
import Icon from './Icons'
import SectionHeader from './SectionHeader'
import Reveal from './Reveal'

/* Ligne "fiche PDF" : icône, titre, bouton de téléchargement */
function DocRow({ doc, accent }) {
  return (
    <li className="group flex items-center gap-4 rounded-2xl border border-navy-100 bg-navy-50/50 p-4 transition-all duration-300 hover:border-navy-300 hover:bg-white hover:shadow-md">
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${accent}`}>
        <Icon name="fileText" className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-ink">{doc.title}</p>
        <p className="text-xs text-ink/95">PDF · Téléchargement libre</p>
      </div>
      {/* Bouton de téléchargement orange */}
      <a
        href={doc.href}
        download={doc.file}
        aria-label={`Télécharger : ${doc.title}`}
        className="group/btn flex shrink-0 items-center gap-2 rounded-full bg-navy-500 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-navy-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
      >
        <Icon name="download" className="h-4 w-4 transition-transform group-hover/btn:translate-y-0.5" />
        <span className="hidden sm:inline">Télécharger</span>
      </a>
    </li>
  )
}

export default function Inscriptions() {
  const { items, offline, loading } = useDocuments()

  /* Répartition des documents par section (avec repli local) */
  const bySection = (key) =>
    items.filter((d) => d.section === key)
  const collegeDocs = loading ? [] : bySection('college')
  const lyceeDocs = loading ? [] : bySection('lycee')
  const commonDocs = loading ? [] : bySection('commun')

  return (
    <section id="inscriptions" className="scroll-mt-24 bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeader as="h1"
            eyebrow="Inscriptions & Documents"
            title="Tout ce qu'il faut pour s'inscrire"
            subtitle="Téléchargez librement les fiches d'inscription et documents officiels de l'établissement, mis à jour par notre secrétariat."
          />
        </Reveal>

        {/* ----- Interface 2 colonnes : Collège | Lycée ----- */}
        <div className="grid gap-7 lg:grid-cols-2 lg:gap-8">
          {inscriptionColumns.map((col, i) => {
            const docs = col.key === 'college' ? collegeDocs : lyceeDocs
            /* Collège → bleu institutionnel ; Lycée → orange */
            const accent = col.key === 'college' ? 'bg-navy-500 text-white' : 'bg-copper-400 text-ink'
            const isBlue = col.key === 'college'

            return (
              <Reveal key={col.key} delay={i * 120}>
                <article className="flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-lg shadow-ink/5 ring-1 ring-navy-100">
                  {/* Bandeau visuel du cycle — ImageCard (photo nette, gradient bleu marine) */}
                  <ImageCard
                    image={col.image}
                    alt={col.title}
                    title={col.title}
                    label={col.subtitle}
                    className="aspect-[16/9] sm:aspect-[3/2]"
                  />

                  {/* Points clés du cycle */}
                  <ul className="mt-6 space-y-2.5 px-6">
                    {col.points.map((p) => (
                      <li key={p} className="flex items-start gap-2.5 text-sm text-ink/95">
                        <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${isBlue ? 'bg-navy-50 text-navy-500' : 'bg-copper-50 text-copper-500'}`}>
                          <Icon name="check" className="h-3 w-3" />
                        </span>
                        {p}
                      </li>
                    ))}
                  </ul>

                  {/* Fiches PDF de la colonne */}
                  <div className="mt-6 flex-1 px-6">
                    <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-ink/95 uppercase">Fiches à télécharger</p>
                    <ul className="space-y-3">
                      {loading && <li className="py-4 text-sm text-ink/95">Chargement des documents…</li>}
                      {!loading && docs.map((d) => <DocRow key={d.id ?? d.file} doc={d} accent={accent} />)}
                    </ul>
                  </div>

                  {/* CTA pré-inscription au pied de la carte */}
                  <div className="p-6 pt-7">
                    <Link
                      to="/inscriptions#preinscription"
                      className={`group flex items-center justify-center gap-2 rounded-2xl px-6 py-4 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${
                        isBlue
                          ? 'bg-navy-500 shadow-lg shadow-navy-500/25 hover:bg-navy-600'
                          : 'bg-navy-500 shadow-lg shadow-navy-500/25 hover:bg-navy-600'
                      }`}
                    >
                      Pré-inscrire pour le {col.title.toLowerCase()}
                      <Icon name="arrowRight" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </article>
              </Reveal>
            )
          })}
        </div>

        {/* ----- Documents communs (règlement, calendrier, projet) ----- */}
        <Reveal delay={150}>
          <div className="mt-8 rounded-3xl bg-navy-50/50 p-6 ring-1 ring-navy-100 sm:p-8">
            <p className="mb-4 flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-ink/95 uppercase">
              <Icon name="fileText" className="h-4 w-4 text-navy-500" />
              Documents communs à tous les niveaux
              {offline && <span className="ml-auto text-[0.65rem] font-medium text-ink/95 normal-case tracking-normal">Mode local</span>}
            </p>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {loading && <li className="text-sm text-ink/95">Chargement…</li>}
              {!loading && commonDocs.map((d) => (
                <li key={d.id ?? d.file}>
                  <a
                    href={d.href}
                    download={d.file}
                    className="group flex h-full items-center gap-3.5 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-navy-100 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy-100 text-navy-600">
                      <Icon name="fileText" className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm font-semibold text-ink">{d.title}</span>
                    <Icon name="download" className="h-4 w-4 shrink-0 text-navy-500 transition-transform group-hover:translate-y-0.5" />
                  </a>
                </li>
              ))}
            </ul>
            {/* Aide du secrétariat */}
            <p className="mt-5 flex flex-wrap items-center gap-2 text-xs text-ink/95">
              <Icon name="phone" className="h-3.5 w-3.5" />
              Une question sur le dossier ? Contactez le secrétariat : {contact.telephone}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
