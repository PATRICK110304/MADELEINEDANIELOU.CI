// ============================================================
// server/src/services/storage.js — abstraction de stockage
//
// • Sans CLOUDINARY_URL : fichiers écrits sous server/public/
//   (développement, mêmes URLs qu'avant).
// • Avec CLOUDINARY_URL : envoi du buffer traité à Cloudinary et
//   stockage de l'URL HTTPS complète dans la base.
//
// Les photos sont converties en WebP par sharp AVANT l'envoi :
// on garde la correction EXIF et le redimensionnement intelligent.
// ============================================================
import fs from 'node:fs'
import path from 'node:path'
import { v2 as cloudinary } from 'cloudinary'
import { config } from '../config.js'

export const cloudEnabled = Boolean(process.env.CLOUDINARY_URL)
if (cloudEnabled) cloudinary.config({ secure: true }) // CLOUDINARY_URL est parsé par le SDK

const FOLDERS = {
  documents: { dir: config.documentsDir, prefix: '/documents/' },
  audios: { dir: config.audiosDir, prefix: '/audios/' },
  photos: { dir: path.join(config.publicDir, 'photos'), prefix: '/media/photos/' },
}

/**
 * Enregistre un buffer et retourne { url, size }.
 * @param {Buffer} buffer
 * @param {'documents'|'audios'|'photos'} folder
 * @param {string} filename nom de fichier sûr, déjà généré
 * @param {'image'|'video'|'raw'|'auto'} resourceType
 */
export async function saveFile({ buffer, folder, filename, resourceType = 'auto' }) {
  const spec = FOLDERS[folder]
  if (!spec) throw new Error(`Dossier de stockage inconnu : ${folder}`)

  if (cloudEnabled) {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: `gsmd/${folder}`,
          public_id: path.parse(filename).name,
          resource_type: resourceType,
          overwrite: false,
        },
        (err, res) => (err ? reject(err) : resolve(res)),
      )
      stream.end(buffer)
    })
    return { url: result.secure_url, size: result.bytes ?? buffer.length }
  }

  fs.mkdirSync(spec.dir, { recursive: true })
  const target = path.join(spec.dir, path.basename(filename))
  fs.writeFileSync(target, buffer)
  return { url: `${spec.prefix}${path.basename(filename)}`, size: buffer.length }
}

/** Supprime le fichier distant ou local référencé par une URL. */
export async function deleteFile(url) {
  if (!url) return

  if (cloudEnabled) {
    try {
      const parts = new URL(url).pathname.split('/')
      const idx = parts.indexOf('upload')
      if (idx < 0) return
      const resourceType = parts[idx - 1] || 'image'
      const publicId = parts.slice(idx + 1).join('/')
        .replace(/^v\d+\//, '')
        .replace(/\.[^/.]+$/, '')
      if (publicId) await cloudinary.uploader.destroy(publicId, { resource_type: resourceType })
    } catch (err) {
      console.warn('⚠ Suppression Cloudinary impossible :', err.message)
    }
    return
  }

  for (const spec of Object.values(FOLDERS)) {
    if (url.startsWith(spec.prefix)) {
      const target = path.join(spec.dir, path.basename(url))
      if (fs.existsSync(target)) fs.unlinkSync(target)
      return
    }
  }
}

export const storageMode = cloudEnabled ? 'cloudinary' : 'local'
