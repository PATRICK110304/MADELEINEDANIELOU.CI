import type { ReactNode } from 'react'
import { useEffect } from 'react'
import Icon from '../Icons'

export default function SlideOverDrawer({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', key)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', key); document.body.style.overflow = '' }
  }, [onClose])
  return (
    <>
      <div className="fixed inset-0 z-[100] bg-[rgb(8_40_80_/_0.6)]" onClick={onClose} aria-hidden="true" />
      <aside role="dialog" aria-modal="true" aria-label={title} className="fixed inset-y-0 right-0 z-[101] w-full max-w-lg overflow-y-auto bg-white p-6 shadow-2xl sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-xl font-semibold text-ink">{title}</h2>
          <button onClick={onClose} aria-label="Fermer le panneau" className="min-h-[44px] rounded-full border border-navy-100 px-4 text-ink"><Icon name="x" className="h-5 w-5" /></button>
        </div>
        <div className="mt-6">{children}</div>
      </aside>
    </>
  )
}
