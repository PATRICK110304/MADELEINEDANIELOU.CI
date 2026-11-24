// Accès aux photos (API JSON) — types alignés sur db.json collection photos
export interface Photo {
  id: string
  section: string
  title: string
  description: string
  url: string
  size: number
  orientation: 'landscape' | 'portrait' | 'square'
  width: number
  height: number
  featured: boolean
  uploadedAt: string
}

const API = import.meta.env.VITE_API_URL ?? ''

export async function getPhotos(section = 'all'): Promise<Photo[]> {
  const r = await fetch(`${API}/api/photos?section=${encodeURIComponent(section)}`)
  const d = await r.json()
  return d.items || []
}

/* Mêmes règles sémantiques que le serveur (suggestSection) */
export function suggestSection(name: string): string {
  const n = name.toLowerCase()
  if (/couleur|ceremon|rentree|salut|drapeau/.test(n)) return 'ceremonies'
  if (/club|coree|coreen|seoul|asia|japon|culture/.test(n)) return 'culture'
  if (/sport|match|jeu|terrain|car/.test(n)) return 'sport'
  if (/classe|salle|eleve|prof|labo|cantine|bibliotheque/.test(n)) return 'vie-scolaire'
  return 'vie-scolaire'
}
