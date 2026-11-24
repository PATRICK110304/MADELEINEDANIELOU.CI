# Rapport de Phase 1 — Diagnostic (aucune modification de code)

Date : 2026-11-24 · Projet : Groupe Scolaire Daniélou Abidjan
Skills appliqués dans l'ordre demandé : `school-admin-dashboard` (palette/règles, seul skill de charte disponible — `site-gsmd` n'est pas installé), `frontend-design`, `impeccable`, `web-design-guidelines`, `webapp-testing`.

Source de vérité du contenu : `https://madeleinedanielou.ci` (pages listées dans la mission). Aucun texte, chiffre ou tarif n'a été inventé pendant cette phase.

## 1. Résultats mesurés

### Lighthouse — accessibilité (local :5173)
| Page | Score |
|---|---|
| Accueil | 93/100 |
| Enseignements | 97/100 |
| Galerie | 96/100 |
| Admin `/admin/dashboard` | 100/100 |

Échecs détaillés : `color-contrast` (accueil, enseignements, galerie), `label-content-name-mismatch` (logo du header sur 3 pages), `target-size` (pastilles du hero sur l'accueil).

### impeccable detect (1280×800)
| Page | Findings | Principaux |
|---|---|---|
| Accueil | 11 | `low-contrast` ×3, `straggler` ×3, `unbalanced-heading` ×3, `overused-font` (Inter 81 %), `marquee` |
| Enseignements | 9 | `low-contrast` ×5, `overused-font` (90 %), `nested-cards` ×2, `kicker-above-heading` |
| Galerie | 7 | `low-contrast` ×4, `overused-font` (88 %), contraste 1,9:1 du texte sur photo |
| Admin | 1 | placeholder du login 3,3:1 |

Contrastes calculés : `#D9532B` = **3,51:1** sur `#FAF8F5`, **4,02:1** sur blanc (échec AA) ; `#B2421A` = **4,98:1** sur beige et blanc (conforme) ; `#7b8188` = **3,44:1** sur beige (échec) ; `#FF9A6B` sur `#082850` = **7,06:1** (conforme, imposé par le brief).

### Navigation clavier (Playwright)
- Tab sur l'accueil : `logo → téléphone → pré-inscription → Accueil → L'école → Enseignements → Inscriptions → Vie du GSMD → Contact` — **les sous-menus ne sont jamais atteignables** (`invisible opacity-0`, hover seul).
- Pastilles du hero : 7 `button` de 10×10 px, focusables mais cible insuffisante.
- `/galerie` → Entrée sur une carte événement ouvre bien sa galerie ✅.
- `/galerie/:slug` : 37 images cliquables, **0 focusable** ; le lightbox ne gère ni focus initial, ni piège, ni restauration.

### Sécurité (lecture seule)
- Routes admin protégées côté serveur (`requireAuth` sur tous les endpoints d'écriture et `/admin`) ✅
- Helmet, CORS en liste blanche, 3 limiteurs de débit (login 5/15 min, contact 5/h, inscriptions 6/h, global 300/15 min) ✅
- Aucun secret suivi par git (seuls `*.env.example` et le générateur sont versionnés) ✅
- **Aucun `<meta name="robots" content="noindex">` sur `/admin`** ⚠️
- Rôles (direction / secrétariat / communication) absents : un seul compte admin Supabase ⚠️ (décision direction)
- Journal des consultations / exports : absent ⚠️

## 2. Problèmes classés

### P0 — bloquants
| # | Problème | Fichier:ligne |
|---|---|---|
| P0-1 | Sous-menus accessibles uniquement au survol, pas au clavier ni aux lecteurs d'écran (`:focus-within`, `aria-expanded` absents) | `client/src/components/Navbar.tsx:151` |
| P0-2 | 37 vignettes `<img onClick>` inatteignables au clavier ; lightbox sans focus initial/piège/restauration | `client/src/pages/GalerieEventPage.tsx:58-69`, `client/src/components/Lightbox.tsx:48-56` |
| P0-3 | `<div onClick>` sans sémantique de bouton (galerie, vidéos, cartes d'image) | `client/src/components/PhotoCard.tsx:68`, `client/src/components/ImageCard.tsx:50`, `client/src/components/Videos.tsx:87` |
| P0-4 | Contradiction factuelle exposée : « Ancré à Cocody » vs Bingerville (adresse vérifiée) | `client/src/data/content.js:461` |
| P0-5 | Copies techniques visibles au public : « dossier public/galerie/ vide ? », « Vérifiez le nom du dossier », « (Informations à compléter) », slug comme titre | `client/src/pages/GalleryPage.tsx:20,25,32`, `client/src/pages/GalerieEventPage.tsx:25,48` |

### P1 — majeurs
| # | Problème | Fichier:ligne |
|---|---|---|
| P1-1 | Aucun `<h1>` sur ~14 routes ; plan de page invalide | `client/src/App.tsx:66`, `client/src/components/SectionHeader.tsx:27` |
| P1-2 | Pas de lien d'évitement « Aller au contenu » | `client/src/App.tsx:63` |
| P1-3 | H1 du hero à 17 px sur mobile (aucune taille de base) | `client/src/components/HeroSlider.tsx:63` |
| P1-4 | `pt-[104px]` pour un header de 67 px → 37 px de vide mort | `client/src/App.tsx:66` |
| P1-5 | Carrousel auto 9,5 s sans pause ni `prefers-reduced-motion` ; 9 slides, 3 textes recyclés | `client/src/components/HeroSlider.tsx:19-34,97-107` |
| P1-6 | Défilement infini 60 ms sans pause (`Videos.tsx`) | `client/src/components/Videos.tsx:26` |
| P1-7 | Modale de confirmation et tiroir admin sans focus initial/piège/Échap | `client/src/components/admin/ConfirmModal.tsx:5`, `client/src/components/admin/SlideOverDrawer.tsx:15` |
| P1-8 | Lightbox `role="dialog"` sans focus ni restauration | `client/src/components/Lightbox.tsx:48` |
| P1-9 | Erreur de login Supabase affichée en anglais (« Invalid login credentials ») ; README avec identifiants obsolètes | `client/src/pages/AdminDashboardPage.tsx:87`, `README.md:20` |
| P1-10 | Textes `#7b8188`/`#d9532b` et `#7f8691` sous 4,5:1 ; corail sur blanc à 4,02:1 | `client/src/components/Footer.tsx:169,172,176`, `client/src/components/SecondaireTabs.tsx:178,193`, `client/src/index.css:41` |
| P1-11 | Histoire erronée : 1910 au lieu de 1913, 1962 à Cocody au lieu d'Adjamé, inauguration 2020 au lieu du 15/01/2021 | `client/src/data/infos-ecole.js:12,13,14`, `client/src/components/Institution.tsx:32,58` |
| P1-12 | Horaires erronés (7h30–12h25/13h55–16h40 et secrétariat 7h–16h) vs 7h30–17h00 / pause 12h45–13h45 | `client/src/data/infos-ecole.js:17`, `client/src/pages/EcolePage.tsx:66,69`, `client/src/components/MotDirection.tsx:32` |
| P1-13 | « Mot de la Direction » rédigé localement, absent du site source | `client/src/components/MotDirection.tsx:41-59` |
| P1-14 | Menu cantine périmé (02–06/11 au lieu de 16–20/11/2026) | `client/src/data/content.js:420` |
| P1-15 | Classes indisponibles proposées dans le formulaire (CE2, CM1, 6e–3e, Terminale) malgré la source | `client/src/data/content.js:600-605`, `client/src/components/PreRegistration.tsx:206-210` |
| P1-16 | Éditeur légal erroné : «Direction du GSMD» au lieu de «Communauté Saint-François-Xavier» | `client/src/pages/LegalNoticePage.tsx:25-33` |
| P1-17 | PDF et audios de démonstration présentés comme officiels ; durées inventées | `client/src/data/content.js:521-539`, `client/src/components/Inscriptions.tsx:58` |
| P1-18 | Bouton de connexion admin sans état de chargement (double envoi) | `client/src/components/ContactForm.tsx:78` |

### P2 — modérés
| # | Problème | Fichier:ligne |
|---|---|---|
| P2-1 | `role="tab"` sans `aria-controls`/`tabpanel` ni navigation flèches | `client/src/components/SecondaireTabs.tsx:83`, `client/src/components/News.tsx:49`, `client/src/pages/PhotosPage.tsx:24` |
| P2-2 | Onglets admin en `useState` uniquement ; `aria-current="page"` sur des boutons ; deep-link impossible | `client/src/pages/AdminDashboardPage.tsx:45,141` |
| P2-3 | `PhotosPage` sans état chargement/erreur (panne silencieuse) | `client/src/pages/PhotosPage.tsx:14` |
| P2-4 | Champs de préinscription sans `name`/`autocomplete` ; pas de focus sur 1er champ invalide | `client/src/components/PreRegistration.tsx:198-245,89-95` |
| P2-5 | `<a>` brut dans un `<label>` du formulaire contact | `client/src/components/ContactForm.tsx:75` |
| P2-6 | Cibles tactiles < 44 px (pastilles hero, flèches vidéos, suppression admin, réseaux sociaux) | `client/src/components/HeroSlider.tsx:99-105`, `client/src/components/Videos.tsx:110,118`, `client/src/pages/AdminDashboardPage.tsx:247,263,305`, `client/src/components/Footer.tsx:64` |
| P2-7 | Route `*` → accueil au lieu d'une 404 | `client/src/App.tsx:92` |
| P2-8 | `scroll-behavior: smooth` global sans override reduced-motion | `client/src/index.css:156-160`, `client/src/App.tsx:48` |
| P2-9 | `<main>` imbriqué dans `<main>` sur l'admin | `client/src/pages/AdminDashboardPage.tsx:150`, `client/src/App.tsx:66` |
| P2-10 | `<Reveal>` div enfant direct de `<ol>` ; `<figcaption>` hors `<figure>` ; `<th>` sans `scope` | `client/src/components/ActualitesOfficielles.tsx:19`, `client/src/components/Institution.tsx:76`, `client/src/components/admin/DataTable.tsx:25` |
| P2-11 | `theme-color` `#0060a0` ≠ charte `#0B5CA0` ; utilitaires `#D05020` ≠ `#D9532B` | `client/src/index.html:17`, `client/src/index.css:249` |
| P2-12 | Bandeau cookies en `role="dialog"` (plutôt `region`) ; erreurs en `role="status"` | `client/src/components/CookieBanner.tsx:47`, `client/src/components/ContactForm.tsx:53` |
| P2-13 | Albums annuels (2023-2024, 2024-2025, 2025-2026) absents des liens utiles | `client/src/data/content.js:194-218` |
| P2-14 | Partenaires source omis (Prosuma, NSIA, Fondation Nexans, DCC, Guilde, TBC, Maison Celah/Ermont) | `client/src/data/content.js:586-597` |
| P2-15 | Pas de robot `noindex` sur `/admin`, pas de journal des consultations/exports | `client/index.html`, `server/src/` |
| P2-16 | Accent `#FF9A6B` hors charte (mais explicitement demandé sur fond sombre) | `client/src/components/HeroSlider.tsx:65`, `client/src/components/PhotoCard.tsx:46` |

### P3 — mineurs
| # | Problème | Fichier:ligne |
|---|---|---|
| P3-1 | Classe invalide `text-wrap:balance` → `text-balance` | `client/src/components/CtaBand.tsx:24`, `client/src/components/Heritage.tsx:52` |
| P3-2 | `<img>` sans `width`/`height` (CLS) | `PhotoCard.tsx:35`, `ImageCard.tsx:31`, `Institution.tsx:69`, `Videos.tsx:167`, `Heritage.tsx:68,71`, `Partners.tsx:20,56`, `Logo.tsx:14`, `GalerieEventPage.tsx:61` |
| P3-3 | `transition-all` généralisé ; `animate-pulse` sans reduced-motion dédié | `Navbar.tsx:107,142,151,174,193`, `Reveal.tsx:19`, `DataTable.tsx:19` |
| P3-4 | Éléments fixes sans `env(safe-area-inset-*)` | `client/src/components/Navbar.tsx:82`, `client/src/components/CookieBanner.tsx:52` |
| P3-5 | Classe Tailwind invalide `columns-span all` | `client/src/pages/GalerieEventPage.tsx:73` |
| P3-6 | Statistiques dupliquées `sm:text-[2.25rem]` vs `sm:text-5xl` | `client/src/components/Stats.tsx:17` |
| P3-7 | `eyebrow=""` dessine deux filets vides | `client/src/components/Partners.tsx:44`, `client/src/components/SectionHeader.tsx:21-24` |
| P3-8 | « 150+ » au lieu de « 150 membres » ; « Huit établissements » avec Rome inexistant | `client/src/data/content.js:451`, `client/src/components/Reussites.tsx:21` |
| P3-9 | Affirmations commerciales absentes de la source (« places limitées », « moins de 5 minutes », « rappel sous 48 h », « 115 élèves », uniforme détaillé) | `CtaBand.tsx:28`, `Footer.tsx:136`, `Cycles.tsx:67`, `PreRegistration.tsx:124,155`, `infos-ecole.js:18,53` |
| P3-10 | `role="dialog"` cookie + `aria-modal="false"` ; `aria-label` sur `<div>` dans le bandeau partenaires | `CookieBanner.tsx:47`, `Partners.tsx:52` |

## 3. Données de test (à ne PAS supprimer, demandées en Phase 3)

Relevées dans Supabase `public.contact_messages` et `public.inscriptions` : `Verif Final`, `Test Unique`, `Test Audit`, Test EXIF, ainsi que le dossier `INS-2026-A00A5C` (Aya Kouassi). Elles seront listées telles quelles dans le rapport final, sans suppression.

## 4. Décisions à prendre par l'école / informations manquantes

1. Rôles admin (direction, secrétariat, communication) : un seul compte aujourd'hui — créer les comptes Supabase et définir qui fait quoi.
2. Éditeur légal exact (Communauté Saint-François-Xavier), téléphone `+225 27 22 44 01 86`, email `sfx-abidjan@communaute-sfx.com`, hébergeur, durée de conservation : à confirmer/renseigner.
3. Autorisation de droit à l'image pour les photos d'élèves et déclaration ARTCI : à fournir.
4. Vrai `Mot de la Direction` et vrais PDF/audios officiels : à fournir (les fichiers actuels sont des démonstrations).
5. Page Facebook « officielle » : URL à confirmer (aucun lien trouvé sur la source).
6. Confirmation du statut « école associée UNESCO » et de la liste exacte des partenaires.
7. Nouveau planning des inscriptions 2026-2027 (PDF source) à intégrer.
8. Le carrousel (9 slides / 3 textes) et les 6 CTA pré-inscription : choix éditorial à trancher.

## 5. Périmètre des phases suivantes

- Phase 2 : `PhotoCard.tsx`, `HeroSlider.tsx`, `GalleryPage.tsx`, `GalerieEventPage.tsx`, `Lightbox.tsx`, `index.css`.
- Phase 3 : `AdminDashboardPage.tsx`, `components/admin/*`, KPI et libellés.
- Phase 4 : `server/src/middleware/auth.js`, `routes/*`, `index.html`, rôles et journalisation.
- Phase 5 : `LegalNoticePage.tsx`, `PrivacyPolicyPage.tsx`, `PreRegistration.tsx`, polices locales, cookies.
- Phase 6 : Playwright 375/768/1280, Lighthouse, impeccable detect, web-design-guidelines.
