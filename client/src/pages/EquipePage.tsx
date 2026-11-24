import SectionHeader from '../components/SectionHeader'
import Reveal from '../components/Reveal'
import MotDirection from '../components/MotDirection'

export default function EquipePage() {
  return (
    <div className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeader eyebrow="L'école" title="Notre équipe" subtitle="L'équipe du Groupe Scolaire Madeleine-Daniélou, Abidjan." />
        </Reveal>
      </div>
      <MotDirection />
    </div>
  )
}
