// ============================================================
// client/src/components/Reveal.tsx
// Apparition douce au scroll : fade + micro-déplacement,
// 200-300 ms ease-out, prefers-reduced-motion respecté.
// ============================================================
import useInView from '../hooks/useInView'

export default function Reveal({ children, delay = 0, className = '' }) {
  const [ref, inView] = useInView({ threshold: 0.15 })
  const reduced =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (reduced) return <div ref={ref} className={className}>{children}</div>

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-300 ease-out will-change-transform ${
        inView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      } ${className}`}
    >
      {children}
    </div>
  )
}
