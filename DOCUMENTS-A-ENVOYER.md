# Documents à envoyer au Groupe Scolaire Daniélou Abidjan

> Remplace les champs entre crochets `[…]`. Je ne connais ni ta raison sociale, ni ton NIF, ni ton numéro de facture : **ne les invente pas**, demande-les à ton comptable.

---

## 1. Prix conseillé (à toi de trancher)

Le site livré comprend : 20+ pages publiques, galerie et lightbox, espace admin complet (6 modules), authentification Supabase, base PostgreSQL, API Express déployée sur Fly.io, front sur Vercel, emails Resend, pages légales, responsive, accessibilité Lighthouse 100/100, tests navigateur 375/768/1280.

| Option | Montant conseillé | Ce que l'école paie |
|---|---|---|
| A. Développement seul | **300 000 FCFA** | Elle paie en plus le domaine et l'hébergement (~50 000–80 000 FCFA/an, à vérifier) |
| **B. Recommandé — tout compris 12 mois** | **450 000 FCFA** | **Rien d'autre pendant 12 mois** : domaine, Vercel, Fly.io, Supabase et Resend inclus |
| C. Tout compris + formation + maintenance 12 mois | **600 000 FCFA** | Rien d'autre, avec 2 h de formation au secrétariat et suivi pendant un an |

⚠️ Vérifie avant d'envoyer le devis : ton projet Vercel est sous l'organisation `angelin-projet`. Si ton abonnement Vercel est payant, ajoute son coût réel dans l'option B — je ne peux pas le connaître à ta place.

À partir de l'année 2 (option B) : prévoir **~50 000 à 80 000 FCFA/an** de reconduction (domaine + infrastructure), à valider avec les factures réelles.

> Ce sont des recommandations commerciales, pas un avis comptable ou fiscal. Fais valider le montant et la mention de TVA par un comptable avant d'émettre la facture.

---

## 2. Modèle de devis (à envoyer avec le lien)

```
[VOTRE RAISON SOCIALE]
[Adresse] · [Téléphone] · [Email] · NIF [VOTRE NIF]

DEVIS N° [ANNÉE-001]
À l'attention de : Direction du Groupe Scolaire Madeleine-Daniélou Abidjan
Date : [DATE]

Objet : Refonte et mise en ligne du site institutionnel GSMD Abidjan

Désignation                                                   Montant HT
-------------------------------------------------------------------------
Conception et développement du site (20+ pages, responsive)   [………] FCFA
Espace d'administration sécurisé (6 modules, Supabase Auth)   [………] FCFA
Galerie photos intelligente et lightbox                       [………] FCFA
Hébergement, domaine et services associés — 12 mois           [………] FCFA
Mise en conformité (mentions légales, confidentialité)        [………] FCFA
-------------------------------------------------------------------------
Total HT                                                      [………] FCFA
TVA [taux si applicable]                                      [………] FCFA
Total TTC                                                     450 000 FCFA

Validité du devis : 30 jours.
Paiement : [50 % à la commande / 50 % à la recette], par [virement / espèces / mobile money].
```

---

## 3. Champs obligatoires sur la facture (Côte d'Ivoire)

À faire valider par ton comptable, en général :

- Raison sociale ou nom complet du prestataire
- Adresse physique, téléphone, email
- **NIF** (numéro d'identification fiscale)
- Numéro et date de facture
- Nom et adresse du client (GSMD Abidjan)
- Désignation précise des prestations
- Montant HT, taux et montant de la TVA si assujetti, **total TTC**
- Mode de paiement et échéance
- Cachet / signature

Modèle court :

```
FACTURE N° [..] du [DATE]
[VOTRE RAISON SOCIALE] — NIF [..]
Client : Groupe Scolaire Madeleine-Daniélou Abidjan

Prestation : développement et mise en ligne du site institutionnel
Montant HT : [..] FCFA — TVA [..] : [..] FCFA
Total TTC : [..] FCFA
Payé par : [..] — Solde : [..] FCFA
```

---

## 4. Email d'envoi du lien (copie-colle)

```
Objet : Site du Groupe Scolaire Daniélou Abidjan — version en ligne

Madame, Monsieur,

Je vous adresse la version en ligne du site du Groupe Scolaire Madeleine-Daniélou Abidjan :

https://madeleinedanielou.vercel.app

Vous y trouverez les pages institutionnelles, les enseignements, la galerie photos,
le formulaire de pré-inscription et l'espace de gestion réservé au secrétariat.

Lors de notre entretien, je vous remettrai le devis détaillé et je recueillerai les
informations nécessaires à la finalisation : nom de domaine, mentions légales
(hébergeur, directeur de publication), durées de conservation et contenus officiels.

Cordialement,
[VOTRE NOM] — [TÉLÉPHONE]
```

---

## 5. Documents à demander à l'école (checklist de l'entretien)

1. Nom de domaine exact + personne qui gère le DNS chez le registrar.
2. Nom et qualité du **directeur de publication**.
3. Coordonnées de l'**hébergeur actuel** (contrat ou facture d'hébergement).
4. **Durées de conservation** des dossiers et messages.
5. **Récépissé ARTCI** (numéro + date) si une déclaration existe.
6. **Autorisations de droit à l'image** des élèves (portée : site web / réseaux sociaux).
7. Vrais **PDF/audios officiels**, planning 2026-2027, mot de la Direction.
8. URL Facebook officielle, liste des partenaires, statut UNESCO.
9. Décision sur les **rôles admin** (direction, secrétariat, communication) et emails.

---

## 6. Livrables à remettre avec le site

- [ ] Lien public : https://madeleinedanielou.vercel.app
- [ ] Devis signé + facture (selon options ci-dessus)
- [ ] `DEPLOIEMENT-DOMAINE.md` (procédure technique, pour toi — pas forcément à transmettre)
- [ ] `RAPPORT-FINAL.md` (ce qui a été fait et ce qui reste, à donner en pièce jointe si tu veux être transparent)
- [ ] Accès admin : **ne jamais envoyer le mot de passe par email** — créer le compte directement dans Supabase Auth et donner le mode opératoire oralement ou via un lien de réinitialisation.
- [ ] Attestation d'hébergement / domaine : à demander à ton fournisseur une fois le domaine installé.
