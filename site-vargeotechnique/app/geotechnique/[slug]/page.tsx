import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

const areas = {
  "var-83": { name: "Var", num: "83", cities: "Toulon, Draguignan, Fréjus, Brignoles, Hyères, Saint-Maximin-la-Sainte-Baume", context: "terrains argileux, reliefs calcaires, zones littorales, remblais et projets en secteurs urbains ou à accès contraint" },
  "bouches-du-rhone-13": { name: "Bouches-du-Rhône", num: "13", cities: "Marseille, Aix-en-Provence, Aubagne, Salon-de-Provence, Arles", context: "formations calcaires, alluvions, remblais, argiles et contextes urbains denses" },
  "alpes-maritimes-06": { name: "Alpes-Maritimes", num: "06", cities: "Nice, Cannes, Antibes, Grasse, Vence, Cagnes-sur-Mer", context: "fortes pentes, terrains rocheux ou hétérogènes, soutènements, accès complexes et proximité du bâti existant" },
  "vaucluse-84": { name: "Vaucluse", num: "84", cities: "Avignon, Orange, Carpentras, Cavaillon, Pertuis", context: "alluvions, argiles, remblais, terrasses et projets de maisons, bâtiments ou infrastructures" },
  "alpes-de-haute-provence-04": { name: "Alpes-de-Haute-Provence", num: "04", cities: "Digne-les-Bains, Manosque, Sisteron, Forcalquier", context: "reliefs, terrains marneux ou calcaires, versants, phénomènes de retrait-gonflement et accès spécifiques" },
  "hautes-alpes-05": { name: "Hautes-Alpes", num: "05", cities: "Gap, Briançon, Embrun", context: "reliefs alpins, pentes, formations rocheuses, colluvions et contraintes climatiques ou d'accès" }
} as const;

type Slug = keyof typeof areas;
export function generateStaticParams() { return Object.keys(areas).map((slug) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = areas[slug as Slug];
  if (!a) return {};
  return {
    title: `Bureau d'études géotechniques ${a.name} (${a.num})`,
    description: `Études de sol et missions géotechniques G1 à G5 dans le ${a.name} (${a.num}) : G2 PRO, G5 fissures/RGA, sondages, pressiomètre, fondations et suivi.`,
    alternates: { canonical: `/geotechnique/${slug}` }
  };
}

export default async function AreaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = areas[slug as Slug];
  if (!a) notFound();
  return (
    <main className="contentShell">
      <div className="innerHeader"><div className="wrap nav"><Link className="brand" href="/">VAR GÉOTECHNIQUE</Link><Link className="button compact" href="/#contact">Demander une étude</Link></div></div>
      <section className="innerHero"><div className="wrap"><div className="breadcrumbs"><Link href="/">Accueil</Link> / Géotechnique / {a.name}</div><h1>Bureau d'études géotechniques dans le {a.name} ({a.num})</h1><p>Var Géotechnique intervient dans tout le département pour les études de sol, investigations géotechniques, diagnostics de fissures et missions G1 à G5.</p></div></section>
      <div className="wrap contentGrid">
        <article className="prose">
          <h2>Études de sol et géotechnique dans le {a.name}</h2>
          <p>Nous accompagnons les particuliers et les professionnels à {a.cities}, ainsi que dans l'ensemble du département. Le programme d'investigations est adapté au projet, au contexte géologique, à l'environnement bâti et aux contraintes d'accès.</p>
          <p>Les problématiques rencontrées peuvent notamment concerner {a.context}. L'objectif est de transformer les données de terrain en hypothèses de calcul et recommandations clairement exploitables par la maîtrise d'ouvrage, l'architecte, le BET structure ou l'entreprise.</p>
          <h2>Missions proposées</h2>
          <ul><li>G1 ES / PGC pour l'étude préalable et les projets concernés par la loi ELAN.</li><li>G2 AVP et G2 PRO pour définir et dimensionner les solutions de fondation.</li><li>G3 et G4 pour l'étude, le suivi et la supervision géotechnique des travaux.</li><li>G5 pour les fissures, tassements, retrait-gonflement des argiles et désordres sur ouvrages existants.</li><li>Sondages, carottages, pressiomètre, pénétromètre et reconnaissance de fondations.</li></ul>
          <h2>Pourquoi une étude locale et proportionnée ?</h2>
          <p>Une étude géotechnique pertinente ne se résume pas à une carte géologique. Elle croise le projet, la géologie, la topographie, l'eau, les ouvrages voisins et des investigations dimensionnées en fonction du niveau de risque. Cette approche permet de réduire les incertitudes avant travaux et d'éviter des choix de fondation inadaptés.</p>
          <h2>Intervention en sécurité</h2>
          <p>Nos équipes sont formées et habilitées SS4 pour les interventions concernées. Var Géotechnique est par ailleurs en cours de certification M.A.S.E.</p>
        </article>
        <aside><div className="sideCard"><h3>Projet dans le {a.name} ?</h3><p>Envoyez-nous l'adresse, la nature du projet et vos plans disponibles. Nous vous proposons la mission adaptée et un programme d'investigations cohérent.</p><a className="button" href={`mailto:contact@stibfrance.fr?subject=Étude%20géotechnique%20${encodeURIComponent(a.name)}%20${a.num}`}>Demander un devis</a><p>04 65 84 42 89<br/>181 chemin des Fontaites<br/>83170 La Celle</p></div></aside>
      </div>
    </main>
  );
}
