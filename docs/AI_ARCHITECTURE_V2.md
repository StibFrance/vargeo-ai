# VarGéo.AI V2 — architecture multi-agents

## Objectif

Transformer le Copilot V1 en système expert traçable sans fusionner l'IA générative avec les moteurs de calcul déterministes M1 à M9.

## Principes

1. Les moteurs M1 à M9 restent la source des résultats numériques.
2. Les agents spécialisés interprètent, contrôlent et mettent en perspective les données disponibles.
3. Un agent contradicteur recherche activement les faiblesses, hypothèses alternatives et données manquantes.
4. Un agent qualité vérifie la cohérence avant synthèse.
5. Une réponse IA n'est jamais une validation d'ingénieur.
6. Chaque exécution est journalisée : utilisateur, affaire, agents, modèles, empreinte du prompt, sortie et statut.

## Chaîne V2

Question ingénieur
→ sélection d'agents métier
→ agents spécialisés
→ contrôle normatif
→ contradicteur
→ contrôle qualité
→ synthèse orchestrée
→ validation humaine

## Agents initiaux

- STRAT
- PRESSIO
- FONDA
- STAB
- SENSOR
- STRUCT
- ENVIRO
- HYDRO
- POLLU
- RGA
- NORM
- CRITIC
- QA

## Multi-modèles

La V2 accepte trois variables de modèle :

- AI_MODEL : modèle général / métier
- AI_MODEL_CRITIC : modèle optionnel pour le contradicteur
- AI_MODEL_SYNTHESIS : modèle optionnel pour le contrôle qualité et la synthèse

En l'absence de modèle spécialisé, les agents utilisent AI_MODEL.

## Traçabilité

Les tables `ai_runs` et `ai_agent_steps` enregistrent les exécutions. Les prompts complets ne sont pas dupliqués en base : une empreinte SHA-256 est conservée avec le modèle et les métadonnées d'exécution.

## Étapes suivantes

- ingestion documentaire et indexation RAG par affaire ;
- citations de sources au niveau des assertions ;
- outils de calcul appelables par les agents sans génération numérique libre ;
- jeux de tests de référence issus de dossiers anonymisés ;
- évaluations automatiques qualité / hallucination / conformité au périmètre ;
- routage multi-modèles par spécialité et arbitrage.
