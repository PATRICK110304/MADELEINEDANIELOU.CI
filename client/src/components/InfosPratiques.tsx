// ============================================================
// client/src/components/InfosPratiques.jsx
// Section #infos — « Vie scolaire » : TOUTES les pages
// officielles intégrées directement (aucune redirection) :
//   • Scolarité (#scolarite)   : grille tarifaire réelle 2026-2027
//   • Cantine (#cantine)       : tarif + modalités de paiement
//   • Transports (#transports) : cars, tarif, compte AFG Bank
//   • Fournitures (#fournitures) : permanence + réduction Carrefour
//   • Menu de la cantine (#menu-cantine) : semaine en cours
//   • Règlements intérieurs (#reglements) : 3 PDF officiels
// ============================================================
import PhotoCard from './PhotoCard'
import { infosPratiques } from '../data/content'
import Icon from './Icons'
import SectionHeader from './SectionHeader'
import Reveal from './Reveal'

export default function InfosPratiques() {
  const s = infosPratiques.scolarite
  return (
    <section id="infos" className="scroll-mt-24 bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeader as="h1"
            eyebrow="Vie scolaire"
            title="Informations pratiques"
            subtitle="Scolarité, cantine, transports, fournitures et règlements : toutes les informations officielles de l'année 2026 – 2027, directement intégrées."
          />
        </Reveal>

        <div className="mx-auto grid max-w-6xl gap-8">
          {/* ================= SCOLARITÉ (#scolarite) ================= */}
          <Reveal>
            <article id="scolarite" className="scroll-mt-32 overflow-hidden rounded-3xl bg-white shadow-lg shadow-ink/5 ring-1 ring-navy-100">
              <header className="flex flex-wrap items-center justify-between gap-3 border-b border-navy-100 bg-copper-500 px-7 py-5">
                <h3 className="font-display flex items-center gap-2.5 text-xl font-semibold text-white">
                  <Icon name="fileText" className="h-5 w-5" />
                  Scolarité — année 2026 – 2027
                </h3>
                <span className="text-xs font-semibold tracking-widest text-white/85 uppercase">{s.note}</span>
              </header>
              <div className="overflow-x-auto p-6 sm:p-8">
                {/* Pré-inscription */}
                <div className="grid gap-3 sm:grid-cols-4">
                  {s.preinscription.map((p) => (
                    <div key={p.cycle} className="rounded-2xl bg-navy-50/70 p-4 text-center ring-1 ring-navy-100">
                      <p className="text-xs font-semibold tracking-wide text-ink/95 uppercase">Pré-inscription</p>
                      <p className="mt-1 text-sm font-semibold text-ink">{p.cycle}</p>
                      <p className="font-display mt-1 text-lg font-semibold text-navy-500">{p.montant}</p>
                    </div>
                  ))}
                </div>
                {/* Versements */}
                <table className="mt-6 w-full min-w-125 text-left text-sm">
                  <thead>
                    <tr className="border-b border-navy-100 text-[0.7rem] font-semibold tracking-wider text-ink/95 uppercase">
                      <th className="py-2 pr-3">Date des versements</th>
                      <th className="py-2 pr-3">Préscolaire</th>
                      <th className="py-2 pr-3">Primaire</th>
                      <th className="py-2 pr-3">Collège</th>
                      <th className="py-2">Lycée</th>
                    </tr>
                  </thead>
                  <tbody>
                    {s.versements.map((v) => (
                      <tr key={v.date} className="border-b border-navy-100">
                        <td className="py-3 pr-3 text-ink/95">{v.date}</td>
                        <td className="py-3 pr-3 font-semibold text-ink">{v.prescolaire}</td>
                        <td className="py-3 pr-3 font-semibold text-ink">{v.primaire}</td>
                        <td className="py-3 pr-3 font-semibold text-ink">{v.college}</td>
                        <td className="py-3 font-semibold text-ink">{v.lycee}</td>
                      </tr>
                    ))}
                    <tr className="bg-navy-50">
                      <td className="py-3 pr-3 font-semibold text-navy-500 uppercase">Total annuel</td>
                      <td className="py-3 pr-3 font-display font-semibold text-navy-500">{s.totaux.prescolaire}</td>
                      <td className="py-3 pr-3 font-display font-semibold text-navy-500">{s.totaux.primaire}</td>
                      <td className="py-3 pr-3 font-display font-semibold text-navy-500">{s.totaux.college}</td>
                      <td className="py-3 font-display font-semibold text-navy-500">{s.totaux.lycee}</td>
                    </tr>
                  </tbody>
                </table>
                <p className="mt-5 flex items-start gap-2.5 rounded-xl bg-navy-50 p-4 text-xs leading-relaxed text-navy-800">
                  <Icon name="shield" className="mt-0.5 h-4 w-4 shrink-0 text-navy-500" />
                  {s.paiement}
                </p>
              </div>
            </article>
          </Reveal>

          {/* ================= CANTINE (#cantine) + TRANSPORTS (#transports) ================= */}
          <div className="grid gap-8 lg:grid-cols-2">
            <Reveal>
              <PhotoCard
                id="cantine"
                className="scroll-mt-32 h-full"
                image={infosPratiques.cantine.image}
                alt="Service de restauration scolaire"
                title="Cantine"
                desc={infosPratiques.cantine.texte}
                label={infosPratiques.cantine.tarif}
              />
            </Reveal>

            <Reveal delay={100}>
              <PhotoCard
                id="transports"
                className="scroll-mt-32 h-full"
                image={infosPratiques.transports.images[0]}
                alt="Service de cars scolaires"
                title="Transports"
                desc={infosPratiques.transports.texte}
                label={infosPratiques.transports.tarif}
              />
            </Reveal>
          </div>

          {/* ================= FOURNITURES (#fournitures) + MENU (#menu-cantine) ================= */}
          <div className="grid gap-8 lg:grid-cols-2">
            <Reveal>
              <PhotoCard
                id="fournitures"
                className="scroll-mt-32 h-full"
                image={infosPratiques.fournitures.image}
                alt="Réduction librairie Carrefour"
                title="Fournitures & manuels"
                desc={infosPratiques.fournitures.texte}
              />
            </Reveal>

            <Reveal delay={100}>
              <PhotoCard
                id="menu-cantine"
                className="scroll-mt-32 h-full"
                image={infosPratiques.menuSemaine.image}
                alt="Menu de la cantine de la semaine"
                title="Menu de la cantine"
                desc="Le menu de la semaine est mis à jour chaque lundi par le service de restauration."
                label={infosPratiques.menuSemaine.periode}
              />
            </Reveal>
          </div>

          {/* ================= RÈGLEMENTS INTÉRIEURS (#reglements) ================= */}
          <Reveal>
            <article id="reglements" className="scroll-mt-32 rounded-3xl bg-navy-50/60 p-7 ring-1 ring-navy-100 sm:p-9">
              <h3 className="font-display flex items-center gap-2.5 text-xl font-semibold text-ink">
                <Icon name="shield" className="h-5 w-5 text-navy-600" />
                Règlements intérieurs — 2026 – 2027
              </h3>
              <p className="mt-2 text-sm text-ink/95">{infosPratiques.reinscriptions}</p>
              <ul className="mt-5 grid gap-3 sm:grid-cols-3">
                {infosPratiques.reglements.map((r) => (
                  <li key={r.file}>
                    <a
                      href={r.file}
                      download
                      className="group flex h-full items-center gap-3.5 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-navy-100 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy-100 text-navy-600">
                        <Icon name="fileText" className="h-5 w-5" />
                      </span>
                      <span className="min-w-0 flex-1 truncate text-sm font-semibold text-ink">{r.title}</span>
                      <Icon name="download" className="h-4 w-4 shrink-0 text-navy-500 transition-transform group-hover:translate-y-0.5" />
                    </a>
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
