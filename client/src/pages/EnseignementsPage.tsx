// ============================================================
// client/src/pages/EnseignementsPage.jsx — Enseignements
// Cycles préscolaire/primaire + onglets dédiés Collège/Lycée.
// ============================================================
import Enseignements from '../components/Enseignements'
import SecondaireTabs from '../components/SecondaireTabs'

export default function EnseignementsPage() {
  return (
    <>
      <Enseignements />
      <SecondaireTabs />
    </>
  )
}
