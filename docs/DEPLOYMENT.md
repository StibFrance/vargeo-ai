# Déploiement VarGéo.AI V2

## Architecture active

La production est isolée de STIB One et repose sur :

- dépôt GitHub `StibFrance/vargeo-ai` ;
- projet Railway `VarGeo AI` ;
- service web Railway `vargeo-ai-web` ;
- service PostgreSQL Railway dédié ;
- domaine `vargeo.ai` ;
- Preview Vercel automatique pour les pull requests.

Ne pas réutiliser la base ou les secrets de STIB One.

## Procédure de livraison

1. Développer sur une branche dédiée.
2. Ouvrir une pull request.
3. Attendre un état Vercel Preview `Ready`.
4. Fusionner sur `main`.
5. Déclencher/observer le déploiement Railway.
6. Le pre-deploy exécute automatiquement `npm run db:migrate`.
7. Exiger un état Railway final `SUCCESS`.
8. Contrôler les logs : migrations, compilation Next.js et démarrage.
9. Vérifier le healthcheck `/api/health`.
10. Ne considérer la livraison terminée qu'après ces contrôles.

## Variables indispensables

### Application

- `DATABASE_URL`
- `DATABASE_URL_UNPOOLED`
- `AUTH_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `NEXT_PUBLIC_APP_NAME`

### IA

- `AI_GATEWAY_BASE_URL`
- `AI_GATEWAY_API_KEY` — secret obligatoire pour activer les appels génératifs
- `AI_MODEL`
- `AI_MODEL_CRITIC`
- `AI_MODEL_SYNTHESIS`
- `AI_MODEL_FALLBACKS`
- `AI_MAX_QUESTION_CHARS`
- `AI_MAX_RUNS_PER_HOUR`
- `AI_MAX_CONCURRENT_RUNS`

La présence des modèles et de l'URL sans `AI_GATEWAY_API_KEY` ne rend pas l'IA active. L'interface affiche alors explicitement que la passerelle est en attente de clé.

## Migrations en production

Le service web possède le pre-deploy suivant :

`npm run db:migrate`

Les migrations sont idempotentes et enregistrées dans `schema_migrations`. Ne pas appliquer manuellement une migration déjà enregistrée.

## Stockage documentaire

Les documents techniques sont :

- enregistrés dans `knowledge_documents` ;
- découpés en passages dans `knowledge_chunks` ;
- recherchés avec l'index plein texte PostgreSQL ;
- conservés sous forme originale dans la base pour les fichiers actuellement limités à 20 Mo.

Un stockage objet pourra remplacer la conservation binaire en base ultérieurement sans modifier le modèle de recherche.

## Sécurité opérationnelle

- Cookies de session HttpOnly / SameSite=Strict.
- Limitation des tentatives de connexion.
- Cloisonnement des affaires par organisation et membres du projet.
- Calculs et rapports soumis à validation humaine.
- Documents traités comme données non fiables vis-à-vis des prompts.
- Quotas et concurrence limités pour les exécutions IA.
- Audit des exécutions, modèles et documents récupérés.
- Aucun secret ne doit être stocké dans le dépôt GitHub.
