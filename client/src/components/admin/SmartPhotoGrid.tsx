// Composant photos intelligent — grille responsive et masonry légère
import type { Photo } from '../../services/photos'

export default function SmartPhotoGrid({ items, section = 'all' }: { items: Photo[]; section?: string }) {
  const list = section === 'all' ? items : items.filter((p) => p.section === section)
  if (list.length === 0) return <p className="rounded-2xl bg-mist p-8 text-center text-ink/90">Aucune photo dans cette galerie pour le moment.</p>
  return (
    <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4 [&>*]:mb-4">
      {list.map((p) => (
        <figure key={p.id} className="break-inside-avoid overflow-hidden rounded-2xl bg-white shadow-sm shadow-ink/5 ring-1 ring-navy-100">
          <img src={p.url} alt={p.title || 'Photo du GSMD'} loading="lazy" decoding="async" width={p.width} height={p.height} className="w-full object-cover" />
          {(p.title || p.description) && (
            <figcaption className="p-4">
              {p.title && <p className="text-sm font-semibold text-ink">{p.title}</p>}
              {p.description && <p className="mt-1 text-xs text-ink/90">{p.description}</p>}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  )
}
