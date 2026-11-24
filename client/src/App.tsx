// ============================================================
// client/src/App.jsx
// SITE MULTI-PAGES (React Router) — contenus réels du site
// officiel madeleinedanielou.ci réorganisés en pages :
//   / (accueil) · /qui-sommes-nous · /enseignements ·
//   /projet-educatif · /guides-parents · /inscriptions ·
//   /infos (vie scolaire) · /actualites · /ceremonie ·
//   /radio · /partenaires · /contact
// ============================================================
import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

// ----- Pages -----
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import EcolePage from './pages/EcolePage'
import EquipePage from './pages/EquipePage'
import InfrastructuresPage from './pages/InfrastructuresPage'
import EnseignementsPage from './pages/EnseignementsPage'
import ProjectPage from './pages/ProjectPage'
import GuidesPage from './pages/GuidesPage'
import InscriptionsPage from './pages/InscriptionsPage'
import InfosPage from './pages/InfosPage'
import ActualitesPage from './pages/ActualitesPage'
import CeremoniePage from './pages/CeremoniePage'
import RadioPage from './pages/RadioPage'
import ResultatsPage from './pages/ResultatsPage'
import GalleryPage from './pages/GalleryPage'
import GalerieEventPage from './pages/GalerieEventPage'
import PartenairesPage from './pages/PartenairesPage'
import ContactPage from './pages/ContactPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import PhotosPage from './pages/PhotosPage'

/* Défilement : haut de page à chaque navigation,
   ou ancre (#section) quand le lien en comporte une */
function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      // Attendre le rendu de la page avant de chercher l'ancre
      const t = setTimeout(() => {
        document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' })
      }, 120)
      return () => clearTimeout(t)
    }
    window.scrollTo({ top: 0 })
  }, [pathname, hash])
  return null
}

export default function App() {
  const { pathname } = useLocation()
  /* L'espace d'administration est autonome : ni header public, ni footer public. */
  const isAdmin = pathname.startsWith('/admin')
  return (
    <div className="flex min-h-screen flex-col">
      {!isAdmin && <Navbar />}
      <ScrollManager />

      <main className={`flex-1 ${isAdmin ? '' : 'pt-[104px]'}`}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/qui-sommes-nous" element={<AboutPage />} />
          <Route path="/notre-ecole" element={<EcolePage />} />
          <Route path="/equipe" element={<EquipePage />} />
          <Route path="/infrastructures" element={<InfrastructuresPage />} />
          <Route path="/enseignements" element={<EnseignementsPage />} />
          <Route path="/projet-educatif" element={<ProjectPage />} />
          <Route path="/guides-parents" element={<GuidesPage />} />
          <Route path="/inscriptions" element={<InscriptionsPage />} />
          <Route path="/infos" element={<InfosPage />} />
          <Route path="/actualites" element={<ActualitesPage />} />
          <Route path="/ceremonie" element={<CeremoniePage />} />
          <Route path="/resultats" element={<ResultatsPage />} />
          <Route path="/galerie" element={<GalleryPage />} />
          <Route path="/galerie/:slug" element={<GalerieEventPage />} />
          <Route path="/photos" element={<PhotosPage />} />
          <Route path="/galerie/vie-scolaire-2026" element={<Navigate to="/galerie/club-coreen" replace />} />
          <Route path="/radio" element={<RadioPage />} />
          <Route path="/partenaires" element={<PartenairesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          {/* Page inconnue → accueil */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>

      {/* Pied de page — coordonnées, pages utiles, réseaux (#contact) */}
      {!isAdmin && <Footer />}
    </div>
  )
}
