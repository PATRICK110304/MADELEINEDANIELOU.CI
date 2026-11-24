// ============================================================
// server/src/seed.js — amorçage de la base de données :
//  • compte administrateur (bcrypt, identifiants du .env)
//  • fiches PDF par défaut (server/public/documents/)
//  • épisodes radio par défaut (server/public/audios/)
// Exécuté automatiquement au démarrage si la base est vide ;
// peut aussi être lancé manuellement : npm --workspace server run seed
// ============================================================
import crypto from 'node:crypto'
import bcrypt from 'bcryptjs'
import { config } from './config.js'
import { getDb, saveDb } from './db.js'

const documentsSeed = [
  { section: 'college', title: 'Fiche de pré-inscription — Collège (6ème → 3ème)', url: '/documents/fiche-preinscription-college.pdf' },
  { section: 'lycee', title: 'Fiche de pré-inscription — Lycée (2nde → Terminale)', url: '/documents/fiche-preinscription-lycee.pdf' },
  { section: 'commun', title: 'Règlement intérieur', url: '/documents/reglement-interieur.pdf' },
  { section: 'commun', title: 'Calendrier scolaire 2026 – 2027', url: '/documents/calendrier-scolaire-2026-2027.pdf' },
  { section: 'commun', title: 'Projet pédagogique de l’établissement', url: '/documents/projet-etablissement.pdf' },
]

const podcastsSeed = [
  { title: 'Le mot du Directeur', description: 'Rentrée 2026 : cap sur l’excellence et nos grands chantiers.', duration: '4:32', url: '/audios/episode-01-mot-du-directeur.wav' },
  { title: 'Spéciale Journée Portes Ouvertes', description: 'Reportage réalisé par les élèves du club presse.', duration: '6:08', url: '/audios/episode-02-journee-portes-ouvertes.wav' },
  { title: 'La rentrée expliquée aux parents', description: 'Conseils pratiques : matériel, emplois du temps, suivi.', duration: '5:17', url: '/audios/episode-03-rentree-2026.wav' },
  { title: 'Vie scolaire & clubs', description: 'Robotique, théâtre, débat : les élèves racontent leurs clubs.', duration: '7:45', url: '/audios/episode-04-vie-scolaire-et-clubs.wav' },
]

export function seed() {
  const db = getDb()

  /* Compte administrateur (uniquement s'il n'existe pas) */
  if (!db.users.length) {
    db.users.push({
      id: crypto.randomUUID(),
      email: config.admin.email.toLowerCase(),
      passwordHash: bcrypt.hashSync(config.admin.password, 12), // cost factor 12
      createdAt: new Date().toISOString(),
    })
    console.log(`✔ Admin créé : ${config.admin.email}`)
  }

  /* Fiches PDF par défaut */
  if (!db.documents.length) {
    db.documents = documentsSeed.map((d) => ({
      id: crypto.randomUUID(),
      ...d,
      size: 0,
      uploadedAt: new Date().toISOString(),
    }))
    console.log(`✔ ${db.documents.length} fiches PDF seedées`)
  }

  /* Épisodes radio par défaut */
  if (!db.podcasts.length) {
    db.podcasts = podcastsSeed.map((p) => ({
      id: crypto.randomUUID(),
      ...p,
      size: 0,
      uploadedAt: new Date().toISOString(),
    }))
    console.log(`✔ ${db.podcasts.length} épisodes radio seedés`)
  }

  saveDb()
}

/* Exécution directe : npm --workspace server run seed */
const isDirectRun = process.argv[1]?.includes('seed')
if (isDirectRun) {
  seed()
  console.log('✔ Amorçage terminé.')
}
