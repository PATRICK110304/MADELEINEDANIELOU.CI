// ============================================================
// client/src/components/Stats.tsx
// Chiffres clés : carte BLANCHE bordée qui chevauche le hero,
// compteurs animés via useCountUp (encre + suffixe orange),
// séparateurs plats discrets.
// ============================================================
import { stats } from '../data/content'
import useInView from '../hooks/useInView'
import useCountUp from '../hooks/useCountUp'
import Reveal from './Reveal'

/* Un chiffre clé : compteur animé + libellé */
function Stat({ value, suffix, label, started }) {
  const count = useCountUp(value, started)
  return (
    <div className="flex flex-col items-center text-center">
      <p className="font-display text-[1.75rem] sm:text-[2.25rem] lg:text-[2.75rem] font-semibold text-ink sm:text-5xl lg:text-5xl">
        {count.toLocaleString('fr-FR')}
        <span className="text-copper-600">{suffix}</span>
      </p>
      <p className="mt-3 max-w-[10rem] text-sm font-medium tracking-wide text-ink/95 uppercase sm:max-w-none sm:normal-case sm:text-base">
        {label}
      </p>
    </div>
  )
}

export default function Stats({ className = '' }) {
  const [ref, inView] = useInView({ threshold: 0.3 })

  return (
    <div className={`relative z-20 px-4 sm:px-6 lg:px-8 ${className}`}>
      <Reveal>
        <div
          ref={ref}
          className="glow-navy mx-auto grid max-w-6xl grid-cols-2 gap-x-4 gap-y-8 rounded-3xl bg-white p-8 ring-1 ring-navy-100 sm:gap-8 lg:grid-cols-4 lg:p-12"
        >
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`relative flex justify-center ${i > 0 ? 'before:absolute before:-left-2 before:top-1/2 before:h-14 before:w-px before:-translate-y-1/2 before:bg-navy-100 max-lg:before:hidden lg:before:block' : ''}`}
            >
              <Stat {...s} started={inView} />
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  )
}
