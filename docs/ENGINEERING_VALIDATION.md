# Validation technique des moteurs

## Statut V1

Les moteurs sont conçus pour assister l'ingénieur et tracer les calculs. Ils ne doivent pas être considérés comme un logiciel de calcul certifié tant que les cas de validation internes et les comparaisons manuelles n'ont pas été signés.

### M1 STRAT
- Pondérations géométriques des paramètres par épaisseur.
- Usage : synthèse du modèle.
- Validation requise : zonage des unités géotechniques et valeurs caractéristiques.

### M2 PRESSIO
- `pl* = max(pl - p0, 0)`
- statistiques descriptives, écart-type, médiane, fractile 5 % indicatif.
- Le fractile 5 % n'est pas automatiquement une valeur caractéristique normative.

### M3 FONDA
- Facteurs `Nq`, `Nc`, `Nγ` de type capacité portante classique.
- Tassement élastique simplifié `s = q B (1-ν²) / E`.
- À compléter pour validation NF P 94-261/262 : facteurs partiels, coefficients de forme/profondeur/inclinaison, stratification, nappe, excentricités, groupes, frottement latéral et cas micropieux/pieux détaillés.

### M4 STAB
- Coefficient actif Rankine `Ka = tan²(45°-φ/2)`.
- Poussée sol, surcharge, eau.
- Indicateurs glissement, renversement, excentricité et contraintes sous base.
- À compléter : stabilité globale, séisme, interfaces, phasage, géométrie réelle, drainage, facteurs partiels.

### M5 SENSOR
- Variation cumulée, min/max, tendance linéaire par jour, seuils de vigilance et d'alerte.
- Les seuils sont spécifiques au plan d'instrumentation de chaque ouvrage.

### M6 STRUCT
- Combinaison ULS simplifiée `1.35 Gk + 1.5 Qk`.
- Réaction d'appui poutre simplement appuyée et pression moyenne sous semelle.
- À compléter par modèle structurel et combinaisons Eurocodes applicables.

### M7 ENVIRO
- Matrice interne : `probabilité × gravité × (1 - maîtrise)`.
- Outil de priorisation, non substitutif aux prescriptions réglementaires.

### M8 HYDRO
- Darcy : `k = Q L / (A Δh)`.
- Thiem simplifié : transmissivité à partir de débit, rabattement et rayons.
- À compléter selon régime, anisotropie, limites et méthode d'essai.

### M9 POLLU
- Ratio concentration / valeur de comparaison.
- Estimation de masse de contaminant à partir de la masse de sol.
- La valeur de comparaison doit être définie selon le contexte SSP et l'usage.

## Recette avant usage réel

Chaque moteur doit faire l'objet d'au moins :
1. un cas manuel de référence ;
2. un cas limite ;
3. un cas avec données invalides ;
4. un contrôle indépendant ;
5. une fiche de validation signée et versionnée.
