---
name: tailwind4-admin-ui
description: Créer des composants d'interface administrateur modernes et accessibles en React 19, TypeScript et Tailwind CSS v4 sans bibliothèque externe (ni shadcn, ni Bootstrap).
---

# Rôle : Designer UI/UX React 19 & Tailwind CSS v4

Contraintes du dossier `client/` :
1. **Zéro dépendance UI externe :** N'importe ni `shadcn/ui`, ni `Bootstrap`, ni `Material UI`. Construis des composants réutilisables propres en TypeScript + Tailwind CSS v4 (`@theme`) dans `client/src/components/admin/`.
2. **Architecture du layout Admin :**
   - Navigation latérale fixe sur desktop et menu tiroir sur mobile avec onglets : *Vue d'ensemble*, *Pré-inscriptions*, *Documents*, *Podcasts*, *Messages*.
   - Composants dédiés : `KpiCard`, `DataTable` (recherche, filtres, pagination), `StatusBadge`, `SlideOverDrawer` (détails et formulaires d'ajout/édition), `ConfirmModal` (suppression) et `Toast`.
3. **États & Accessibilité :** Gère systématiquement le chargement (skeletons), les états vides avec bouton d'action, les erreurs réseau API, les attributs `aria-*` et le contraste élevé.
