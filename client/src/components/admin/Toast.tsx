import { useEffect } from 'react'

export default function Toast({ message, onDone }: { message: string | null; onDone: () => void }) {
  useEffect(() => { if (!message) return; const t = setTimeout(onDone, 4000); return () => clearTimeout(t) }, [message, onDone])
  if (!message) return null
  return <div role="status" aria-live="polite" className="fixed bottom-6 right-6 z-[120] max-w-sm rounded-2xl bg-navy-500 px-6 py-4 text-sm font-semibold text-white shadow-xl">{message}</div>
}
