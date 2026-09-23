# VarGeo.AI 1.0.1 - Release candidate

Date: 2026-09-23

## Ajouts

- Durcissement authentification et limitation des tentatives de connexion.
- Migration versionnee de la base et connexion directe pour les migrations.
- Endpoint `/api/health`.
- Headers HTTP de securite.
- Administration des utilisateurs internes.
- Export Word natif des rapports.
- Tests automatises des neuf moteurs et du generateur DOCX.
- CI GitHub preparee.
- Next.js aligne sur la version stable 16.3.5 et runtime cible Node.js 24.x.

## Verification locale possible dans cet environnement

- Tests des neuf moteurs: OK.
- Deux cas invalides: OK.
- Export DOCX: OK.
- Controle syntaxique TypeScript/TSX: OK.
- Build Next.js complet: non execute ici car l'environnement de calcul n'accede pas au registre npm.

## Blocage de mise en ligne

Le connecteur Vercel disponible est en lecture seule et ne permet pas de creer le projet `vargeo-ai` ni d'injecter ses variables. Le connecteur Neon courant exige un identifiant de projet et ne permet pas de creer/list­er un projet VarGeo.AI distinct. Aucun depot GitHub `StibFrance/vargeo-ai` n'est actuellement accessible en ecriture depuis cet environnement.
