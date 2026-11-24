// ============================================================
// client/src/hooks/useCountUp.js
// Compteur animé de 0 → target (easing cubique) pour les
// chiffres clés de la page d'accueil.
// ============================================================
import { useEffect, useState } from 'react'

export default function useCountUp(target, start, duration = 1800) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!start) return
    let raf
    const t0 = performance.now()
    const tick = (now) => {
      const p = Math.min((now - t0) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3) // easeOutCubic
      setValue(Math.round(target * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [start, target, duration])

  return value
}
