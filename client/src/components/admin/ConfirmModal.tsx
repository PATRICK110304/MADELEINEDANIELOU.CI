import Icon from '../Icons'

export default function ConfirmModal({ message, onConfirm, onCancel }: { message: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[rgb(8_40_80_/_0.6)] p-4" role="dialog" aria-modal="true" aria-label="Confirmation">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        <p className="text-base text-ink/90">{message}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button onClick={onCancel} className="min-h-[44px] rounded-full border border-navy-100 px-6 font-semibold text-ink">Annuler</button>
          <button onClick={onConfirm} className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-error px-6 font-semibold text-white"><Icon name="x" className="h-4 w-4" /> Supprimer</button>
        </div>
      </div>
    </div>
  )
}
