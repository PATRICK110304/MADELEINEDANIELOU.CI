// ============================================================
// client/src/components/FraisScolarite.tsx — Frais 2026-2027
// Données transmises par l'établissement (aucun chiffre inventé).
// ============================================================
import { inscriptionsInfo } from '../data/infos-ecole'
import SectionHeader from './SectionHeader'
import Reveal from './Reveal'
import Icon from './Icons'

export default function FraisScolarite() {
  const { fraisPreinscription, fraisScolarite, paiement, compteBancaire, processus } = inscriptionsInfo
  return (
    <section id="frais" className="scroll-mt-24 bg-mist py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeader eyebrow="Inscriptions 2026 – 2027" title="Frais de scolarité et processus" subtitle="Maternelle · Primaire · Collège · Lycée" />
        </Reveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {/* Pré-inscription */}
          <Reveal>
            <div className="rounded-3xl bg-white p-8 ring-1 ring-navy-100">
              <h2 className="font-display text-xl font-semibold text-ink">Frais de pré-inscription</h2>
              <ul className="mt-5 space-y-3">
                {fraisPreinscription.map((f) => (
                  <li key={f.cycle} className="flex items-center justify-between gap-4 border-b border-navy-100 pb-2 text-ink/90">
                    <span>{f.cycle}</span>
                    <span className="font-semibold text-navy-500">{f.montant}</span>
                  </li>
                ))}
              </ul>

              <h2 className="font-display mt-8 text-xl font-semibold text-ink">Frais de scolarité ({paiement})</h2>
              <ul className="mt-5 space-y-3">
                {fraisScolarite.map((f) => (
                  <li key={f.cycle} className="flex items-center justify-between gap-4 border-b border-navy-100 pb-2 text-ink/90">
                    <span>{f.cycle}</span>
                    <span className="font-semibold text-navy-500">{f.montant}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Compte + Processus */}
          <Reveal delay={80}>
            <div className="flex h-full flex-col gap-6">
              <div className="rounded-3xl bg-white p-8 ring-1 ring-navy-100">
                <h2 className="font-display flex items-center gap-2 text-xl font-semibold text-ink">
                  <Icon name="shield" className="h-5 w-5 text-navy-500" /> Compte bancaire
                </h2>
                <p className="mt-4 text-ink/90">{compteBancaire.titulaire} — {compteBancaire.banque}</p>
                <p className="mt-2 font-mono text-sm font-semibold text-navy-500">{compteBancaire.numero}</p>
              </div>
              <div id="processus" className="scroll-mt-24 rounded-3xl bg-white p-8 ring-1 ring-navy-100">
                <h2 className="font-display text-xl font-semibold text-ink">Processus d'inscription</h2>
                <ol className="mt-5 space-y-4">
                  {processus.map((p, i) => (
                    <li key={p} className="flex items-start gap-3 text-ink/90">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy-50 text-sm font-semibold text-navy-500">{i + 1}</span>
                      {p}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
