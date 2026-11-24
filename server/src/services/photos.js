// ============================================================
// server/src/services/photos.js — traitement intelligent des photos
// 1. Corrige l'orientation EXIF (téléphone 90°) via rotate()
// 2. Redimensionne sans JAMAIS agrandir : paysage max 1600px,
//    portrait max 1080px, carré max 1080px
// 3. Convertit en WebP qualité 80
// ============================================================
import sharp from 'sharp'
import crypto from 'node:crypto'

export const MAX_LANDSCAPE = 1600
export const MAX_PORTRAIT = 1080

/** Détermine la section sémantique d'après le nom de fichier */
export function suggestSection(originalname) {
  const n = originalname.toLowerCase()
  if (/couleur|ceremon|rentree|salut|drapeau/.test(n)) return 'ceremonies'
  if (/club|coree|coreen|seoul|asia|japon|culture/.test(n)) return 'culture'
  if (/sport|match|jeu|terrain|car/.test(n)) return 'sport'
  if (/classe|salle|eleve|prof|labo|cantine|bibliotheque/.test(n)) return 'vie-scolaire'
  return 'vie-scolaire'
}

/**
 * Traite un buffer uploadé et retourne { buffer, width, height, orientation, name }
 */
export async function processPhoto(buffer, originalname) {
  // rotate() applique l'EXIF puis le retire — fini les photos à 90°
  const base = sharp(buffer).rotate()
  const meta = await base.metadata()
  const sourceW = meta.width || 0
  const sourceH = meta.height || 0
  // après rotate() : le portrait EXIF devient 533x800, on classifie sur les dimensions finales
  const rotated = sharp(buffer).rotate()
  const rmeta = await rotated.metadata()
  const finalW = rmeta.width || sourceW
  const finalH = rmeta.height || sourceH
  const max = finalW > finalH ? MAX_LANDSCAPE : MAX_PORTRAIT
  // Sans agrandissement : on ne réduit que si la dimension max dépasse
  const scale = Math.min(1, max / Math.max(finalW, finalH))
  const width = Math.max(1, Math.round(finalW * scale))
  const height = Math.max(1, Math.round(finalH * scale))

  const processed = await rotated
    .resize(width, height, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer({ resolveWithObject: true })

  const w = processed.info.width
  const h = processed.info.height
  const orientation = w > h * 1.05 ? 'landscape' : h > w * 1.05 ? 'portrait' : 'square'
  const name = `${crypto.randomUUID()}.webp`
  return {
    buffer: processed.data,
    width: processed.info.width,
    height: processed.info.height,
    orientation,
    name,
  }
}
