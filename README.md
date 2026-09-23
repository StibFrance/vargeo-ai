# VarGeo.AI V1 professionnelle

Plateforme web d'ingenierie geotechnique assistee par IA, organisee autour de neuf modules : STRAT, PRESSIO, FONDA, STAB, SENSOR, STRUCT, ENVIRO, HYDRO et POLLU.

## Fonctionnalites V1

- Authentification serveur securisee par scrypt et sessions opaques hashees.
- Limitation des tentatives de connexion et cookies HttpOnly/SameSite=Strict.
- Gestion des affaires et des clients.
- Neuf moteurs deterministes M1 a M9, independants de la couche IA.
- Journal des entrees, resultats, versions moteur et references normatives.
- Validation ingenieur des calculs et approbation des rapports.
- Generation de rapports G1 ES, G1 PGC, G2 AVP, G2 PRO, G3, G4, G5, Expertise RGA et Note technique.
- Export Word natif `.docx` et impression/PDF depuis le navigateur.
- Assistant VarGeo.AI optionnel via passerelle OpenAI-compatible.
- Administration des utilisateurs internes.
- Journal d'audit et endpoint de supervision `/api/health`.

## Architecture

- Next.js 16.3.5 / React 19.3.0
- Node.js 24.x cible
- Lakebase Postgres sur Neon via `@neondatabase/serverless` 1.1.0
- Vercel pour le frontend et les routes serveur
- Projet Neon et projet Vercel obligatoirement separes de STIB One

## Installation

1. Copier `.env.example` vers `.env.local`.
2. Renseigner `DATABASE_URL`, `DATABASE_URL_UNPOOLED`, `AUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`.
3. `npm install`
4. `npm run db:migrate`
5. `npm run db:seed`
6. `npm run verify`
7. `npm run dev`

## Securite et responsabilite technique

Les calculs sont en statut `draft` tant qu'un ingenieur ne les a pas valides. Les moteurs M3, M4, M6 et M8 restent des moteurs de pre-dimensionnement a completer par les verifications normatives detaillees de chaque dossier. Le portail client est volontairement desactive dans cette V1 tant que l'isolation par affaire n'a pas ete recetee.

## Deploiement

Voir `docs/DEPLOYMENT.md`. Le projet cible est Vercel + Neon, avec base, secrets et environnement independants de STIB One.
