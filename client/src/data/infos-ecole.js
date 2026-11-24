// ============================================================
// src/data/infos-ecole.js — Informations officielles transmises
// par l'établissement (texte strict, aucun chiffre inventé).
// ============================================================

/* ---------- Partie 1 — Présentation / Notre école ---------- */
export const ecole = {
  nom: 'Groupe Scolaire Madeleine-Daniélou (GSMD)',
  nature: "Établissement privé pour filles, affilié à la Communauté Saint-François-Xavier, d'inspiration chrétienne ouvert à toutes",
  cycles: ['Maternelle', 'Primaire', 'Collège', 'Lycée'],
  origines: [
    "Fondé par Madeleine Daniélou (Communauté Saint-François-Xavier, 1910)",
    'Arrivée en Côte d\'Ivoire en 1962 (Lycée Sainte-Marie, Cocody)',
    'Inauguration du GSMD en septembre 2020 à Bingerville Agbassi',
  ],
  philosophie: 'Formation intégrale de la personne, avec un accent sur les sciences, le numérique, l’écologie et la culture',
  horaires: { matin: '7h30 – 12h25', apresMidi: '13h55 – 16h40' },
  uniforme: 'Chemisier blanc + jupe paysanne mi-mollet, chaussures ballerines noires ou bleu nuit',
}

/* ---------- Partie 1 — Inscriptions ---------- */
export const inscriptionsInfo = {
  fraisPreinscription: [
    { cycle: 'Maternelle / Primaire', montant: '40 000 F CFA' },
    { cycle: 'Collège / Lycée', montant: '65 000 F CFA' },
  ],
  fraisScolarite: [
    { cycle: 'Maternelle', montant: '620 000 F CFA' },
    { cycle: 'Primaire', montant: '600 000 F CFA' },
    { cycle: 'Collège', montant: '750 000 F CFA' },
    { cycle: 'Lycée', montant: '850 000 F CFA' },
  ],
  paiement: 'Paiement en 4 fois',
  compteBancaire: {
    banque: 'NSIA',
    titulaire: 'AGSMD',
    numero: 'CI042 01304 063894402001 28',
  },
  processus: [
    'Formulaire en ligne',
    'Invitation à un entretien',
    'Apporter le dossier papier',
    'Test selon le niveau',
    'Confirmation après résultats',
  ],
}

/* ---------- Partie 1 — Actualités (Vie du GSMD) ---------- */
export const actualitesInfo = [
  {
    date: '21 mai 2026',
    titre: 'Hommage aux anciens combattants',
    description: '115 élèves, œuvre d’art en matériaux recyclés',
  },
  {
    date: '14 novembre 2025',
    titre: 'Campus France — information sur l’orientation',
    description: 'Secondes, Premières, Terminales',
  },
  {
    date: '22 septembre 2025',
    titre: 'Cérémonie des couleurs de la rentrée',
    description: 'En présence de Jean-Marc Yacé (maire de Cocody)',
  },
  {
    date: '16 septembre 2025',
    titre: 'Don de latrines à l’EPP Djorogobité 2',
    description: '',
  },
]

/* ---------- Partie 1 — Coordonnées ---------- */
export const coordonnees = {
  telephones: ['(+225) 27 22 24 65 01', '05 85 69 23 31'],
  email: 'groupescolaire@madeleinedanielou.ci',
  site: 'madeleinedanielou.ci',
  adresse: 'Bingerville Agbassi, près de la Cité SIR',
}

/* ⚠️ CONTRADICTION À SIGNALER À L'UTILISATEUR (texte existant dans le site) :
   - Le brief Instruction dit « Bingerville Agbassi, près de la Cité SIR ».
   - Le code existant (src/data/content.js, contact) mentionne aussi Cocody
     (lycée Sainte-Marie, Cocody — 1962) et l'histoire situe l'établissement
     « Ancré à Cocody » (HeroSlider / anciennes versions).
   - La carte Google Maps /contact utilise la géolocalisation
     « Groupe Scolaire Madeleine Daniélou Bingerville Côte d'Ivoire ».
   → Nous conservons la mention du brief (Bingerville Agbassi) et signalons
     la divergence Cocody sans choisir arbitrairement. */
export const contradictions = [
  {
    sujet: 'Localisation du campus',
    message:
      "Brief : « Bingerville Agbassi, près de la Cité SIR ». Anciens textes du site : « Ancré à Cocody » et « Lycée Sainte-Marie, Cocody » (1962, histoire). À valider par l'établissement.",
  },
]
