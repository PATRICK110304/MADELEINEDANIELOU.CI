// ============================================================
// client/src/pages/HomePage.tsx — Page d'accueil
// Structure éditoriale :
//   1. Hero photos réelles (rotation auto)
//   2. Chiffres clés (carte verre encre)
//   3. L'institution (rédactionnel + photo 1923)
//   4. Deux portes d'entrée : École / Collège-Lycée
//   5. Actualités / Vie de l'établissement
//   6. Bande admissions
// ============================================================
import HeroSlider from '../components/HeroSlider'
import Stats from '../components/Stats'
import Institution from '../components/Institution'
import Cycles from '../components/Cycles'
import News from '../components/News'
import Partners from '../components/Partners'
import CtaBand from '../components/CtaBand'

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <Stats className="mt-12 pb-16" />
      <Institution />
      <Cycles />
      <Partners />
      <News />
      <CtaBand />
    </>
  )
}
