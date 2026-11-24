# Collège Madeleine Daniélou — Site v2 (client + API)

Refonte complète du site **madeleinedanielou.ci**.

- **Client** : React 19 + Vite + Tailwind CSS v4 — `client/`
- **API** : Node.js / Express (JWT, bcrypt, Helmet, Multer) — `server/`
- **Charte** : Blanc + Orange `#E85D04` (dégradés `#E85D04 → #D97706`) dominants, Bleu Facebook `#1877F2` en accent, or quasi absent (logo uniquement)

---

## Démarrage rapide

```bash
npm install            # installe client + server (workspaces)
npm run placeholders   # génère les PDF/WAV de démonstration
npm run dev:server     # API sur http://localhost:4000
npm run dev:client     # site sur http://localhost:5173 (proxy /api)
```

Compte admin par défaut (fichier `server/.env`) : `admin@madeleinedanielou.ci` / `Secret@2026!`

---

## Structure du projet

```
├── client/                    FRONT-END (React + Tailwind v4)
│   ├── public/
│   │   ├── favicon.svg · logo.svg
│   │   ├── documents/         fiches PDF servis par le site statique
│   │   └── audios/            épisodes radio servis par le site statique
│   └── src/
│       ├── data/content.js    contenu éditorial + données de repli
│       ├── services/api.js    couche API + repli hors-ligne + reCAPTCHA
│       ├── hooks/             useInView · useCountUp
│       └── components/        14 composants commentés (voir App.jsx)
├── server/                    BACK-END (Express)
│   ├── .env · .env.example
│   ├── public/
│   │   ├── documents/         fiches PDF (upload admin + seed)
│   │   └── audios/            épisodes MP3/WAV (upload admin + seed)
│   ├── data/db.json           mini base JSON (auto-créée)
│   └── src/
│       ├── index.js           app Express (Helmet, CORS, rate-limit, static)
│       ├── config.js          variables d'environnement
│       ├── db.js              persistance JSON atomique
│       ├── seed.js            admin bcrypt + contenus par défaut
│       ├── middleware/        auth (JWT) · sanitize (XSS) · errorHandler
│       └── routes/            auth · inscriptions · documents · podcasts
└── tools/generate-placeholders.mjs
```

## Sections & ancres (navigation fluide)

| Ancre            | Section                                        |
|------------------|------------------------------------------------|
| `#accueil`       | Hero slider immersif + badges flottants        |
| `#actualites`    | Actualités & Vie du Collège (filtres catégories) |
| `#radio`         | Web Radio « Madeleine FM » (lecteur natif + téléchargements) |
| `#inscriptions`  | Inscriptions & Documents (Collège / Lycée + PDF) |
| `#preinscription`| Formulaire 3 étapes → n° de dossier unique     |
| `#contact`       | Pied de page (coordonnées)                     |

---

## API REST

| Méthode | Route                   | Accès | Description                                      |
|---------|-------------------------|-------|--------------------------------------------------|
| POST    | `/api/auth/login`       | public (rate-limit 10/15 min) | Connexion admin → JWT |
| GET     | `/api/auth/me`          | JWT   | Profil connecté                                   |
| POST    | `/api/inscriptions`     | public (rate-limit 6/h) | Créer un dossier → `INS-<année>-<6 hex>` unique |
| GET     | `/api/inscriptions/admin` | JWT | Lister les dossiers                               |
| DELETE  | `/api/inscriptions/:id` | JWT   | Supprimer un dossier                              |
| GET     | `/api/documents`        | public | Liste des fiches PDF                             |
| POST    | `/api/documents`        | JWT   | Ajouter une fiche (champ `file`, PDF)             |
| PUT     | `/api/documents/:id`    | JWT   | Remplacer le fichier / éditer les métadonnées     |
| DELETE  | `/api/documents/:id`    | JWT   | Supprimer une fiche (+ fichier physique)          |
| GET/POST/PUT/DELETE | `/api/podcasts` | idem documents | CRUD des épisodes radio (MP3, WAV, M4A, OGG) |
| GET     | `/api/health`           | public | Monitoring                                        |

Exemple d'upload protégé :

```bash
TOKEN=$(curl -s -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@madeleinedanielou.ci","password":"Secret@2026!"}' | jq -r .token)

curl -X POST http://localhost:4000/api/documents \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@nouvelle-fiche.pdf" -F "title=Fiche 2027" -F "section=lycee"
```

---

## Noms de fichiers d'assets utilisés dans le code

### Fiches PDF — `/documents/` (client/public + server/public)

1. `fiche-preinscription-college.pdf`
2. `fiche-preinscription-lycee.pdf`
3. `reglement-interieur.pdf`
4. `calendrier-scolaire-2026-2027.pdf`
5. `projet-etablissement.pdf`

### Épisodes radio — `/audios/` (client/public + server/public)

1. `episode-01-mot-du-directeur.wav`
2. `episode-02-journee-portes-ouvertes.wav`
3. `episode-03-rentree-2026.wav`
4. `episode-04-vie-scolaire-et-clubs.wav`

> Ce sont des fichiers de **démonstration** (PDF minimaux / WAV d'attente).
> L'équipe administrative les remplace via l'API CRUD (upload de vrais PDF/MP3) ;
> les nouveaux fichiers reçoivent un suffixe unique (`-a5771a`) et les URL sont
> servies dynamiquement au front. Les logos : `favicon.svg`, `logo.svg`.

---

## Sécurité (résumé)

- **Helmet** : en-têtes HTTP + CSP (images, médias, reCAPTCHA autorisés)
- **CORS restreint** : liste blanche `CLIENT_URL` uniquement
- **Sanitisation XSS** : tous les champs texte nettoyés (`middleware/sanitize.js`)
- **Anti-spam** : `express-rate-limit` (global + login + inscriptions) et **reCAPTCHA v3** vérifié côté serveur (score ≥ 0.5) — activer via `RECAPTCHA_SECRET` + `VITE_RECAPTCHA_SITE_KEY`
- **Auth admin** : JWT signé (HS256, expiration 1 j) + bcrypt (cost 12)
- **Uploads** : Multer avec filtres MIME stricts (PDF / audio) et taille plafonnée

## Déploiement

- **Client (Vercel/Netlify)** : `vercel.json` et `netlify.toml` fournis à la racine — déploient `client/dist` avec redirections SPA + en-têtes de sécurité.
- **API (Railway, Render, VPS)** : le stockage des fichiers est sur disque — utiliser un hébergement avec volume persistant.
  ```bash
  npm --workspace server install   # sur le serveur
  npm run start:server             # PORT=4000 (définit CLIENT_URL=https://madeleinedanielou.ci)
  ```
  Définir côté client : `VITE_API_URL=https://api.madeleinedanielou.ci`

### reCAPTCHA v3 — activation

1. Créer une clé sur console.cloud.google.com (type v3).
2. `client/.env` → `VITE_RECAPTCHA_SITE_KEY=...` (le script Google est injecté automatiquement à la soumission).
3. `server/.env` → `RECAPTCHA_SECRET=...` (la vérification serveur devient obligatoire).
