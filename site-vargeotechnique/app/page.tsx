import Image from "next/image";
import Link from "next/link";

const missions = [
  ["G1", "Étude géotechnique préalable", "Vente de terrain, étude de site et principes généraux de construction.", "/missions/g1"],
  ["G2 AVP", "Concevoir sur de bonnes bases", "Investigations et hypothèses géotechniques pour sécuriser l'avant-projet.", "/missions/g2-avp"],
  ["G2 PRO", "Dimensionner les fondations", "Justifications, valeurs de calcul et solutions de fondation au stade projet.", "/missions/g2-pro"],
  ["G3", "Études et suivi d'exécution", "Accompagnement géotechnique des travaux et adaptation aux conditions rencontrées.", "/missions/g3"],
  ["G4", "Supervision géotechnique", "Contrôle indépendant des études et du suivi géotechnique d'exécution.", "/missions/g4"],
  ["G5", "Diagnostic & pathologies", "Fissures, tassements, RGA, fondations existantes et sinistres.", "/missions/g5"]
] as const;

const departments = [
  ["83", "Var", "Toulon · Draguignan · Fréjus · Brignoles · Hyères", "var-83"],
  ["13", "Bouches-du-Rhône", "Marseille · Aix-en-Provence · Aubagne · Salon", "bouches-du-rhone-13"],
  ["06", "Alpes-Maritimes", "Nice · Cannes · Antibes · Grasse · Vence", "alpes-maritimes-06"],
  ["84", "Vaucluse", "Avignon · Orange · Carpentras · Cavaillon · Pertuis", "vaucluse-84"],
  ["04", "Alpes-de-Haute-Provence", "Digne-les-Bains · Manosque · Sisteron", "alpes-de-haute-provence-04"],
  ["05", "Hautes-Alpes", "Gap · Briançon · Embrun", "hautes-alpes-05"]
] as const;

const expertise = [
  "Sondages destructifs et carottés",
  "Essais pressiométriques Ménard",
  "Pénétromètres dynamiques",
  "Reconnaissances de fondations",
  "Analyses et classification des sols",
  "Hydrogéologie & piézométrie",
  "Stabilité de talus et soutènements",
  "Micropieux & reprises en sous-œuvre",
  "Instrumentation et suivi de fissures",
  "Expertise sécheresse / RGA"
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Var Géotechnique",
  url: "https://vargeotechnique.fr",
  logo: "https://vargeotechnique.fr/logo-brand.webp",
  telephone: "+33465844289",
  email: "contact@stibfrance.fr",
  address: {
    "@type": "PostalAddress",
    streetAddress: "181 chemin des Fontaites",
    postalCode: "83170",
    addressLocality: "La Celle",
    addressRegion: "Provence-Alpes-Côte d'Azur",
    addressCountry: "FR"
  },
  areaServed: [
    "Var",
    "Bouches-du-Rhône",
    "Alpes-Maritimes",
    "Vaucluse",
    "Alpes-de-Haute-Provence",
    "Hautes-Alpes"
  ],
  description:
    "Bureau d'études géotechniques : missions G1 à G5, investigations du sol, expertise RGA, fondations et accompagnement de travaux en région PACA."
};

function Mark({ children }: { children: React.ReactNode }) {
  return <span className="eyebrow">{children}</span>;
}

export default function Home() {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="siteHeader">
        <div className="wrap nav">
          <Link href="/" className="brand" aria-label="Var Géotechnique - Accueil">
            <Image src="/logo-brand.webp" alt="Logo Var Géotechnique" width={300} height={200} priority />
          </Link>
          <nav aria-label="Navigation principale">
            <a href="#missions">Missions</a>
            <a href="#expertise">Expertises</a>
            <a href="#paca">PACA</a>
            <a href="#engagements">Engagements</a>
          </nav>
          <a className="button compact" href="mailto:contact@stibfrance.fr?subject=Demande%20d'étude%20géotechnique">
            Demander une étude
          </a>
        </div>
      </header>

      <section className="hero">
        <div className="heroGrid" aria-hidden="true" />
        <div className="heroGlow" aria-hidden="true" />
        <div className="wrap heroInner">
          <div className="heroCopy">
            <Mark>Ingénierie géotechnique · Région PACA</Mark>
            <h1>Comprendre le sol.<br /><span>Sécuriser l'ouvrage.</span></h1>
            <p className="lead">
              Var Géotechnique accompagne particuliers, constructeurs, architectes, entreprises, experts,
              assureurs et collectivités sur l'ensemble du cycle géotechnique : investigations, études G1 à G5,
              conception des fondations et suivi des travaux.
            </p>
            <div className="heroActions">
              <a className="button" href="mailto:contact@stibfrance.fr?subject=Demande%20de%20devis%20-%20Var%20Géotechnique">Recevoir un devis</a>
              <a className="button ghost" href="tel:+33465844289">04 65 84 42 89</a>
            </div>
            <div className="trustRow" aria-label="Qualifications et engagements">
              <div><strong>NF P 94-500</strong><span>Missions G1 à G5</span></div>
              <div><strong>SS4</strong><span>Équipes formées / habilitées</span></div>
              <div><strong>M.A.S.E.</strong><span>Certification en cours</span></div>
            </div>
          </div>

          <div className="heroPanel">
            <div className="strata" aria-hidden="true">
              <i /><i /><i /><i /><i />
            </div>
            <div className="heroPanelContent">
              <span className="panelIndex">01 / TERRAIN</span>
              <h2>De la donnée de terrain à la décision technique.</h2>
              <p>Des moyens d'investigation adaptés, une lecture géologique et géotechnique rigoureuse, puis des préconisations directement exploitables par la maîtrise d'œuvre.</p>
              <div className="panelStats">
                <div><b>IN SITU</b><span>investigations terrain</span></div>
                <div><b>G1→G5</b><span>missions complètes</span></div>
                <div><b>PACA</b><span>6 départements</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="proofBar">
        <div className="wrap proofGrid">
          <span>Particuliers</span><span>Constructeurs</span><span>Architectes & MOE</span><span>Entreprises</span><span>Experts & assureurs</span><span>Collectivités</span>
        </div>
      </section>

      <section id="missions" className="section wrap">
        <div className="sectionHead">
          <div><Mark>Missions géotechniques</Mark><h2>La bonne mission, au bon stade du projet.</h2></div>
          <p>Nous cadrons l'étude selon la norme NF P 94-500, le niveau de conception et les risques géotechniques réellement identifiés.</p>
        </div>
        <div className="missionGrid">
          {missions.map(([code, title, text, href]) => (
            <Link href={href} className="missionCard" key={code}>
              <span className="missionCode">{code}</span>
              <h3>{title}</h3>
              <p>{text}</p>
              <span className="arrow">Découvrir →</span>
            </Link>
          ))}
        </div>
      </section>

      <section id="expertise" className="section darkSection">
        <div className="wrap split">
          <div>
            <Mark>Investigations & ingénierie</Mark>
            <h2>Un bureau d'études capable de relier le terrain, le calcul et le chantier.</h2>
            <p className="leadSmall">Nos interventions couvrent la reconnaissance du sous-sol, l'analyse des risques, le dimensionnement géotechnique et le suivi des solutions retenues.</p>
            <div className="chips">
              {expertise.map((item) => <span key={item}>{item}</span>)}
            </div>
          </div>
          <div className="techPanel">
            <div className="techTop"><span>CAPACITÉ TERRAIN</span><b>Accès courants & contraints</b></div>
            <div className="techLines">
              <div><span>Forage / sondage</span><strong>Paramètres enregistrés</strong></div>
              <div><span>Pressiomètre</span><strong>Essais in situ</strong></div>
              <div><span>Carottage</span><strong>Échantillonnage ciblé</strong></div>
              <div><span>Fondations</span><strong>Reconnaissance & diagnostic</strong></div>
            </div>
            <p className="micro">Moyens de forage et matériels adaptés aux environnements urbains, industriels, naturels ou à accès difficile.</p>
          </div>
        </div>
      </section>

      <section className="section wrap audienceSection">
        <div className="audienceCard personal">
          <Mark>Particuliers</Mark>
          <h2>Terrain, construction, fissures : obtenez une réponse compréhensible et exploitable.</h2>
          <p>Vente de terrain, projet de maison ou piscine, fissures, sécheresse, tassements : nous vous indiquons la mission adaptée et les investigations nécessaires, sans surdimensionner l'étude.</p>
          <div className="checkList"><span>G1 & loi ELAN</span><span>G2 AVP / G2 PRO</span><span>G5 fissures & RGA</span><span>Reprise en sous-œuvre</span></div>
          <a className="textLink" href="mailto:contact@stibfrance.fr?subject=Projet%20particulier%20-%20étude%20de%20sol">Parler de mon projet →</a>
        </div>
        <div className="audienceCard pro">
          <Mark>Professionnels</Mark>
          <h2>Une ingénierie réactive, documentée et compatible avec vos contraintes projet.</h2>
          <p>Promoteurs, constructeurs, BET, architectes, entreprises, experts et collectivités : étude, terrain, dimensionnement, assistance DCE et supervision.</p>
          <div className="checkList"><span>G2 PRO & DCE</span><span>G3 / G4</span><span>Fondations spéciales</span><span>Investigations externalisées</span></div>
          <a className="textLink" href="mailto:contact@stibfrance.fr?subject=Projet%20professionnel%20-%20géotechnique">Échanger avec notre bureau d'études →</a>
        </div>
      </section>

      <section id="engagements" className="section wrap">
        <div className="sectionHead">
          <div><Mark>Exigence & sécurité</Mark><h2>Des études conçues pour être utilisées, pas seulement archivées.</h2></div>
          <p>Traçabilité des investigations, hypothèses explicites, conclusions hiérarchisées et recommandations compatibles avec la réalité du chantier.</p>
        </div>
        <div className="engagementGrid">
          <article><span>01</span><h3>Rigueur normative</h3><p>Référentiels NF P 94-500, Eurocode 7 et normes d'essais applicables au programme d'investigations.</p></article>
          <article><span>02</span><h3>Sécurité chantier</h3><p>Équipes formées et habilitées SS4 pour les interventions concernées. Culture prévention intégrée à la préparation des missions.</p></article>
          <article><span>03</span><h3>Démarche M.A.S.E.</h3><p>Var Géotechnique est en cours de certification M.A.S.E. : une démarche structurée d'amélioration Santé, Sécurité et Environnement.</p></article>
          <article><span>04</span><h3>Interlocuteur unique</h3><p>Du besoin initial au rapport puis au chantier, nous assurons la continuité technique et la lisibilité des décisions.</p></article>
        </div>
      </section>

      <section id="paca" className="section pacaSection">
        <div className="wrap">
          <div className="sectionHead light">
            <div><Mark>Référencement local</Mark><h2>Votre bureau d'études géotechniques dans toute la région PACA.</h2></div>
            <p>Interventions organisées dans les six départements de Provence-Alpes-Côte d'Azur, avec adaptation des moyens aux contraintes géologiques et d'accès.</p>
          </div>
          <div className="departmentGrid">
            {departments.map(([num, name, cities, slug]) => (
              <Link href={`/geotechnique/${slug}`} className="department" key={num}>
                <b>{num}</b><div><h3>{name}</h3><p>{cities}</p></div><span>→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="contactSection">
        <div className="wrap contactCard">
          <div>
            <Mark>Votre projet mérite un cadrage précis</Mark>
            <h2>Parlez-nous du terrain, du bâtiment ou du désordre. Nous vous orientons vers la mission adaptée.</h2>
            <p>Pour accélérer l'analyse, joignez l'adresse du projet, vos plans disponibles et quelques photos si le dossier concerne un ouvrage existant.</p>
          </div>
          <div className="contactActions">
            <a className="button white" href="mailto:contact@stibfrance.fr?subject=Demande%20d'étude%20-%20Var%20Géotechnique">contact@stibfrance.fr</a>
            <a className="phone" href="tel:+33465844289">04 65 84 42 89</a>
            <span>181 chemin des Fontaites · 83170 La Celle</span>
          </div>
        </div>
      </section>

      <footer>
        <div className="wrap footerGrid">
          <div className="footerBrand"><Image src="/logo-brand.webp" alt="Var Géotechnique" width={220} height={146} /><p>Bureau d'études géotechniques · Groupe STIB France</p></div>
          <div><b>Missions</b><Link href="/missions/g1">G1</Link><Link href="/missions/g2-avp">G2 AVP</Link><Link href="/missions/g2-pro">G2 PRO</Link><Link href="/missions/g5">G5 / RGA</Link></div>
          <div><b>Région PACA</b><Link href="/geotechnique/var-83">Var</Link><Link href="/geotechnique/bouches-du-rhone-13">Bouches-du-Rhône</Link><Link href="/geotechnique/alpes-maritimes-06">Alpes-Maritimes</Link><Link href="/geotechnique/vaucluse-84">Vaucluse</Link></div>
          <div><b>Informations</b><Link href="/mentions-legales">Mentions légales</Link><Link href="/confidentialite">Confidentialité</Link><a href="https://www.stibfrance.fr">STIB France</a></div>
        </div>
        <div className="wrap footerBottom"><span>© 2026 Var Géotechnique / STIB France</span><span>M.A.S.E. : certification en cours · SS4 : équipes formées / habilitées</span></div>
      </footer>
    </main>
  );
}
