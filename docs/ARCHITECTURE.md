# Architecture VarGéo.AI V1

## Couches

1. **Interface Next.js** : tableau de bord, affaires, modules, rapports, assistant.
2. **Authentification serveur** : mot de passe scrypt, sessions opaques hachées, cookie HttpOnly/SameSite=Strict.
3. **Lakebase Postgres / Neon** : affaires, essais, analyses, rapports, audit.
4. **Moteurs déterministes M1-M9** : fonctions pures dans `src/lib/calculations.ts`.
5. **Couche IA optionnelle** : uniquement pour synthèse, contrôle rédactionnel et interrogation du dossier. Elle ne modifie pas les résultats numériques.
6. **Validation humaine** : statut `draft` -> `validated` pour les calculs et `draft` -> `approved` pour les rapports.

## Traçabilité

Chaque analyse conserve :
- les entrées brutes ;
- les résultats ;
- les références ;
- la version du moteur ;
- l'auteur ;
- le validateur et la date de validation.

Les actions sensibles alimentent `audit_log`.

## Déploiement cible

- Frontend/API : Vercel
- Base : projet Neon séparé `VarGeo AI Production`
- IA : passerelle OpenAI-compatible via variables d'environnement
- Domaine futur : `app.vargeo.ai` ou sous-domaine équivalent

La base STIB One existante ne doit pas être réutilisée pour la production VarGéo.AI.
