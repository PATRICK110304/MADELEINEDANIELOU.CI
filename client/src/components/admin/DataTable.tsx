import type { ReactNode } from 'react'

interface Column<T> { key: string; label: string; render: (row: T) => ReactNode }

export default function DataTable<T extends { id: string }>({
  rows, columns, search, onSearch, empty, loading,
}: {
  rows: T[]; columns: Column<T>[]; search?: string; onSearch?: (v: string) => void; empty?: string; loading?: boolean
}) {
  return (
    <div>
      {onSearch && (
        <label className="mb-4 block">
          <span className="sr-only">Rechercher</span>
          <input value={search || ''} onChange={(e) => onSearch(e.target.value)} placeholder="Rechercher…" className="w-full max-w-sm rounded-xl border border-navy-200 px-4 py-3 text-base text-ink" />
        </label>
      )}
      {loading ? (
        <div role="status" aria-live="polite" className="space-y-2">{[1, 2, 3].map((i) => <div key={i} className="h-12 animate-pulse rounded-xl bg-navy-50" />)}</div>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl bg-mist p-6 text-center text-ink/90">{empty || 'Aucune donnée.'}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead><tr className="border-b border-navy-100 text-ink/90">{columns.map((c) => <th key={c.key} className="py-3 pr-4 font-semibold">{c.label}</th>)}</tr></thead>
            <tbody>{rows.map((row) => <tr key={row.id} className="border-b border-navy-100 text-ink/90">{columns.map((c) => <td key={c.key} className="py-3 pr-4">{c.render(row)}</td>)}</tr>)}</tbody>
          </table>
        </div>
      )}
    </div>
  )
}
