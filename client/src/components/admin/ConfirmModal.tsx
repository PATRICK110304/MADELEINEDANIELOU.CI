import { useEffect, useRef } from 'react'
import Icon from '../Icons'

export default function ConfirmModal({ message, onConfirm, onCancel }: { message: string; onConfirm: () => void; onCancel: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const cancelRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    document.body.style.overflow = 'hidden'
    cancelRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
      if (e.key === 'Tab') {
        const focusables = dialogRef.current?.querySelectorAll<HTMLElement>('button')
        if (!focusables?.length) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      previous?.focus()
    }
  }, [onCancel])

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[rgb(8_40_80_/_0.6)] p-4" role="dialog" aria-modal="true" aria-label="Confirmation" ref={dialogRef}>
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        <p className="text-base text-ink/90">{message}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button ref={cancelRef} onClick={onCancel} className="min-h-[44px] rounded-full border border-navy-100 px-6 font-semibold text-ink focus-visible:ring-2 focus-visible:ring-navy-500">Annuler</button>
          <button onClick={onConfirm} className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-error px-6 font-semibold text-white focus-visible:ring-2 focus-visible:ring-error"><Icon name="x" className="h-4 w-4" /> Supprimer</button>
        </div>
      </div>
    </div>
  )
}
