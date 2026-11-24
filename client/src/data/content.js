// ============================================================
// client/src/data/content.js
// Contenu éditorial RÉEL du site officiel madeleinedanielou.ci
// réorganisé pour le nouveau site + DONNÉES DE REPLI (hors-ligne).
// Images : téléchargées depuis le site officiel → client/public/images/
// ============================================================

/* ---------- Identité de l'établissement ---------- */
export const identity = {
  name: 'Groupe Scolaire Madeleine-Daniélou',
  short: 'Madeleine-Daniélou',
  slogan: 'Quand une conscience rencontre une confiance…',
}

/* ---------- Coordonnées (page Contact du site officiel) ---------- */
export const contact = {
  adresse: '400 m du carrefour de la Cité SIR, quartier Agbassi de Bingerville — Abidjan',
  bp: '08 BP 525 ABIDJAN 08',
  telephone: '+225 27 22 24 65 01',
  telephoneMobile: '+225 05 85 69 23 31',
  email: 'groupescolaire@madeleinedanielou.ci',
  horaires: 'Année scolaire : 7h30 – 17h00 (pause déjeuner 12h45 – 13h45, établissement fermé)',
  geoloc: 'https://www.google.com/maps/search/?api=1&query=Cit%C3%A9+SIR+Bingerville+Groupe+Scolaire+Madeleine-Dani%C3%A9lou',
}

/* ---------- Réseaux sociaux (page Facebook officielle) ---------- */
export const social = [
  { name: 'Facebook', href: 'https://www.facebook.com/DanielouAbidjan', icon: 'facebook' },
]

/* ---------- Vidéo institutionnelle (widget Vimeo du site officiel) ---------- */
export const video = {
  provider: 'vimeo',
  id: '1194499892',
  hash: 'd650b2743d', // identifiant d'intégration officiel (code embed du site)
  title: 'Le Groupe Scolaire Madeleine-Daniélou en vidéo',
  description: 'Découvrez le campus, les équipes et la vie scolaire du GSMD.',
}

/* ---------- Diaporama classé PAR ÉVÉNEMENT ----------
   Classification reprise de leurs pages « Albums » du site
   officiel : chaque album correspond à un événement réel. */
export const gallery = {
  title: 'Le GSMD en images — par événement',
  subtitle: 'Comme dans leurs Albums officiels : chaque série de photos correspond à un événement de la vie du groupe scolaire.',
  events: [
    {
      name: 'Examens 2026',
      period: 'Juin – Juillet 2026',
      images: [
        { src: '/images/event-bac2026.webp', alt: 'Baccalauréat 2026' },
        { src: '/images/event-cepe2026.webp', alt: 'CEPE 2026' },
        { src: '/images/event-bepc2026.webp', alt: 'BEPC 2026' },
      ],
    },
    {
      name: 'Journée Daniélou 2025',
      period: '« Ensemble depuis 5 ans » — 172 prix offerts',
      images: [
        { src: '/images/event-journee-danielou.webp', alt: 'Lauréates de la Journée Daniélou 2025' },
        { src: '/images/event-fr1.webp', alt: 'Cérémonie de remise des prix' },
      ],
    },
    {
      name: 'Séminaire de rentrée — l’IA à l’école',
      period: 'Août 2026',
      images: [
        { src: '/images/news-ia-1_up1600.webp', alt: 'Formation des équipes à l’IA' },
        { src: '/images/news-ia-2.webp', alt: 'Atelier intelligence artificielle' },
        { src: '/images/capture-2025_up1600.webp', alt: 'Présentation du séminaire' },
      ],
    },
    {
      name: 'Culture coréenne',
      period: 'Octobre 2026',
      images: [
        { src: '/images/kor-rci.webp', alt: 'Affiche officielle — semaine de la culture coréenne' },
        { src: '/images/photo-16.webp', alt: 'Ateliers culture coréenne' },
        { src: '/images/photo-17.webp', alt: 'Ateliers culture coréenne' },
        { src: '/images/photo-36.webp', alt: 'Ateliers culture coréenne' },
        { src: '/images/news-coree-1.webp', alt: 'La langue et la culture coréennes au programme' },
        { src: '/images/news-coree-2.webp', alt: 'Club coréen du GSMD' },
      ],
    },
    {
      name: 'Cérémonie de rentrée',
      period: 'Septembre 2025',
      images: [
        { src: '/images/hero-ceremonie_up1600.webp', alt: 'Cérémonie aux couleurs — 6ème rentrée' },
        { src: '/images/slide-ed60.webp', alt: 'Cérémonie de rentrée' },
        { src: '/images/slide-a425.webp', alt: 'Cérémonie de rentrée' },
        { src: '/images/slide-img2469.webp', alt: 'Cérémonie du GSMD' },
      ],
    },
    {
      name: 'Séjour à Daniélou-Reuil',
      period: 'Mai 2026',
      images: [
        { src: '/images/reuil-2.webp', alt: 'Délégation à Daniélou-Reuil' },
        { src: '/images/news-reuil-1.webp', alt: 'Séjour pédagogique à Reuil-Malmaison' },
      ],
    },
    {
      name: 'Mémoire des anciens combattants',
      period: 'Mai 2026 — avec ADFE-CI',
      images: [{ src: '/images/news-combattants-1_up1600.webp', alt: 'Célébration de la mémoire des anciens combattants' }],
    },
    {
      name: 'Jubilé des éducateurs à Rome',
      period: 'Octobre – Novembre 2025',
      images: [{ src: '/images/news-jubile.webp', alt: 'Jubilé des éducateurs célébré à Rome' }],
    },
    {
      name: 'Action sociale — EPP Djorogobité 2',
      period: 'Septembre 2025',
      images: [{ src: '/images/news-memoire_up1600.webp', alt: 'Nouvelles latrines pour l’EPP Djorogobité 2' }],
    },
    {
      name: 'La semaine du goût',
      period: 'Album 2023 – 2024',
      images: [
        { src: '/images/slide-216f.webp', alt: 'La semaine du goût' },
        { src: '/images/slide-4848.webp', alt: 'La semaine du goût' },
        { src: '/images/slide-6381.webp', alt: 'La semaine du goût' },
      ],
    },
    {
      name: 'Lancement des clubs',
      period: 'Album 2023 – 2024',
      images: [
        { src: '/images/slide-218c.webp', alt: 'Lancement des clubs 2023-2024' },
        { src: '/images/slide-fd6e.webp', alt: 'Lancement des clubs 2023-2024' },
        { src: '/images/slide-c712.webp', alt: 'Lancement des clubs 2023-2024' },
      ],
    },
    {
      name: 'Visite à l’institut Goethe',
      period: 'Album 2023 – 2024',
      images: [
        { src: '/images/slide-0a20.webp', alt: 'Visite à l’institut Goethe' },
        { src: '/images/slide-83dc.webp', alt: 'Visite à l’institut Goethe' },
      ],
    },
    {
      name: 'Mardi gras — la CAN 2023',
      period: 'Album 2023 – 2024',
      images: [
        { src: '/images/event-mardi-gras-1.webp', alt: 'Mardi gras à Daniélou-Abidjan — la CAN 2023' },
        { src: '/images/event-mardi-gras-2.webp', alt: 'Mardi gras à Daniélou-Abidjan — la CAN 2023' },
      ],
    },
    {
      name: 'Visite des élèves de 1ère C à la SIR',
      period: 'Février 2024',
      images: [{ src: '/images/event-sir-1.webp', alt: 'Visite des élèves de Première C à la SIR' }],
    },
    {
      name: 'Noël au GSMD',
      period: 'Décembre 2025',
      images: [{ src: '/images/event-noel.webp', alt: 'Célébration de Noël au GSMD' }],
    },
    {
      name: 'Audience — Ambassadeur de Corée',
      period: 'Mars 2026',
      images: [{ src: '/images/news-ambassadeur_up1600.webp', alt: 'Audience avec S.E.M KIM Saeng, Ambassadeur de Corée' }],
    },
    {
      name: 'Vie scolaire & enseignements',
      period: 'Laboratoire, ESF, musée, lycée',
      images: [
        { src: '/images/photo-labo.webp', alt: 'Au labo de physique' },
        { src: '/images/photo-couture.webp', alt: 'Couture en ESF' },
        { src: '/images/photo-musee.webp', alt: 'Au musée du costume' },
        { src: '/images/photo-lycee.webp', alt: 'Vie du lycée' },
        { src: '/images/slide-m1.webp', alt: 'Vie du GSMD' },
        { src: '/images/slide-m2.webp', alt: 'Vie du GSMD' },
        { src: '/images/slide-m6.webp', alt: 'Vie du GSMD' },
        { src: '/images/slide-m4.webp', alt: 'Vie du GSMD' },
        { src: '/images/slide-m5.webp', alt: 'Vie du GSMD' },
        { src: '/images/slide-m6.webp', alt: 'Vie du GSMD' },
        { src: '/images/thumb-5.webp', alt: 'Vie du GSMD' },
        { src: '/images/thumb-9.webp', alt: 'Vie du GSMD' },
        { src: '/images/peinture-murale_up1600.webp', alt: 'Peinture murale du campus' },
        { src: '/images/peinture-jeunefille.webp', alt: 'Œuvre d’art du campus' },
        { src: '/images/photo-historique.webp', alt: 'Photo historique de l’établissement' },
        { src: '/images/histoire-anciens.webp', alt: 'Histoire des anciens' },
        { src: '/images/hero-2_up1600.webp', alt: 'Visuel du GSMD' },
      ],
    },
  ],
}

/* ---------- Pages utiles : routes internes (tout est intégré au site) ---------- */
export const pagesUtiles = [
  { label: 'Qui sommes-nous ?', href: '/qui-sommes-nous' },
  { label: 'Projet éducatif', href: '/projet-educatif' },
  { label: 'Enseignements', href: '/enseignements' },
  { label: 'Classes Maternelles', href: '/enseignements#maternelle' },
  { label: 'Classes Primaires', href: '/enseignements#primaire' },
  { label: 'Collège', href: '/enseignements#college' },
  { label: 'Lycée', href: '/enseignements#lycee' },
  { label: 'Guides parents', href: '/guides-parents' },
  { label: 'Réinscriptions – Inscriptions', href: '/inscriptions' },
  { label: 'Scolarité', href: '/infos#scolarite' },
  { label: 'Cantine', href: '/infos#cantine' },
  { label: 'Transports', href: '/infos#transports' },
  { label: 'Règlements intérieurs', href: '/infos#reglements' },
  { label: 'Fournitures', href: '/infos#fournitures' },
  { label: 'Menu de la cantine', href: '/infos#menu-cantine' },
  { label: 'Actualités', href: '/actualites' },
  { label: 'Résultats & réussites', href: '/resultats' },
  { label: 'Galerie photos', href: '/galerie' },
  { label: 'Vidéo', href: '/ceremonie#video' },
  { label: 'Web Radio', href: '/radio' },
  { label: 'Partenaires', href: '/partenaires' },
  { label: 'Politique de confidentialité', href: '/politique-confidentialite' },
  { label: 'Mentions légales', href: '/mentions-legales' },
]

/* ---------- Navigation : SITE MULTI-PAGES (routes internes) ---------- */
export const navLinks = [
  { label: 'Accueil', href: '/' },
  {
    label: "L'école",
    href: '/notre-ecole',
    children: [
      { label: 'À propos', href: '/notre-ecole' },
      { label: 'Notre projet éducatif', href: '/projet-educatif' },
      { label: 'Équipe', href: '/equipe' },
      { label: 'Infrastructures', href: '/infrastructures' },
    ],
  },
  {
    label: 'Enseignements',
    href: '/enseignements',
    children: [
      { label: 'Maternelle', href: '/enseignements#maternelle' },
      { label: 'Primaire', href: '/enseignements#primaire' },
      { label: 'Collège', href: '/enseignements#college' },
      { label: 'Lycée', href: '/enseignements#lycee' },
    ],
  },
  {
    label: 'Inscriptions',
    href: '/inscriptions',
    children: [
      { label: 'Pré-inscription', href: '/inscriptions#preinscription' },
      { label: 'Frais de scolarité', href: '/inscriptions#frais' },
      { label: 'Processus', href: '/inscriptions#processus' },
    ],
  },
  {
    label: 'Vie du GSMD',
    href: '/actualites',
    children: [
      { label: 'Actualités', href: '/actualites' },
      { label: 'Galerie', href: '/galerie' },
      { label: 'Photos', href: '/photos' },
      { label: 'Événements', href: '/galerie' },
    ],
  },
  { label: 'Contact', href: '/contact' },
]

/* ---------- Qui sommes-nous ? (texte officiel, page dédiée) ---------- */
export const about = {
  title: 'Un établissement de filles',
  accent: "d'inspiration chrétienne ouvert à toutes",
  text: 'En 1907, Madeleine Daniélou, l’une des premières agrégées de lettres en France, ouvre une École Normale Libre à Paris pour préparer des enseignantes catholiques. Elle propose à certaines de ses collaboratrices de former une communauté apostolique consacrée au service de l’éducation des jeunes : la Communauté apostolique Saint-François-Xavier.',
  timeline: [
    { year: '1907', text: 'Madeleine Daniélou ouvre une École Normale Libre à Paris pour préparer des enseignantes catholiques.' },
    { year: '1913', text: 'Ouverture du 1er Collège Sainte-Marie à Neuilly (France) et fondation de la Communauté Saint-François-Xavier.' },
    { year: '1962', text: 'La Communauté est présente en Côte d’Ivoire, au Collège Sainte-Marie d’Adjamé (220 Logements).' },
    { year: '1967', text: 'Installation au Lycée Sainte-Marie de Cocody, cœur historique de Daniélou-Éducation en Côte d’Ivoire.' },
    { year: '2020', text: 'Ouverture du Groupe Scolaire Madeleine-Daniélou de Bingerville : maternelle, primaire, collège et lycée.' },
  ],
  photo: '/images/madeleine-1923_up1600.webp',
  photoCaption: 'Madeleine Daniélou en 1923',
  reseau: 'La Communauté Saint-François-Xavier est également présente en Corée du Sud, en Italie et en France.',
}

/* ---------- Projet éducatif (texte officiel intégral) ---------- */
export const projetEducatif = {
  intro: 'L’éducation et la pédagogie du Groupe Scolaire Madeleine-Daniélou s’inspirent de la tradition des Centres Madeleine-Daniélou : favoriser une formation globale de la personne, sans séparer l’intelligence du cœur ou de l’âme, de celle de l’esprit.',
  engagements: [
    { title: 'Une éducation personnelle', text: 'Reconnaît les dons et les talents de chacune et développe l’autonomie de la pensée et du jugement.' },
    { title: 'Une éducation à la liberté', text: 'Fondée sur la confiance, donne un cadre et des repères et cherche à éveiller la conscience.' },
    { title: 'Une éducation exigeante', text: 'Stimule la recherche de la qualité.' },
    { title: 'Une éducation ouverte', text: 'Généreuse, développe le sens de l’engagement et du service.' },
  ],
  division: {
    title: 'Une spécificité : les Responsables de Division',
    text: 'À chaque niveau de classe du Secondaire, une Responsable de Division, aidée par une Adjointe, est le pivot de la relation enfant/adulte ; elle assure auprès de chaque élève un accompagnement personnalisé prenant en compte toutes les dimensions de son être : travail, psychologie, orientation, vie spirituelle, ouverture culturelle, sens du service. Elle travaille en étroite collaboration avec la directrice.',
  },
  avis: {
    title: 'Les Avis, temps forts de cette éducation',
    text: 'Par classe et par Division, la responsable de division anime « les Avis » : un lieu de réflexion, d’échanges et de débats qui créent un esprit commun et sont une pierre d’angle de « l’éducation selon l’esprit ».',
  },
  conclusion: 'C’est ce que nous appelons une « éducation selon l’esprit ». Tous les professeurs sont appelés à y contribuer.',
}

/* ---------- Enseignements (texte officiel intégral + pages Classes) ---------- */
export const enseignements = {
  cycles: [
    {
      id: 'maternelle',
      label: 'Classes Maternelles',
      responsable: 'Mme Hortense Koutouan',
      classes: ['Très Petite section', 'Petite Section', 'Moyenne Section', 'Grande Section'],
      image: '/images/maternelle-1.webp',
      image2: '/images/maternelle-2.webp',
      note: 'Visites à l’infirmerie, éveil et socialisation en douceur.',
    },
    {
      id: 'primaire',
      label: 'Classes Primaires',
      responsable: 'Monsieur Zadi',
      classes: ['CP 1 · CP 2', 'CE 1 · CE 2', 'CM 1 · CM 2'],
      image: '/images/primaire.webp',
      note: 'Effectif maximum : 30 élèves par classe.',
    },
    {
      id: 'college',
      label: 'Collège',
      responsable: 'Mme Katty MAMBO (Secondaire)',
      classes: ['6ème', '5ème', '4ème', '3ème'],
      image: '/images/photo-labo.webp',
      note: 'Allemand, Espagnol dès la 5ème · Portugais dès la 6ème · Options dès la 4ème.',
    },
    {
      id: 'lycee',
      label: 'Lycée',
      responsable: 'Mme Katty MAMBO (Secondaire)',
      classes: ['2nde A · 2nde C', '1ère A · C · D', 'Tle A1 · A2 · C · D'],
      image: '/images/photo-lycee.webp',
      note: 'Latin au Lycée · cours de méthodologie en Seconde · effectif maximum : 35 élèves.',
    },
  ],
  niveaux: [
    'À la bibliothèque-CDI, initiation à la recherche documentaire',
    'Initiation à la maîtrise des Technologies de l’Information et de la Communication (TIC)',
    'Temps de travail personnel',
    'Formation humaine',
    'Enseignement religieux',
  ],
  orientations: [
    'La réflexion personnelle et l’autonomie de la pensée',
    'L’esprit d’initiative',
    'Le sens de la vérité',
    'La rigueur et le goût du travail bien fait',
    'L’esprit collaboratif',
    'Des projets interdisciplinaires',
  ],
  langues: [
    { label: 'Anglais', detail: 'à partir du CE 1' },
    { label: 'Allemand', detail: 'à partir de la 5ème' },
    { label: 'Espagnol', detail: 'à partir de la 5ème' },
    { label: 'Portugais', detail: 'à partir de la 6ème' },
    { label: 'Latin', detail: 'à partir du Lycée' },
  ],
  options: ['Environnement et initiation aux techniques agricoles', 'Économie Sociale et Familiale'],
  methode: 'En Seconde, cours de méthodologie de travail personnel.',
  secondaire: {
    directrice: 'Mme Katty MAMBO',
    effectif: '35 élèves maximum par classe',
    college: ['6ème', '5ème', '4ème', '3ème'],
    lycee: ['2nde A · 2nde C', '1ère A · 1ère C · 1ère D', 'Tle A1 · Tle A2 · Tle C · Tle D'],
  },
  photos: [
    { src: '/images/photo-labo.webp', alt: 'Au labo de physique' },
    { src: '/images/photo-couture.webp', alt: 'Couture en ESF' },
    { src: '/images/photo-musee.webp', alt: 'Au musée du costume' },
    { src: '/images/photo-lycee.webp', alt: 'Vie du lycée' },
  ],
}

/* ---------- Vie scolaire & informations pratiques (pages officielles) ---------- */
export const infosPratiques = {
  /* Page « Scolarité » — grille tarifaire officielle 2026-2027 */
  scolarite: {
    preinscription: [
      { cycle: 'Préscolaire', montant: '40 000 F CFA' },
      { cycle: 'Primaire', montant: '40 000 F CFA' },
      { cycle: 'Collège', montant: '65 000 F CFA' },
      { cycle: 'Lycée', montant: '65 000 F CFA' },
    ],
    note: 'La pré-inscription concerne uniquement les nouvelles élèves.',
    versements: [
      { date: 'Ré-inscription — au plus tard le 05 juin 2026 (1er versement)', prescolaire: '220 000', primaire: '200 000', college: '250 000', lycee: '300 000' },
      { date: 'Au plus tard le 30 septembre (2ème versement)', prescolaire: '200 000', primaire: '200 000', college: '200 000', lycee: '250 000' },
      { date: 'Au plus tard le 30 novembre (3ème versement)', prescolaire: '100 000', primaire: '100 000', college: '150 000', lycee: '150 000' },
      { date: 'Au plus tard le 30 janvier (4ème versement)', prescolaire: '100 000', primaire: '100 000', college: '150 000', lycee: '150 000' },
    ],
    totaux: { prescolaire: '620 000', primaire: '600 000', college: '750 000', lycee: '850 000' },
    paiement: 'Les versements se font au profit du compte AGSMD à la NSIA : CI042 01304 063894402001 28',
  },
  /* Page « Cantine » */
  cantine: {
    tarif: '345 000 F / an',
    texte: 'Un service de restauration scolaire est prévu, avec un engagement à l’année. Seules les enfants dont les parents se seront acquittés de l’intégralité de ces frais auront accès à la cantine.',
    paiement: 'Le paiement doit être réalisé avant la rentrée, par chèque au nom de AGSMD ou versé sur le compte AFG Bank : CI260 01201 013300000001 92',
    image: '/images/cantine.webp',
  },
  /* Page « Transports » */
  transports: {
    tarif: '360 000 F CFA / an',
    texte: 'Un service de cars est prévu, dans la limite des places disponibles, avec un engagement à l’année. Seules les enfants dont les parents se seront acquittés de l’intégralité de ces frais auront accès aux cars.',
    detail: 'Le service des cars est en place depuis le lundi 02 septembre 2024.',
    paiement: 'Paiement avant la rentrée, par chèque au nom de AGSMD ou sur le compte AFG Bank : CI260 01201 013300000001 92',
    images: ['/images/car-1.webp', '/images/car-2.webp'],
  },
  /* Page « Fournitures » */
  fournitures: {
    texte: 'Les listes des manuels et des fournitures sont disponibles à la permanence, de 8 h 00 à 14 h 00, du lundi au vendredi.',
    bonus: 'La librairie Carrefour accorde une réduction sur les kits scolaires correspondant aux listes de fournitures de Daniélou.',
    image: '/images/fournitures-carrefour.webp',
  },
  /* Page « Menu Cantine » */
  menuSemaine: {
    periode: 'Semaine du 02 au 06 novembre 2026',
    image: '/images/cantine.webp',
  },
  /* Page « Règlements intérieurs » — PDF officiels 2026-2027 */
  reglements: [
    { title: 'Règlement intérieur — Cycle préscolaire', file: '/documents/reglement-prescolaire-2026-2027.pdf' },
    { title: 'Règlement intérieur — Cycle primaire', file: '/documents/reglement-primaire-2026-2027.pdf' },
    { title: 'Règlement intérieur — Cycle secondaire', file: '/documents/reglement-secondaire-2026-2027.pdf' },
  ],
  /* Page « Réinscriptions-Inscriptions » */
  reinscriptions: 'La finalisation des inscriptions et réinscriptions avec les Divisions se fera selon le planning établi par l’établissement. Renseignez-vous auprès du secrétariat.',
}

/* ---------- Guides parents officiels (PDF 2026 – 2027) ---------- */
export const guidesParents = [
  { title: 'Guide parent du préscolaire', file: '/documents/guide-parent-prescolaire-2026-2027.pdf', cycle: 'Maternelle' },
  { title: 'Guide parent du primaire', file: '/documents/guide-parent-primaire-2026-2027.pdf', cycle: 'Primaire' },
  { title: 'Guide parent du Secondaire', file: '/documents/guide-parent-secondaire-2026-2027.pdf', cycle: 'Collège & Lycée' },
]

/* ---------- Mission (texte officiel) ---------- */
export const mission = {
  quote: 'Former des femmes responsables, autonomes, capables d’une réflexion personnelle, ouvertes aux enjeux du monde et au dialogue, prêtes à s’engager au service de la société.',
  citation: 'Il faudrait que chaque enfant soit entouré de soins si intelligents, de tant de respect et d’amour, que tout ce qu’il porte en lui puisse atteindre son plein épanouissement.',
  citationAuteur: 'Madeleine Daniélou',
}

/* ---------- Chiffres clés (données factuelles du site) ---------- */
export const stats = [
  { value: 6, suffix: 'è', label: 'Rentrée scolaire à Abidjan (2025 – 2026)' },
  { value: 3, suffix: '', label: 'Cycles : Maternelle, Primaire, Secondaire' },
  { value: 150, suffix: '+', label: 'Membres des équipes formés à l’IA (2026)' },
  { value: 8, suffix: '', label: 'Établissements du réseau Daniélou-Éducation' },
]

/* ---------- Hero : diapositives (photos officielles) ---------- */
export const heroSlides = [
  {
    eyebrow: 'Groupe Scolaire Madeleine-Daniélou · Abidjan',
    titleLine: 'Quand une conscience',
    titleAccent: 'rencontre une confiance…',
    text: 'Ancré à Cocody, le Groupe Scolaire Madeleine-Daniélou accueille les élèves de la maternelle au lycée dans une éducation d’excellence, humaine et engagée.',
    image: '/images/hero-ceremonie_up1600.webp',
    cta: { label: 'Pré-inscription en ligne', href: '/inscriptions#preinscription' },
    secondary: { label: 'La vie du collège', href: '/actualites' },
  },
  {
    eyebrow: 'Enseignements',
    titleLine: 'Maternelle, Primaire,',
    titleAccent: 'Collège & Lycée.',
    text: 'Un parcours complet et rigoureux, du jardin d’enfants au Baccalauréat : classes maternelles, primaires, collège et lycée au service de la réussite de chaque élève.',
    image: '/images/hero-1_up1600.webp',
    cta: { label: 'Découvrir les enseignements', href: '/enseignements' },
    secondary: { label: 'Fiches & documents', href: '/inscriptions' },
  },
  {
    eyebrow: 'Réseau Daniélou-Éducation',
    titleLine: 'Un réseau international,',
    titleAccent: 'une même exigence.',
    text: 'Membre du Réseau des Centres éducatifs Madeleine-Daniélou, animé par la Communauté Saint-François-Xavier : Abidjan, Paris, Neuilly, Rueil, Bobigny, Garges, Séoul…',
    image: '/images/peinture-murale_up1600.webp',
    cta: { label: 'Notre réseau', href: '/partenaires' },
    secondary: { label: 'Qui sommes-nous ?', href: '/qui-sommes-nous' },
  },
]

/* ---------- Fonds de hero supplémentaires (photos 1600px, sans texte inventé :
   le carrousel réutilise les textes officiels des 3 slides ci-dessus) ---------- */
export const heroExtraImages = [
  '/images/slide-0a20_up1600.webp',
  '/images/slide-216f_up1600.webp',
  '/images/slide-83dc_up1600.webp',
  '/images/slide-c712_up1600.webp',
  '/images/slide-4848_up1600.webp',
  '/images/slide-img2469_up1600.webp',
]

/* ---------- Badges flottants du hero ---------- */
export const heroBadges = [
  { value: '6ème', label: 'Rentrée scolaire du GSMD' },
  { value: 'UNESCO', label: 'École associée' },
  { value: '3', label: 'Cycles d’enseignement' },
]

/* ---------- Actualités ( événements réels du site officiel ) ---------- */
export const newsCategories = ['Tous', 'Événements', 'Pédagogie', 'Projets']

export const newsItems = [
  { id: 1, category: 'Pédagogie', date: '27 – 28 août 2026', image: '/images/news-ia-1_up1600.webp', title: 'Séminaire de rentrée 2026-2027 : l’IA à l’école', excerpt: '150 membres des équipes pédagogiques, d’encadrement et d’administration formés à un usage pratique et responsable de l’intelligence artificielle, avec la DTSI.' },
  { id: 2, category: 'Pédagogie', date: 'Octobre 2026', image: '/images/news-coree-1.webp', title: 'La langue et la culture coréennes au programme', excerpt: 'Le club coréen du groupe scolaire ouvre la voie : apprentissage de la langue, découvertes culturelles et échanges avec le Lycée International Xavier de Séoul.' },
  { id: 3, category: 'Événements', date: 'Mai 2026', image: '/images/news-combattants-1_up1600.webp', title: 'Célébration de la mémoire des anciens combattants', excerpt: 'Une célébration menée en collaboration avec l’Association Français du Monde (ADFE-CI) pour transmettre la mémoire aux nouvelles générations.' },
  { id: 4, category: 'Projets', date: 'Mai 2026', image: '/images/news-reuil-1.webp', title: 'Séjour pédagogique à Daniélou-Reuil', excerpt: 'Une délégation de Daniélou-Abidjan passe une semaine au Lycée Madeleine-Daniélou de Rueil-Malmaison : échanges, classes partagées et découvertes.' },
  { id: 5, category: 'Événements', date: 'Mars 2026', image: '/images/news-ambassadeur_up1600.webp', title: 'Audience avec l’Ambassadeur de Corée S.E.M KIM Saeng', excerpt: 'Le groupe scolaire reçu par l’Ambassadeur de la République de Corée en Côte d’Ivoire, témoignage du rayonnement de notre dimension internationale.' },
  { id: 6, category: 'Événements', date: '22 septembre 2025', image: '/images/hero-ceremonie_up1600.webp', title: 'Cérémonie aux couleurs : lancement de la 6ème rentrée', excerpt: 'Main droite sur la poitrine, salut aux couleurs : la rentrée s’est tenue en présence de M. Jean-Marc Yacé, Maire de Cocody.' },
  { id: 7, category: 'Projets', date: '16 septembre 2025', image: '/images/news-memoire_up1600.webp', title: 'Action sociale : nouvelles latrines pour EPP Djorogobité 2', excerpt: 'Geste de solidarité des élèves du GSMD : après deux ans sans latrines, l’école primaire publique de Cocody étudie enfin dans de bonnes conditions.' },
  { id: 8, category: 'Événements', date: 'Octobre – Novembre 2025', image: '/images/news-jubile.webp', title: 'Jubilé des éducateurs à Rome', excerpt: 'Du 29 octobre au 1er novembre 2025, participation du réseau Daniélou-Éducation au Jubilé des éducateurs célébré à Rome.' },
]

/* ============================================================
   WEB RADIO — épisodes de repli (client/public/audios/)
   ============================================================ */
export const fallbackPodcasts = [
  { id: 'p1', title: 'Le mot du Directeur', description: 'Rentrée 2026 : cap sur l’excellence et nos grands chantiers.', duration: '4:32', file: 'episode-01-mot-du-directeur.wav' },
  { id: 'p2', title: 'Spéciale Journée Portes Ouvertes', description: 'Reportage réalisé par les élèves du club presse.', duration: '6:08', file: 'episode-02-journee-portes-ouvertes.wav' },
  { id: 'p3', title: 'La rentrée expliquée aux parents', description: 'Conseils pratiques : matériel, emplois du temps, suivi.', duration: '5:17', file: 'episode-03-rentree-2026.wav' },
  { id: 'p4', title: 'Vie scolaire & clubs', description: 'Club coréen, club presse, action sociale : les élèves racontent.', duration: '7:45', file: 'episode-04-vie-scolaire-et-clubs.wav' },
]

/* ============================================================
   INSCRIPTIONS & DOCUMENTS — fiches de repli
   (client/public/documents/) — remplacées dynamiquement par
   l'API si elle est disponible. Sections : college / lycee / commun
   ============================================================ */
export const fallbackDocuments = [
  { id: 'd1', section: 'college', title: 'Fiche de pré-inscription — Collège (6ème → 3ème)', file: 'fiche-preinscription-college.pdf' },
  { id: 'd2', section: 'lycee', title: 'Fiche de pré-inscription — Lycée (2nde → Terminale)', file: 'fiche-preinscription-lycee.pdf' },
  { id: 'd3', section: 'commun', title: 'Règlement intérieur', file: 'reglement-interieur.pdf' },
  { id: 'd4', section: 'commun', title: 'Calendrier scolaire 2026 – 2027', file: 'calendrier-scolaire-2026-2027.pdf' },
  { id: 'd5', section: 'commun', title: 'Projet pédagogique de l’établissement', file: 'projet-etablissement.pdf' },
]

/* Infos affichées dans les 2 colonnes Inscriptions (texte officiel des pages Collège/Lycée) */
export const inscriptionColumns = [
  {
    key: 'college',
    title: 'Collège',
    subtitle: '6ème → 3ème',
    image: '/images/photo-labo.webp',
    points: [
      'Direction du Secondaire : Mme Katty MAMBO',
      'Suivi de la 6ème à la 3ème (Responsables de Division)',
      'Anglais dès le CE 1 · Allemand, Espagnol dès la 5ème · Portugais dès la 6ème',
      'Options dès la 4ème : techniques agricoles, ESF',
      'Effectif maximum : 35 élèves par classe',
    ],
  },
  {
    key: 'lycee',
    title: 'Lycée',
    subtitle: '2nde → Terminale',
    image: '/images/photo-lycee.webp',
    points: [
      'Direction du Secondaire : Mme Katty MAMBO',
      'Séries : A, C, D (de la 2nde à la Terminale)',
      'Préparation au Baccalauréat (Tle A1, A2, C, D)',
      'Cours de méthodologie de travail personnel en Seconde',
      'Latin à partir du Lycée',
    ],
  },
]

/* ---------- Héritage : fondatrice + citation Madeleine Daniélou ---------- */
export const heritage = {
  portrait: '/images/fondatrice-portrait_up1600.webp',
  photo: '/images/news-vasselot.webp',
  title: '✨ Odile de Vasselot ✨',
  role: 'Pionnière de Daniélou-Éducation en Côte d’Ivoire',
  text: 'Fondatrice et Première Directrice du lycée Sainte-Marie de Cocody, elle s’en est allée à l’âge de 103 ans. Grâce à elle, Daniélou-Éducation a pris corps en Côte d’Ivoire. Des générations de femmes ivoiriennes lui sont reconnaissantes.',
  hommage: 'La Côte d’Ivoire et la France lui rendent hommage',
}

/* ---------- Réseau Daniélou-Éducation (logos officiels) ---------- */
export const partnersIntro = {
  text: 'Le Groupe Scolaire Madeleine-Daniélou, animé par la Communauté Saint-François-Xavier, est membre du Réseau des Centres éducatifs Madeleine-Daniélou.',
}

export const partners = [
  { name: 'Lycée Sainte-Marie de Cocody', country: 'Côte d’Ivoire', logo: '/images/part-lysma_up1600.webp' },
  { name: 'Lycée International Xavier de Séoul', country: 'Corée du Sud', logo: '/images/part-xavier_up1600.webp' },
  { name: 'Lycée Sainte-Marie de Neuilly', country: 'France', logo: '/images/part-smn_up1600.webp' },
  { name: 'Lycée Madeleine-Daniélou de Rueil-Malmaison', country: 'France', logo: '/images/part-rueil_up1600.webp' },
  { name: 'Lycée Charles-Péguy de Bobigny', country: 'France', logo: '/images/part-bobigny_up1600.webp' },
  { name: 'Lycée Charles-Péguy de Paris', country: 'France', logo: '/images/part-peguy-paris_up1600.webp' },
  { name: 'Centre Charles-Péguy de Garges-lès-Gonesse', country: 'France', logo: '/images/part-garges_up1600.webp' },
  { name: 'Communauté Saint-François-Xavier', country: 'Communauté fondatrice', logo: '/images/part-sfx_up1600.webp' },
  { name: 'École associée UNESCO', country: 'Label international', logo: '/images/part-unesco_up1600.webp' },
  { name: 'Daniélou-Éducation', country: 'Réseau international', logo: '/images/part-education_up1600.webp' },
]

/* ---------- Options de classe (formulaire de pré-inscription) ---------- */
export const classeOptions = [
  'Maternelle — Grande section',
  'CP', 'CE1', 'CE2', 'CM1', 'CM2',
  '6ème', '5ème', '4ème', '3ème',
  '2nde', '1ère', 'Terminale',
]

/* ---------- Paroles d'inspiration (citations réelles) ---------- */
export const testimonials = [
  {
    name: 'Projet éducatif du GSMD',
    role: 'Notre mission',
    text: 'Former des femmes responsables, autonomes, capables d’une réflexion personnelle, ouvertes aux enjeux du monde et au dialogue, prêtes à s’engager au service de la société.',
  },
  {
    name: 'Madeleine Daniélou',
    role: 'Notre fondation spirituelle',
    text: 'Il faudrait que chaque enfant soit entouré de soins si intelligents, de tant de respect et d’amour, que tout ce qu’il porte en lui puisse atteindre son plein épanouissement.',
  },
  {
    name: 'Odile de Vasselot',
    role: 'Pionnière de Daniélou-Éducation en Côte d’Ivoire',
    text: 'Grâce à elle, Daniélou-Éducation a pris corps en Côte d’Ivoire. Des générations de femmes ivoiriennes lui sont reconnaissantes.',
  },
]
