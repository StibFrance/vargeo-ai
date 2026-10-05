import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

const missions = {
  "g1": { label: "G1", title: "Étude géotechnique préalable G1", intro: "Connaître le contexte géologique et les risques du site avant de concevoir ou vendre un terrain.", points: ["Étude de Site (ES) et Principes Généraux de Construction (PGC)", "Analyse documentaire et contexte géologique", "Identification des risques géotechniques majeurs", "Programme d'investigations si nécessaire", "Préconisations générales adaptées au stade préalable"] },
  "g2-avp": { label: "G2 AVP", title: "Étude géotechnique de conception – Avant-Projet", intro: "Caractériser le sol sous le projet et définir les hypothèses géotechniques nécessaires au choix des fondations.", points: ["Programme d'investigations adapté au projet", "Modèle géotechnique et stratigraphie", "Portance, tassements et sensibilité aux variations hydriques", "Principes de fondations et terrassements", "Premières recommandations de drainage et gestion des eaux"] },
  "g2-pro": { label: "G2 PRO", title: "Étude géotechnique de conception – Projet", intro: "Passer des principes au dimensionnement : valeurs de calcul, solutions de fondation et dispositions constructives.", points: ["Dimensionnement géotechnique des fondations", "Justification des niveaux d'assise et ancrages", "Fondations superficielles, radier, micropieux selon besoin", "Terrassements, soutènements et dallages", "Données exploitables par le BET structure et le DCE"] },
  "g3": { label: "G3", title: "Étude et suivi géotechniques d'exécution", intro: "Accompagner l'entreprise et le chantier afin d'adapter l'exécution aux conditions effectivement rencontrées.", points: ["Étude géotechnique d'exécution", "Vérification des hypothèses en phase travaux", "Suivi des terrassements et fondations", "Adaptation technique en cas d'écart", "Traçabilité des observations et décisions"] },
  "g4": { label: "G4", title: "Supervision géotechnique d'exécution", intro: "Apporter un regard indépendant sur l'étude et le suivi géotechniques réalisés en phase exécution.", points: ["Supervision de l'étude d'exécution", "Avis sur notes, plans et hypothèses", "Supervision du suivi géotechnique de chantier", "Analyse des écarts et adaptations proposées", "Synthèse de conformité géotechnique"] },
  "g5": { label: "G5", title: "Diagnostic géotechnique G5 – fissures, RGA et désordres", intro: "Identifier la cause géotechnique d'un désordre précis sur un ouvrage existant et orienter les suites techniques.", points: ["Fissures, tassements et mouvements", "Retrait-gonflement des argiles / sécheresse", "Reconnaissance des fondations existantes", "Sondages, pressiomètre et analyses ciblées", "Principes de réparation et besoin éventuel d'une G2 PRO"] }
} as const;

type Slug = keyof typeof missions;
export function generateStaticParams() { return Object.keys(missions).map((slug) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const m = missions[slug as Slug]; if (!m) return {};
  return { title: `${m.label} – ${m.title}`, description: `${m.intro} Var Géotechnique intervient en région PACA pour particuliers et professionnels.`, alternates: { canonical: `/missions/${slug}` } };
}
export default async function MissionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const m = missions[slug as Slug]; if (!m) notFound();
  return <main className="contentShell">
    <div className="innerHeader"><div className="wrap nav"><Link className="brand" href="/">VAR GÉOTECHNIQUE</Link><Link className="button compact" href="/#contact">Demander une étude</Link></div></div>
    <section className="innerHero"><div className="wrap"><div className="breadcrumbs"><Link href="/">Accueil</Link> / Missions / {m.label}</div><h1>{m.title}</h1><p>{m.intro}</p></div></section>
    <div className="wrap contentGrid"><article className="prose"><h2>Objectif de la mission {m.label}</h2><p>{m.intro} La mission est cadrée en fonction du projet, des données disponibles, du niveau de conception et des risques géotechniques identifiés.</p><h2>Contenu possible</h2><ul>{m.points.map(p => <li key={p}>{p}</li>)}</ul><h2>Une étude proportionnée au risque</h2><p>Le programme d'investigations n'est pas standardisé : il doit être cohérent avec l'emprise, les charges, les avoisinants, la topographie, l'eau et les incertitudes géologiques. Cette logique permet de produire un rapport utile à la décision et au dimensionnement.</p><h2>Interventions en PACA</h2><p>Var Géotechnique intervient dans le Var, les Bouches-du-Rhône, les Alpes-Maritimes, le Vaucluse, les Alpes-de-Haute-Provence et les Hautes-Alpes.</p></article><aside><div className="sideCard"><h3>Besoin d'une {m.label} ?</h3><p>Adresse du projet, plans, type d'ouvrage et calendrier : transmettez-nous les éléments disponibles pour un cadrage rapide.</p><a className="button" href={`mailto:contact@stibfrance.fr?subject=Demande%20${encodeURIComponent(m.label)}%20-%20Var%20Géotechnique`}>Demander un devis</a><p>04 65 84 42 89<br/>contact@stibfrance.fr</p></div></aside></div>
  </main>;
}
