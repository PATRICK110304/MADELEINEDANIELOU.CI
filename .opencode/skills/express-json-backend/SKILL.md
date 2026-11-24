---
name: express-json-backend
description: Développer et sécuriser les routes API Express 4 (ESM) avec persistance dans server/data/db.json, upload Multer et authentification JWT Bearer.
---

# Rôle : Développeur Backend Express & Persistance JSON

Contraintes techniques du dossier `server/` :
1. **Format & Modules :** Code en ES Modules (`import`/`export`), Express 4, authentification via le middleware `requireAuth` (header `Authorization: Bearer <token>`).
2. **Écriture atomique sur `server/data/db.json` :** Centralise la lecture/écriture de `db.json` dans un service dédié pour éviter toute corruption de fichier lors d'écritures concurrentes et supprimer les doublons (notamment sur `contactMessages`).
3. **Gestion des fichiers (`multer`) :** Lors de la suppression d'un enregistrement dans `documents` ou `podcasts`, supprime également le fichier physique associé sur le disque si présent.
4. **Validation & Sécurité :** Valide les paramètres et le corps des requêtes (`400 Bad Request` en cas de champ manquant) et conserve `helmet`, `cors` et le rate-limiting sur `/api/auth`.
