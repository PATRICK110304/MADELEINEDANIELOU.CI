// ============================================================
// tools/generate-placeholders.mjs
// Génère les fichiers d'assets de DÉMONSTRATION :
//   • 5 fiches PDF valides (minimaux, titrés) → /documents/
//   • 4 épisodes audio WAV (tonalité d'attente) → /audios/
// Ils sont écrits dans client/public/ (site statique) ET
// server/public/ (API). L'équipe administrative les remplacera
// via l'API CRUD sécurisée (upload PDF/MP3).
// Usage : npm run placeholders
// ============================================================
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const CLIENT = path.join(ROOT, 'client', 'public')
const SERVER = path.join(ROOT, 'server', 'public')

/* ------------------------------------------------------------
 * PARTIE 1 — Génération de PDF minimaux et valides (sans dépendance)
 * ------------------------------------------------------------ */
function makePdf(title, subtitle) {
  // Corps de page : deux lignes de texte centrées à la main
  const text = (y, size, txt) =>
    `BT /F1 ${size} Tf 60 ${y} Td (${txt}) Tj ET`

  const stream = [
    text(720, 18, title),
    text(690, 12, subtitle),
    text(650, 10, 'Document de demonstration - College Madeleine Danielou - Abidjan'),
    text(632, 10, 'Remplacez ce fichier via l espace d administration.'),
  ].join('\n')

  const objects = []
  objects[1] = '<< /Type /Catalog /Pages 2 0 R >>'
  objects[2] = '<< /Type /Pages /Kids [3 0 R] /Count 1 >>'
  objects[3] = '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>'
  objects[4] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>'
  objects[5] = `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`

  // Assemblage avec offsets xref exacts (PDF valide)
  let out = '%PDF-1.4\n'
  const offsets = []
  for (let i = 1; i < objects.length; i++) {
    offsets[i] = out.length
    out += `${i} 0 obj\n${objects[i]}\nendobj\n`
  }
  const xrefPos = out.length
  out += `xref\n0 ${objects.length}\n0000000000 65535 f \n`
  for (let i = 1; i < objects.length; i++) {
    out += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`
  }
  out += `trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF`
  return Buffer.from(out, 'latin1')
}

const documents = [
  ['fiche-preinscription-college.pdf', 'Fiche de pre-inscription - College (6eme a 3eme)', 'Anne academique 2026-2027'],
  ['fiche-preinscription-lycee.pdf', 'Fiche de pre-inscription - Lycee (2nde a Terminale)', 'Anne academique 2026-2027'],
  ['reglement-interieur.pdf', 'Reglement interieur', 'College Madeleine Danielou'],
  ['calendrier-scolaire-2026-2027.pdf', 'Calendrier scolaire 2026-2027', 'Vacances, examens, evenements'],
  ['projet-etablissement.pdf', 'Projet pedagogique', 'Excellence, discipline, reussite'],
]

for (const [file, title, sub] of documents) {
  const pdf = makePdf(title, sub)
  for (const base of [CLIENT, SERVER]) {
    fs.mkdirSync(path.join(base, 'documents'), { recursive: true })
    fs.writeFileSync(path.join(base, 'documents', file), pdf)
  }
}

/* ------------------------------------------------------------
 * PARTIE 2 — Épisodes audio WAV (tonalité d'attente 8 s)
 * WAV PCM 8 kHz mono, 8 bits : format natif, lu par tout
 * navigateur. À remplacer par de vrais MP3 via l'API admin.
 * ------------------------------------------------------------ */
const SAMPLE_RATE = 8000
const SECONDS = 8

function makeWav() {
  const samples = SAMPLE_RATE * SECONDS
  const dataSize = samples
  const header = Buffer.alloc(44)
  header.write('RIFF', 0)
  header.writeUInt32LE(36 + dataSize, 4)
  header.write('WAVE', 8)
  header.write('fmt ', 12)
  header.writeUInt32LE(16, 16)       // taille du bloc fmt
  header.writeUInt16LE(1, 20)        // PCM
  header.writeUInt16LE(1, 22)        // mono
  header.writeUInt32LE(SAMPLE_RATE, 24)
  header.writeUInt32LE(SAMPLE_RATE, 28)
  header.writeUInt16LE(1, 32)        // block align
  header.writeUInt16LE(8, 34)        // 8 bits
  header.write('data', 36)
  header.writeUInt32LE(dataSize, 40)

  const data = Buffer.alloc(dataSize)
  for (let i = 0; i < samples; i++) {
    // Mélodie d'attente : Do-Mi-Sol montant, doux (sinus atténué)
    const freq = 262 + 100 * Math.floor((i / SAMPLE_RATE) % 3)
    const env = 0.5 * (1 - (i % SAMPLE_RATE) / SAMPLE_RATE)
    data[i] = 128 + Math.round(50 * env * Math.sin((2 * Math.PI * freq * i) / SAMPLE_RATE))
  }
  return Buffer.concat([header, data])
}

const audios = [
  'episode-01-mot-du-directeur.wav',
  'episode-02-journee-portes-ouvertes.wav',
  'episode-03-rentree-2026.wav',
  'episode-04-vie-scolaire-et-clubs.wav',
]

const wav = makeWav()
for (const file of audios) {
  for (const base of [CLIENT, SERVER]) {
    fs.mkdirSync(path.join(base, 'audios'), { recursive: true })
    fs.writeFileSync(path.join(base, 'audios', file), wav)
  }
}

console.log('✔ Placeholders générés :')
console.log('  • 5 PDF  → client/public/documents/ + server/public/documents/')
console.log('  • 4 WAV  → client/public/audios/ + server/public/audios/')
