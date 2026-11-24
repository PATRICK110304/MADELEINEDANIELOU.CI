// client/src/pages/PhotosPage.tsx — galerie publique intelligente
import { useEffect, useState } from 'react'
import SectionHeader from '../components/SectionHeader'
import Reveal from '../components/Reveal'
import SmartPhotoGrid from '../components/admin/SmartPhotoGrid'
import { getPhotos, type Photo } from '../services/photos'

const SECTIONS = ['all', 'vie-scolaire', 'ceremonies', 'culture', 'sport'] as const

export default function PhotosPage() {
  const [items, setItems] = useState<Photo[]>([])
  const [section, setSection] = useState<string>('all')

  useEffect(() => { getPhotos(section).then(setItems).catch(() => setItems([])) }, [section])

  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeader eyebrow="Galerie" title="La vie du GSMD en photos" subtitle="Cérémonies, vie scolaire, culture et sport — photos optimisées et orientées automatiquement." />
        </Reveal>
        <div className="mb-8 flex flex-wrap gap-2" role="tablist" aria-label="Filtrer les photos">
          {SECTIONS.map((s) => (
            <button key={s} onClick={() => setSection(s)} aria-selected={section === s} className={`min-h-[44px] rounded-full px-5 text-sm font-semibold transition-colors ${section === s ? 'bg-navy-500 text-white' : 'bg-navy-50 text-navy-500 hover:bg-navy-100'}`}>
              {s === 'all' ? 'Toutes' : s.replace('-', ' ')}
            </button>
          ))}
        </div>
        <SmartPhotoGrid items={items} section="all" />
      </div>
    </section>
  )
}
