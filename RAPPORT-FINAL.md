# Rapport final — Mise à niveau du site GSMD Abidjan

Date : 24 novembre 2026 · Branches : `main` (dépôt `PATRICK110304/MADELEINEDANIELOU.CI`)
Palette imposée : bleu `#0B5CA0`, corail `#D9532B`, fond clair `#FAF8F5`, accent clair `#FF9A6B` sur fond sombre.

Skills utilisés dans l'ordre demandé : `school-admin-dashboard` (à la place de `site-gsmd`, non installé — ses règles de palette et de schéma ont primer), `frontend-design`, `impeccable`, `web-design-guidelines`, `webapp-testing`, plus `secrets-management` pour la phase 4.

## 1. Ce qui a été corrigé

### Phase 1 — Diagnostic (commit `a18eb47`)
- `/impeccable critique` + `audit` sur accueil, Enseignements, galerie, admin ; `web-design-guidelines` sur tous les composants ; Lighthouse accessibilité ; navigation clavier Playwright ; comparaison du contenu avec `madeleinedanielou.ci`.
- Rapport complet P0–P3 dans `RAPPORT-PHASE1.md` (aucun code modifié pendant cette phase).
- Scores avant : accueil 93, enseignements 97, galerie 96, admin 100.

### Phase 2 — Site public (commit `8a944b8`)
- `PhotoCard.tsx` : dégradé `#082850` bas→haut, texte blanc, `line-clamp-3`, hauteur minimale 380 px, `width`/`height`, bouton sémantique uniquement quand une action existe (plus de boutons vides ni d'imbrication dans un lien).
- `HeroSlider.tsx` : 3 vraies diapositives (plus de textes recyclés sur 6 photos), hauteur de texte fixe, bouton toujours au même endroit, pastilles dans le flux en cibles 44×44, bouton pause/reprise, `prefers-reduced-motion`, H1 mobile lisible, accent `#FF9A6B`.
- Galerie : vignettes `<button>` focusables avec `aria-label`, lightbox avec focus initial, piège Tab, Échap, restauration du focus, swipe tactile, flèches 44 px ; suppression des copies techniques (« rentals », « public/galerie/ », « Informations à compléter », slug comme titre).
- Navigation : sous-menus accessibles au clavier (`:focus-within` + `aria-haspopup`), lien d'évitement « Aller au contenu », H1 sur toutes les routes, `pt-[68px] lg:pt-[104px]`, contraste du footer et des textes corail corrigé (`#B2421A` : 4,98:1).
- Contenu : « Ancré à Bingerville » remplace « Cocody » dans le hero ; badge de rentrée 2026 – 2027.
- Polices : **auto-hébergées** (`client/public/fonts/`), aucun appel Google Fonts ni traceur avant consentement.

### Phase 3 — Administration (commit `179aee6`)
- Grille de **4 KPI réguliers et cliquables**, bloc **« À traiter »** (dossiers à examiner / messages non traités avec boutons d'action), **actions rapides** (document, podcast, photos, actualités), **activité récente en dates relatives**.
- Menu : pastilles de compteur par section, logo + email connecté + « Voir le site », déconnexion séparée en bas, **tiroir mobile** avec focus et Échap.
- Pré-inscriptions : compteurs colorés par statut, répartition par niveau, export CSV, états vides rédigés pour un secrétariat.
- Erreurs Supabase Auth traduites en français ; suppression du `<main>` imbriqué.

### Phase 4 — Sécurité (commits `955c99b`, `bc3ea67`)
- `<meta name="robots" content="noindex, nofollow">` dynamique sur `/admin`.
- Contrôle de rôles optionnel (`ADMIN_ROLES` + `app_metadata.role`, valeurs : direction, secrétariat, communication) sans casser le compte actuel.
- **Journal d'audit** PostgreSQL : table `public.audit_log` (RLS activée, révoquée à `anon`/`authenticated`), migration `004_audit_log.sql`, service paramétré, traçabilité des consultations `/admin` et des exports CSV.
- Vérifié : routes admin protégées côté serveur, Helmet, CORS en liste blanche, 4 limiteurs de débit, JWT Supabase avec expiration/rafraîchissement, mots de passe gérés par Supabase Auth (bcrypt local en repli), validation des entrées, filtres et limites Multer, aucun secret suivi par git.

### Phase 5 — Conformité (commit `901aada`)
- `LegalNoticePage.tsx` : éditeur réel = **Communauté Saint-François-Xavier**, téléphone `+225 27 22 44 01 86`, email `sfx-abidjan@communaute-sfx.com` ; champs **« À COMPLÉTER PAR L'ÉCOLE »** pour le directeur de publication et l'hébergeur.
- `PrivacyPolicyPage.tsx` : responsable de traitement, finalités, destinataires, droits, loi n° 2013-450 et ARTCI ; champs **« À COMPLÉTER PAR L'ÉCOLE »** pour les durées de conservation et la déclaration ARTCI.
- `PreRegistration.tsx` : mention d'information (données nécessaires et limitées au minimum, canal `groupescolaire@madeleinedanielou.ci` pour les droits), case de consentement non précochée, lien vers la politique.
- Aucun traceur tiers chargé avant consentement (vérifié : 0 requête `fonts.googleapis`, `google-analytics`, etc.).

### Phase 6 — Vérification (ce commit)
- Typecheck : 0 erreur. Build : OK.
- **Lighthouse accessibilité : 100/100 sur 9 pages** (accueil, enseignements, galerie, galerie événement, admin, inscriptions, confidentialité, mentions légales, contact) avec **0 échec** par page.
- Playwright 375 / 768 / 1 280 px sur 8 pages + 3 diapositives du hero + 5 onglets admin : **0 erreur JS, 0 débordement horizontal**.
- 21 liens du menu principal testés → tous mènent à une page avec H1.
- Formulaire de pré-inscription : les 3 étapes fonctionnent, case non cochée, mention des droits visible.
- Admin connecté (session Supabase) : `noindex` actif, onglets OK, audit des consultations et de l'export vérifié dans `public.audit_log` (7 lignes, acteur `admin@madeleinedanielou.ci`).
- `impeccable detect` : 8 / 4 / 3 / 1 findings respectivement sur `/`, `/enseignements`, `/galerie`, `/admin/dashboard` (détail dans « Reste à faire »).

Captures : `/tmp/opencode/F6-<page>-{375,768,1280}.png`, `/tmp/opencode/F6-hero-slide-{1,2,3}.png`, `/tmp/opencode/F6-admin-{375,768,1280}.png`, `/tmp/opencode/F6-admin-<onglet>.png`. Comparaison avant/après : `/tmp/opencode/A*.png`, `/tmp/opencode/P2-*.png`, `/tmp/opencode/DASHBOARD-EMBELLI.png`.

## 2. Données de test — listées, PAS supprimées

| Table | Donnée |
|---|---|
| `contact_messages` | `Verif Final` (v@test.ci, 24/11 12:14), `Test Unique` (a@b.ci, 24/11 11:59), `Test Audit` (test@example.com, 24/11 05:10) |
| `inscriptions` | `INS-2026-A00A5C` — Aya Kouassi, 6ème, statut `nouveau` |
| `photos` | `test-exif` (WebP portrait 533×800) |

## 3. Ce qui reste

### Technique (P2/P3, non bloquant)
- `ConfirmModal.tsx:5` et `SlideOverDrawer.tsx:15` modales : piège Tab et restauration de focus ajoutés ; `overscroll-behavior`, safe-area et `aria-expanded` du sous-menu desktop restent à affiner.
- `PreRegistration.tsx` : attributs `name`/`autocomplete`, focus sur le premier champ invalide, `aria-live` sur l'erreur API.
- `AdminDashboardPage.tsx` : état de chargement du bouton de connexion, deep-link des onglets.
- `index.css` : `transition-all` résiduels, `scroll-behavior: smooth` non neutralisé partout sous `prefers-reduced-motion`.
- `impeccable detect` : `overused-font` (Inter dominant, choix de charte existant), `kicker-above-heading` et `nested-cards` (structure éditoriale actuelle), `marquee` (animation de logos **explicitement demandée**), `low-contrast` mineur sur le placeholder du login admin, `straggler`/`unbalanced-heading` (conseils typographiques Advisory). Le détecteur ne mesure pas la mise en page, déjà validée visuellement.

### Éditorial — à corriger par l'école (aucune invention permise)
| Sujet | Fichier:ligne |
|---|---|
| Histoire : 1910 au lieu de 1913 ; 1962 à Cocody au lieu d'Adjamé ; inauguration 2020 au lieu du 15/01/2021 | `data/infos-ecole.js:12-14`, `components/Institution.tsx:32,58` |
| Horaires erronés (7h30–12h25 / 13h55–16h40, secrétariat 7h–16h) | `data/infos-ecole.js:17`, `pages/EcolePage.tsx:66,69`, `components/MotDirection.tsx:32` |
| « Mot de la Direction » rédigé localement, absent du site source | `components/MotDirection.tsx:41-59` |
| Menu cantine périmé (02–06/11 au lieu de 16–20/11/2026) | `data/content.js:420` |
| Classes indisponibles proposées (CE2, CM1, 6e–3e, Terminale) | `data/content.js:600-605` |
| PDF/audios de démonstration présentés comme officiels ; durées inventées | `data/content.js:521-539`, `components/Inscriptions.tsx:58` |
| Réseau : « Rome » inexistant, Cocody et Ermont omis ; « 150+ » au lieu de « 150 membres » | `components/Reussites.tsx:21`, `data/content.js:451` |
| Partenaires source absents (Prosuma, NSIA, Fondation Nexans, DCC, Guilde, TBC, Maison Celah) | `data/content.js:586-597` |
| Albums annuels 2023-2024 / 2024-2025 / 2025-2026 non exposés | `data/content.js:194-218` |
| Affirmations commerciales non sourcées (« places limitées », « moins de 5 minutes », « rappel sous 48 h ») | `components/CtaBand.tsx:28`, `Footer.tsx:136`, `Cycles.tsx:67`, `PreRegistration.tsx:124,155` |

## 4. Décisions à prendre par l'école / informations à fournir

1. **Rôles** : créer les comptes Supabase et renseigner `ADMIN_ROLES` (direction, secrétariat, communication) + `app_metadata.role`.
2. **Mentions légales** : directeur de publication, hébergeur, durée de conservation, référence de déclaration ARTCI.
3. **Droit à l'image** : autorisations signées pour les photos d'élèves ; déclaration ARTCI à confirmer.
4. **Contenus officiels** : vrai mot de la Direction, vrais PDF/audios, planning d'inscription 2026-2027, URL Facebook officielle, statut UNESCO, liste des partenaires.
5. **Resend** : domaine `madeleinedanielou.ci` à vérifier pour délivrer les emails du formulaire (actuellement enregistrés en base, `emailSent:false`), et clé API à régénérer car elle a été partagée dans le chat.
6. **Carrousel / CTA** : 3 slides et 6 CTA « pré-inscription » — choix éditorial à valider.

## 5. État Git

Toutes les phases ont été commitées puis poussées sur `origin/main`. Le rapport final est commité avec la Phase 6 ; `git status` est propre.
