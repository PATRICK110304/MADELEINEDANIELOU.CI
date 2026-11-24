// ============================================================
// client/src/hooks/useInView.ts
// Détecte l'entrée d'un élément dans le viewport (IntersectionObserver)
// — utilisé par les animations d'apparition et les compteurs.
// Retourne [réf à attacher, visible?].
// ============================================================
import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'

type UseInViewReturn = [RefObject<HTMLDivElement | null>, boolean]

export default function useInView(
  options: IntersectionObserverInit = { threshold: 0.15 },
): UseInViewReturn {
  const ref = useRef<HTMLDivElement | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true)
        observer.disconnect() // déclenchement unique
      }
    }, options)
    observer.observe(el)
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return [ref, inView]
}
