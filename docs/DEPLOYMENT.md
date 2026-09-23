# Deploiement cible VarGeo.AI

## Isolation obligatoire

VarGeo.AI doit disposer de son propre projet Neon, de son propre projet Vercel et de ses propres secrets. Ne pas reutiliser le projet Neon `STIB One Production`, sa base `stib_one`, ni le projet Vercel `stib-france-live`.

## Ordre de mise en service

1. Creer le depot GitHub separe `StibFrance/vargeo-ai`.
2. Creer le projet Vercel separe `vargeo-ai`.
3. Creer le projet Neon separe `VarGeo AI Production` en Europe.
4. Recuperer une URL poolee pour `DATABASE_URL` et une URL directe pour `DATABASE_URL_UNPOOLED`.
5. Configurer `AUTH_SECRET` avec au moins 32 caracteres aleatoires.
6. Configurer `ADMIN_EMAIL` et un `ADMIN_PASSWORD` robuste uniquement pour l'initialisation.
7. Executer `npm run db:migrate` avec la connexion directe.
8. Executer `npm run db:seed` une seule fois pour initialiser l'administrateur.
9. Executer `npm run verify`.
10. Deployer une Preview Vercel, verifier `/api/health`, puis faire la recette fonctionnelle.
11. Promouvoir en Production uniquement apres validation des neuf modules.

## IA

Variables optionnelles : `AI_GATEWAY_BASE_URL`, `AI_GATEWAY_API_KEY`, `AI_MODEL`. Les neuf moteurs de calcul restent utilisables sans IA.

## Securite V1

- Sessions opaques, jetons hashes, cookie HttpOnly/SameSite=Strict.
- Limitation des tentatives de connexion : 5 echecs sur 15 minutes.
- Validation des calculs et approbation des rapports reservees aux ingenieurs et administrateurs.
- Portail client desactive tant que l'isolation par affaire n'est pas implementee et recetee.
- Endpoint de supervision : `GET /api/health`.
