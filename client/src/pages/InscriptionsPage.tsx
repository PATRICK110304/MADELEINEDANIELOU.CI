// ============================================================
// client/src/pages/InscriptionsPage.jsx — Inscriptions
// (documents + formulaires de pré-inscription)
// ============================================================
import Inscriptions from '../components/Inscriptions'
import PreRegistration from '../components/PreRegistration'
import FraisScolarite from '../components/FraisScolarite'

export default function InscriptionsPage() {
  return (
    <>
      <Inscriptions />
      <FraisScolarite />
      <PreRegistration />
    </>
  )
}
