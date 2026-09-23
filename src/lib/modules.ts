export type InputField = {
  name: string;
  label: string;
  type: "number" | "text" | "textarea";
  unit?: string;
  placeholder?: string;
  defaultValue?: string | number;
};

export type ModuleDefinition = {
  code: `M${number}`;
  slug: string;
  title: string;
  short: string;
  description: string;
  standards: string[];
  fields: InputField[];
  caution: string;
};

export const MODULES: ModuleDefinition[] = [
  {
    code: "M1", slug: "strat", title: "STRAT", short: "Modèle géotechnique",
    description: "Construction et synthèse du modèle stratigraphique, pondération des paramètres et contrôle de cohérence des horizons.",
    standards: ["NF P 94-500", "NF EN ISO 22475-1", "EN 1997-2"],
    fields: [{ name: "horizons", label: "Horizons", type: "textarea", placeholder: "Nom;épaisseur(m);γ(kN/m³);φ(°);c(kPa);Em(MPa);pl*(MPa)\nArgile;2.5;19;22;15;8;0.9" }],
    caution: "La synthèse pondérée aide à structurer le modèle. Le choix des valeurs de calcul reste une décision d'ingénieur."
  },
  {
    code: "M2", slug: "pressio", title: "PRESSIO", short: "Essais pressiométriques",
    description: "Interprétation des séries Em, pl, p0, calcul de pl* et indicateurs statistiques avec détection des valeurs atypiques.",
    standards: ["NF P 94-110-1", "EN 1997-2"],
    fields: [{ name: "pressio", label: "Essais", type: "textarea", placeholder: "Profondeur(m);Em(MPa);pl(MPa);p0(MPa)\n1;8.5;1.15;0.08" }],
    caution: "Le fractile calculé est un indicateur statistique et ne constitue pas à lui seul une valeur caractéristique normative."
  },
  {
    code: "M3", slug: "fonda", title: "FONDA", short: "Fondations",
    description: "Pré-dimensionnement de fondations superficielles : capacité portante, pression admissible et tassement élastique simplifié.",
    standards: ["NF P 94-261", "NF P 94-262", "EN 1997-1", "DTU 13.1"],
    fields: [
      {name:"B",label:"Largeur B",type:"number",unit:"m",defaultValue:1.2},{name:"L",label:"Longueur L",type:"number",unit:"m",defaultValue:1.2},
      {name:"D",label:"Profondeur d'assise D",type:"number",unit:"m",defaultValue:0.8},{name:"gamma",label:"Poids volumique γ",type:"number",unit:"kN/m³",defaultValue:19},
      {name:"phi",label:"Angle φ'",type:"number",unit:"°",defaultValue:28},{name:"c",label:"Cohésion c'",type:"number",unit:"kPa",defaultValue:0},
      {name:"servicePressure",label:"Pression de service",type:"number",unit:"kPa",defaultValue:150},{name:"FS",label:"Coefficient global de sécurité",type:"number",defaultValue:3},
      {name:"Em",label:"Module de déformation",type:"number",unit:"MPa",defaultValue:15},{name:"nu",label:"Coefficient de Poisson",type:"number",defaultValue:0.3}
    ],
    caution: "Méthode analytique de pré-dimensionnement. Les vérifications NF P 94-261/262 complètes, facteurs partiels et effets de groupe doivent être validés au cas par cas."
  },
  {
    code: "M4", slug: "stab", title: "STAB", short: "Stabilité / soutènements",
    description: "Vérifications simplifiées glissement, renversement et contraintes sous base pour un soutènement gravitaire.",
    standards: ["EN 1997-1", "NF P 94-281"],
    fields: [
      {name:"H",label:"Hauteur retenue",type:"number",unit:"m",defaultValue:2},{name:"phi",label:"Angle de frottement du remblai",type:"number",unit:"°",defaultValue:30},
      {name:"gamma",label:"Poids volumique remblai",type:"number",unit:"kN/m³",defaultValue:19},{name:"surcharge",label:"Surcharge uniforme",type:"number",unit:"kPa",defaultValue:10},
      {name:"waterHeight",label:"Hauteur d'eau",type:"number",unit:"m",defaultValue:0},{name:"baseWidth",label:"Largeur de base",type:"number",unit:"m",defaultValue:1.4},
      {name:"wallWeight",label:"Poids du mur par ml",type:"number",unit:"kN/m",defaultValue:55},{name:"baseFriction",label:"Coefficient de frottement base",type:"number",defaultValue:0.55},
      {name:"baseCohesion",label:"Cohésion mobilisable en base",type:"number",unit:"kPa",defaultValue:0}
    ],
    caution: "La stabilité générale, les surfaces de rupture profondes, la sismicité et les combinaisons de calcul détaillées ne sont pas remplacées par ce contrôle local."
  },
  {
    code: "M5", slug: "sensor", title: "SENSOR", short: "Instrumentation",
    description: "Analyse de séries instrumentées, tendance linéaire, amplitude, seuils et classement automatique de l'alerte.",
    standards: ["Procédures internes QSE", "EN 1997-1 - méthode observationnelle"],
    fields: [
      {name:"sensorType",label:"Type de capteur",type:"text",defaultValue:"Fissurimètre"},{name:"unit",label:"Unité",type:"text",defaultValue:"mm"},
      {name:"warningThreshold",label:"Seuil vigilance",type:"number",defaultValue:2},{name:"alertThreshold",label:"Seuil alerte",type:"number",defaultValue:4},
      {name:"series",label:"Série de mesures",type:"textarea",placeholder:"2026-09-01;0.0\n2026-09-08;0.4\n2026-09-15;0.7"}
    ],
    caution: "Les seuils doivent être définis pour chaque ouvrage et chaque capteur dans le plan d'instrumentation."
  },
  {
    code: "M6", slug: "struct", title: "STRUCT", short: "Structure / interaction sol-structure",
    description: "Descente de charges simplifiée et contrôle de pression de service transmis aux fondations.",
    standards: ["EN 1990", "EN 1991", "EN 1992", "Décret 2025-814"],
    fields: [
      {name:"span",label:"Portée",type:"number",unit:"m",defaultValue:5},{name:"tributaryWidth",label:"Largeur tributaire",type:"number",unit:"m",defaultValue:3},
      {name:"deadLoad",label:"Charges permanentes Gk",type:"number",unit:"kN/m²",defaultValue:6},{name:"liveLoad",label:"Charges variables Qk",type:"number",unit:"kN/m²",defaultValue:2.5},
      {name:"serviceAxial",label:"Effort vertical de service",type:"number",unit:"kN",defaultValue:350},{name:"footingB",label:"Semelle B",type:"number",unit:"m",defaultValue:1.6},
      {name:"footingL",label:"Semelle L",type:"number",unit:"m",defaultValue:1.6}
    ],
    caution: "Outil de cohérence et de transfert des charges. Il ne remplace pas une note de calcul structure complète."
  },
  {
    code: "M7", slug: "enviro", title: "ENVIRO", short: "Environnement",
    description: "Registre de risques environnementaux, criticité et hiérarchisation des mesures de maîtrise.",
    standards: ["ISO 14001 - principes", "Procédures chantier / QSE"],
    fields: [{name:"risks",label:"Risques",type:"textarea",placeholder:"Risque;probabilité(1-5);gravité(1-5);maîtrise(0-100%)\nRejet boues;3;4;50"}],
    caution: "Le score aide à hiérarchiser. Les obligations réglementaires applicables au site restent à vérifier séparément."
  },
  {
    code: "M8", slug: "hydro", title: "HYDRO", short: "Hydrogéologie",
    description: "Perméabilité par loi de Darcy et estimation de transmissivité par relation de Thiem en régime simplifié.",
    standards: ["EN 1997-2", "NF EN ISO 22282 - selon essai"],
    fields: [
      {name:"Q",label:"Débit Darcy Q",type:"number",unit:"m³/s",defaultValue:0.0002},{name:"length",label:"Longueur d'écoulement L",type:"number",unit:"m",defaultValue:1},
      {name:"area",label:"Section A",type:"number",unit:"m²",defaultValue:0.01},{name:"headLoss",label:"Perte de charge Δh",type:"number",unit:"m",defaultValue:0.5},
      {name:"pumpQ",label:"Débit de pompage",type:"number",unit:"m³/s",defaultValue:0.002},{name:"drawdown",label:"Rabattement s",type:"number",unit:"m",defaultValue:1.2},
      {name:"radius",label:"Rayon d'observation r",type:"number",unit:"m",defaultValue:20},{name:"wellRadius",label:"Rayon du puits rw",type:"number",unit:"m",defaultValue:0.1},
      {name:"aquiferThickness",label:"Épaisseur aquifère",type:"number",unit:"m",defaultValue:8}
    ],
    caution: "Les relations utilisées supposent un milieu homogène et des conditions hydrauliques simplifiées."
  },
  {
    code: "M9", slug: "pollu", title: "POLLU", short: "Sites et sols pollués",
    description: "Comparaison concentration/seuil de projet et estimation de masse de contaminant dans un volume de sol.",
    standards: ["Méthodologie nationale SSP", "Référentiels analytiques du projet"],
    fields: [
      {name:"substance",label:"Substance",type:"text",defaultValue:"Hydrocarbures C10-C40"},{name:"concentration",label:"Concentration mesurée",type:"number",unit:"mg/kg",defaultValue:650},
      {name:"threshold",label:"Valeur de comparaison projet",type:"number",unit:"mg/kg",defaultValue:500},{name:"soilDensity",label:"Masse volumique du sol",type:"number",unit:"t/m³",defaultValue:1.8},
      {name:"volume",label:"Volume concerné",type:"number",unit:"m³",defaultValue:120}
    ],
    caution: "Une valeur de comparaison n'est pas automatiquement un seuil réglementaire de danger. L'interprétation SSP dépend de l'usage et du schéma conceptuel."
  }
];

export function getModuleBySlug(slug: string) {
  return MODULES.find((m) => m.slug === slug) ?? null;
}
