export default function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    nouveau: 'bg-navy-50 text-navy-500',
    en_attente: 'bg-copper-50 text-copper-700',
    validee: 'bg-success/10 text-success',
    refusee: 'bg-error/10 text-error',
  }
  const labels: Record<string, string> = { nouveau: 'Nouveau', en_attente: 'En attente', validee: 'Validée', refusee: 'Refusée' }
  return <span className={`inline-flex min-h-[28px] items-center rounded-full px-3 text-xs font-semibold ${map[status] || map.nouveau}`}>{labels[status] || status}</span>
}
