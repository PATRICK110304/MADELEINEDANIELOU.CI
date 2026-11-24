# Procédure — ajout du nom de domaine et des informations de l'école

Ce document est la checklist à exécuter **quand l'école aura fourni** : le nom de domaine, les mentions légales, les durées de conservation et les contenus officiels. Aucune de ces valeurs n'est connue aujourd'hui : rien n'a été inventé.

Le site est dès à jour disponible sur `https://madeleinedanielou.vercel.app` et l'API sur `https://madeleinedanielou-api.fly.dev`.

## 1. Informations à demander à l'école (à l'entretien)

- [ ] Nom de domaine exact (ex. `madeleinedanielou.ci`) et souhaits sur `www`.
- [ ] Accès au registrar (gestion DNS) ou personne qui fera les enregistrements.
- [ ] Éditeur légal confirmé : Communauté Saint-François-Xavier (déjà renseigné).
- [ ] Directeur de publication : **nom et qualité**.
- [ ] Hébergeur : **nom, adresse, téléphone, email, lieu d'hébergement**.
- [ ] Durées de conservation : **pré-inscriptions, messages, journal d'audit**.
- [ ] Référence de la **déclaration ARTCI** et autorisations de **droit à l'image**.
- [ ] Vrai mot de la Direction, vrais PDF/audios officiels, planning des inscriptions 2026-2027.
- [ ] URL Facebook officielle, statut UNESCO, listeexacte des partenaires.
- [ ] Rôles admin souhaités (direction / secrétariat / communication) et emails associés.
- [ ] Adresse d'envoi Resend à utiliser (`groupescolaire@madeleinedanielou.ci` par défaut).

## 2. Ajouter le domaine sur Vercel

```bash
cd /home/patrick/Bureau/MADELEINEDANIELOU.CI
vercel domains add madeleinedanielou.ci
vercel domains add www.madeleinedanielou.ci
vercel domains ls
```

Puis, chez le registrar, ajouter les enregistrements indiqués par Vercel :
- `A` `@` → `76.76.21.21`
- `CNAME` `www` → `cname.vercel-dns.com`

(Utiliser les valeurs affichées par `vercel domains add`, elles font foi.)

`VITE_API_URL` reste l'URL Fly : pas de modification côté client.

## 3. Mettre à jour le CORS de l'API Fly

Le fichier `fly.toml` contient une valeur d'exemple. Appliquer le domaine réel :

```bash
flyctl secrets set CLIENT_URL="https://madeleinedanielou.ci,https://www.madeleinedanielou.ci" -a madeleinedanielou-api
flyctl apps restart madeleinedanielou-api
curl -s https://madeleinedanielou-api.fly.dev/api/health
```

Le script `scripts/configure-domain.sh <domaine>` fait les étapes 2 et 3 d'un seul coup.

## 4. Supabase Auth — URL Configuration

Dans **Supabase → Authentication → URL Configuration** :

- `Site URL` = `https://madeleinedanielou.ci`
- `Redirect URLs` = `https://madeleinedanielou.ci/**`, `https://www.madeleinedanielou.ci/**`, `http://localhost:5173/**`

À défaut, les liens magiques et confirmations d'email pointeront vers `localhost:3000`.

## 5. Resend — vérification du domaine

1. **Resend → Domains → Add Domain** : `madeleinedanielou.ci`.
2. Publier les enregistrements **SPF, DKIM et DMARC** fournis chez le registrar.
3. Cliquer sur **Verify**. Tant que le domaine n'est pas vérifié, les messages restent enregistrés dans Supabase avec `emailSent:false`.
4. Si l'adresse d'expédition change :

```bash
flyctl secrets set CONTACT_EMAIL_FROM="Groupe Scolaire Daniélou <adresse@domaine.ci>" -a madeleinedanielou-api
```

⚠️ La clé Resend actuelle a été partagée dans un chat : la régénérer puis `flyctl secrets set RESEND_API_KEY=...`.

## 6. Compléter les pages légales

Les blocs `À COMPLÉTER PAR L'ÉCOLE` sont masqués en production. Pour les voir en local,
poser `VITE_SHOW_LEGAL_PLACEHOLDERS=true` dans `client/.env.local`, remplacer les textes,
puis repasser le drapeau à `false`.

Fichiers concernés :

| Fichier | Champs |
|---|---|
| `client/src/pages/LegalNoticePage.tsx` | directeur de publication, hébergeur (nom/adresse/téléphone/email/lieu) |
| `client/src/pages/PrivacyPolicyPage.tsx` | durées de conservation, référence de déclaration ARTCI |

Puis : `npm run typecheck && npm run build` et `git commit` + `git push` (Vercel redéploie automatiquement via GitHub).

## 7. Vérification finale

```bash
curl -sI https://madeleinedanielou.ci | head -5
curl -s https://madeleinedanielou-api.fly.dev/api/health
npx lighthouse https://madeleinedanielou.ci --only-categories=accessibility
```

Contrôler aussi : formulaire de contact (email reçu), pré-inscription (ligne dans Supabase), login `/admin/dashboard`, galerie et lightbox.
