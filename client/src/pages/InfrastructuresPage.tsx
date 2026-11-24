import { Link } from 'react-router-dom'
import SectionHeader from '../components/SectionHeader'
import Reveal from '../components/Reveal'
import { galerieEvents } from '../data/galerie'
import PhotoCard from '../components/PhotoCard'

export default function InfrastructuresPage() {
  return (
    <div className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeader as="h1" eyebrow="L'école" title="Nos infrastructures" subtitle="Le campus de Bingerville Agbassi en images — salles, espaces et vie quotidienne." />
        </Reveal>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {galerieEvents.map((e) => (
            <Reveal key={e.slug}>
              <PhotoCard image={e.vignettes[0] || ''} title={e.title || e.slug} label={e.date || undefined} href={`/galerie/${e.slug}`} className="h-64" />
            </Reveal>
          ))}
        </div>
        <div className="mt-10">
          <Link to="/galerie" className="inline-flex min-h-[48px] items-center rounded-full bg-navy-500 px-7 font-semibold text-white hover:bg-navy-600">Voir toutes les galeries</Link>
        </div>
      </div>
    </div>
  )
}
