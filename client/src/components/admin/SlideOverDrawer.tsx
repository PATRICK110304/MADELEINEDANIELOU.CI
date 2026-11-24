import type { ReactNode } from 'react'
import { useEffect, useRef } from 'react'
import Icon from '../Icons'

export default function SlideOverDrawer({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  const dialogRef = useRef<HTMLElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Tab') {
        const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        )
        if (!focusables?.length) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    window.addEventListener('keydown', key)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', key)
      document.body.style.overflow = ''
      previous?.focus()
    }
  }, [onClose])

  return (
    <>
      <div className="fixed inset-0 z-[100] bg-[rgb(8_40_80_/_0.6)]" onClick={onClose} aria-hidden="true" />
      <aside ref={dialogRef} role="dialog" aria-modal="true" aria-label={title} className="fixed inset-y-0 right-0 z-[101] w-full max-w-lg overflow-y-auto bg-white p-6 shadow-2xl sm:p-8" style={{ overscrollBehavior: 'contain' }}>
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-xl font-semibold text-ink">{title}</h2>
          <button ref={closeRef} onClick={onClose} aria-label="Fermer le panneau" className="min-h-[44px] rounded-full border border-navy-100 px-4 text-ink focus-visible:ring-2 focus-visible:ring-navy-500"><Icon name="x" className="h-5 w-5" /></button>
        </div>
        <div className="mt-6">{children}</div>
      </aside>
    </>
  )
}
