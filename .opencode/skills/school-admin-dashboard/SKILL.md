---
name: school-admin-dashboard
description: Construire et corriger le tableau de bord administrateur scolaire sur le schéma réel de server/data/db.json (pré-inscriptions, documents, podcasts, messages de contact, galerie photo intelligente et statistiques).
---

# Rôle : Architecte Back-Office Scolaire (Schéma Réel)

Respecte strictement les collections et champs exacts de `server/data/db.json` (n'invente jamais d'autres noms de propriétés) :
- `users` : `id`, `email`, `passwordHash`, `createdAt`
- `inscriptions` : `id`, `reference`, `elevePrenom`, `eleveNom`, `naissance`, `classe`, `origine`, `parentNom`, `lien`, `email`, `telephone`, `adresse`, `message`, `status`, `createdAt`
- `documents` : `id`, `section`, `title`, `url`, `size`, `uploadedAt`
- `podcasts` : `id`, `title`, `description`, `duration`, `url`, `size`, `uploadedAt`
- `contactMessages` : `id`, `name`, `email`, `phone`, `subject`, `message`, `acceptedConsent`, `createdAt`
- `photos` : `id`, `section`, `title`, `description`, `url`, `size`, `orientation`, `width`, `height`, `featured`, `uploadedAt`

## Priorités et corrections obligatoires
1. **Correction des bugs existants :**
   - Remplace les anciennes clés cassées (`childName`, `cycle`, `parentName`) par `elevePrenom` + `eleveNom`, `classe` et `parentNom` dans le tableau des pré-inscriptions.
   - Évite le double enregistrement lors du `POST /api/contact` en enregistrant une seule entrée propre incluant `acceptedConsent`.
2. **Modules à livrer dans l'admin :**
   - **Vue d'ensemble (KPI réels) :** Total pré-inscriptions (et répartition par `status`), total messages de contact, total documents publiés, total podcasts et total photos (remplacer la stat « Visites » non connectée par des métriques réelles de `db.json`).
   - **Gestion des Pré-inscriptions :** Tableau filtrable par `classe` et `status`, recherche par `reference`/`eleveNom`/`parentNom`, tiroir de détail complet, changement de statut (`en_attente`, `validee`, `refusee`) et export CSV.
   - **Galerie & Photos intelligentes :** Upload photo avec détection automatique de l'orientation (`landscape`, `portrait`, `square`), proposition automatique de `section` via IA / règles sémantiques (avec choix manuel possible), compression/conversion WebP côté serveur (`sharp`), suppression du fichier physique lors du `DELETE`, et affichage public via `<SmartPhotoGrid section="..." />` adapté à la disposition.
   - **Gestion des Documents & Podcasts :** Interfaces CRUD complètes connectées aux routes Express/Multer existantes.
   - **Messages de contact :** Liste triée par `createdAt`, lecture complète, statut traité/non traité et suppression.
