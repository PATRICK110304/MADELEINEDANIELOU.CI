import type { ReactNode } from 'react'

/* Carte KPI — Hui : titre court, valeur calculée, icône et liseré d'accent.
   Largeur variable gérée par la grille du dashboard. */
export default function KpiCard({
  label, value, note, accent = false, icon,
}: {
  label: string; value: ReactNode; note?: string; accent?: boolean; icon?: ReactNode
}) {
  return (
    <div className="group relative overflow-hidden rounded-3xl bg-white p-6 ring-1 ring-navy-100 shadow-sm shadow-ink/5 transition-transform duration-200 ease-out hover:-translate-y-0.5">
      <span className={`absolute inset-x-0 top-0 h-1 ${accent ? 'bg-copper-500' : 'bg-navy-500'}`} aria-hidden="true" />
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-ink/90">{label}</p>
        {icon && <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${accent ? 'bg-copper-50 text-copper-500' : 'bg-navy-50 text-navy-500'}`}>{icon}</span>}
      </div>
      <p className={`font-display mt-3 text-[2.4rem] leading-none font-semibold tabular-nums ${accent ? 'text-copper-600' : 'text-navy-500'}`}>{value ?? '—'}</p>
      {note && <p className="mt-2 text-xs text-ink/90">{note}</p>}
    </div>
  )
}
