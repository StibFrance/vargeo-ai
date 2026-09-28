# VarGéo.AI V2 professionnelle

Plateforme web d'ingénierie géotechnique assistée par IA, structurée autour de neuf moteurs déterministes et d'un orchestrateur multi-agents.

## Fonctionnalités

- Authentification serveur sécurisée par scrypt et sessions opaques hachées.
- Cloisonnement des affaires par organisation et affectation des utilisateurs clients.
- Neuf moteurs déterministes M1 à M9 : STRAT, PRESSIO, FONDA, STAB, SENSOR, STRUCT, ENVIRO, HYDRO et POLLU.
- Validation ingénieur des calculs et approbation des rapports.
- Génération de rapports G1 ES, G1 PGC, G2 AVP, G2 PRO, G3, G4, G5, Expertise RGA et Note technique.
- Export Word natif `.docx` et impression/PDF depuis le navigateur.
- Orchestrateur multi-agents avec agents métier, contrôle normatif, contradicteur et contrôle qualité.
- Routage multi-modèles via une passerelle compatible OpenAI, avec fallbacks configurables.
- Mémoire documentaire par affaire : ingestion PDF/DOCX/texte, découpage en passages et recherche plein texte PostgreSQL.
- Citations documentaires `[SRC-n]` et protection contre les instructions cachées dans les documents.
- Conservation sécurisée du fichier original et téléchargement soumis aux droits d'accès de l'affaire.
- Journalisation des exécutions IA, modèles, statuts et consommation de tokens lorsqu'elle est fournie par la passerelle.
- Quotas d'usage et limite de concurrence par utilisateur.
- Tableau de supervision IA pour l'administration.
- Journal d'audit et endpoint de supervision `/api/health`.

## Architecture de production

- Next.js 16.3.5 / React 19.3.0.
- Node.js 24.x.
- PostgreSQL géré sur Railway.
- Application web de production sur Railway.
- Domaine de production : `vargeo.ai`.
- GitHub : `StibFrance/vargeo-ai`.
- Vercel est utilisé comme contrôle de Preview sur les pull requests avant fusion.
- Les migrations SQL sont exécutées automatiquement en pre-deploy par `npm run db:migrate`.

## Couche IA

La plateforme fonctionne sans IA pour les moteurs de calcul et la gestion des dossiers. Les appels génératifs nécessitent :

- `AI_GATEWAY_BASE_URL`
- `AI_GATEWAY_API_KEY`
- `AI_MODEL`

Variables complémentaires : `AI_MODEL_CRITIC`, `AI_MODEL_SYNTHESIS`, `AI_MODEL_FALLBACKS`, ainsi que les limites `AI_MAX_*`.

Aucune clé API ne doit être commise dans Git.

## Installation locale

1. Copier `.env.example` vers `.env.local`.
2. Renseigner les variables de base de données, `AUTH_SECRET`, `ADMIN_EMAIL` et `ADMIN_PASSWORD`.
3. `npm install`
4. `npm run db:migrate`
5. `npm run db:seed`
6. `npm run verify`
7. `npm run dev`

## Sécurité et responsabilité technique

Les résultats IA sont des analyses assistées et ne constituent jamais une validation réglementaire automatique. Les calculs restent en statut `draft` tant qu'un ingénieur habilité ne les a pas validés. Les moteurs de pré-dimensionnement doivent être complétés par les vérifications normatives adaptées au dossier réel.

Les contenus importés dans la base documentaire sont traités comme des données non fiables : une instruction contenue dans un PDF, DOCX ou autre source ne doit jamais prendre le contrôle de l'orchestrateur.

## Déploiement

Voir `docs/DEPLOYMENT.md`.
