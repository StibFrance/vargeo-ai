import Link from "next/link";
import PublicQuoteForm from "@/components/public-quote-form";

const plans=[
  {
    name:"Starter",
    label:"Essentiel",
    text:"Pour une structure qui souhaite intégrer VarGéo.AI progressivement dans sa production.",
    points:["Accès aux fonctions essentielles","Dossiers sécurisés et traçables","Modules techniques selon configuration","Production documentaire assistée"],
    popular:false
  },
  {
    name:"Pro",
    label:"Bureau d'études",
    text:"Pour les équipes qui gèrent plusieurs dossiers simultanément et souhaitent accélérer leur production.",
    points:["Usage multi-dossiers","Fonctions avancées","Assistant VarGéo.AI","Traçabilité et contrôles renforcés"],
    popular:true
  },
  {
    name:"Expert",
    label:"Usage intensif",
    text:"Pour les organisations ayant un volume élevé, plusieurs utilisateurs ou des besoins spécifiques.",
    points:["Usage intensif","Accès étendu aux modules","Configuration adaptée à l'organisation","Accompagnement renforcé"],
    popular:false
  }
];

export default function Home(){
  return <main className="public-site">
    <header className="public-nav">
      <div className="brand"><div className="brand-mark"/><div><strong>VarGéo.AI</strong><small>Engineering Intelligence</small></div></div>
      <div className="toolbar"><a className="button secondary" href="#devis">Demander un devis</a><Link className="button" href="/login">Connexion</Link></div>
    </header>

    <section className="public-hero">
      <div className="eyebrow">Plateforme d'ingénierie géotechnique assistée</div>
      <h1>De la donnée terrain au rapport technique, dans un environnement unique et traçable.</h1>
      <p>VarGéo.AI centralise les affaires, calculs, contrôles, rapports et référentiels d'un bureau d'études géotechnique tout en conservant une validation humaine des décisions d'ingénierie.</p>
      <div className="toolbar"><Link className="button" href="/login">Accéder à mon espace</Link><a className="button secondary" href="#formules">Voir les formules</a></div>
    </section>

    <section className="public-section">
      <div className="eyebrow">9 modules spécialisés</div>
      <h2>Une chaîne de production technique complète</h2>
      <div className="grid grid-3">
        {["M1 STRAT — Modèle géotechnique","M2 PRESSIO — Pressiométrie","M3 FONDA — Fondations","M4 STAB — Stabilité","M5 SENSOR — Instrumentation","M6 STRUCT — Structure","M7 ENVIRO — Environnement","M8 HYDRO — Hydrogéologie","M9 POLLU — Sites et sols pollués"].map(x=><div className="card" key={x}><strong>{x}</strong></div>)}
      </div>
    </section>

    <section className="public-section" id="exemples">
      <div className="eyebrow">Démonstrations techniques</div>
      <h2>Deux cas pour comprendre VarGéo.AI</h2>
      <p className="subtitle">Exemples reconstitués à partir de méthodes réellement utilisées, sans aucune donnée client identifiable.</p>
      <div className="grid grid-3">
        <article className="card">
          <div className="module-code">EXEMPLE 01 · G5 / RGA</div>
          <h3>Bâtiment fissuré sur sols sensibles aux variations hydriques</h3>
          <p className="muted">Analyse croisée de la fissuration, du contexte hydrique, des fondations et de la chronologie.</p>
          <div className="toolbar"><span className="badge">M1 STRAT</span><span className="badge">M3 FONDA</span><span className="badge">M5 SENSOR</span><span className="badge">M8 HYDRO</span></div>
          <details className="example-details"><summary>Voir le workflow</summary>
            <ol>
              <li>Contrôle des pièces et séparation faits / hypothèses.</li>
              <li>Construction du modèle géotechnique et lecture de la zone active.</li>
              <li>Analyse de la cinématique des fissures dans le temps.</li>
              <li>Corrélation avec l'humidité des sols et les épisodes hydriques.</li>
              <li>Comparaison des scénarios de maîtrise des eaux et de reprise.</li>
              <li>Orientation vers une solution à dimensionner en G2 PRO.</li>
            </ol>
            <p><strong>Décision :</strong> diagnostic causal argumenté, programme d'instrumentation et passage encadré vers G2 PRO puis G3/G4.</p>
          </details>
        </article>
        <article className="card">
          <div className="module-code">EXEMPLE 02 · G2 PRO</div>
          <h3>Projet résidentiel sur sous-sol hétérogène</h3>
          <p className="muted">Zonage géotechnique, portance, tassements et stratégie de fondation différente selon les secteurs.</p>
          <div className="toolbar"><span className="badge">M1 STRAT</span><span className="badge">M2 PRESSIO</span><span className="badge">M3 FONDA</span><span className="badge">M4 STAB</span></div>
          <details className="example-details"><summary>Voir le workflow</summary>
            <ol>
              <li>QA/QC des sondages et détection des données insuffisantes.</li>
              <li>Construction d'un modèle géotechnique par secteurs.</li>
              <li>Vérifications de portance pressiométrique aux états limites.</li>
              <li>Contrôle des tassements absolus et différentiels.</li>
              <li>Détection d'un point bloquant si l'horizon porteur n'est pas reconnu.</li>
              <li>Prescription de solutions de fondation différentes selon les zones.</li>
            </ol>
            <div className="result"><pre>{`q_net = k_p × pL* × iδ × iβ
R_d,ELS = q_net / facteurs de sécurité
s = vérification pressiométrique des tassements
Décision = OK / À JUSTIFIER / BLOQUANT`}</pre></div>
            <p><strong>Décision :</strong> fondations superficielles rigidifiées dans le secteur favorable ; reconnaissance complémentaire avant solution profonde dans le secteur hétérogène.</p>
          </details>
        </article>
        <article className="card">
          <div className="module-code">SORTIE VARGÉO.AI</div>
          <h3>Une décision technique traçable</h3>
          <p className="muted">Entrées, contrôles, calculs, alertes, limites de mission et validation ingénieur réunis dans la même interface.</p>
        </article>
      </div>
    </section>

    <section className="public-section" id="formules">
      <div className="eyebrow">Abonnements professionnels</div>
      <h2>Des formules adaptées à votre niveau d'utilisation</h2>

      <div className="pricing-callout">
        <span>Abonnement VarGéo.AI</span>
        <strong>À partir de 690 € HT / mois</strong>
        <small>Le tarif final dépend du volume d'utilisation, des modules activés, du nombre d'utilisateurs et du niveau d'accompagnement.</small>
      </div>

      <div className="grid grid-3">
        {plans.map(p=><div className={`card pricing-card ${p.popular?"pricing-popular":""}`} key={p.name}>
          <div>
            <div className="pricing-head">
              <div><div className="module-code">{p.name}</div><div className="muted" style={{marginTop:4}}>{p.label}</div></div>
              {p.popular&&<span className="pricing-badge">La plus choisie</span>}
            </div>
            <p>{p.text}</p>
            <ul className="pricing-points">{p.points.map(x=><li key={x}>{x}</li>)}</ul>
            <div className="pricing-custom">Tarification personnalisée sur devis</div>
          </div>
          <a className="button" href="#devis">Demander une proposition</a>
        </div>)}
      </div>

      <p className="muted pricing-note">Facturation mensuelle ou annuelle possible. Les conditions d'usage, volumes, options et éventuels services complémentaires sont précisés dans la proposition commerciale.</p>
    </section>

    <section className="public-section">
      <div className="grid grid-3">
        <div className="card"><h3>Dossiers cloisonnés</h3><p className="muted">Chaque compte client n'accède qu'aux dossiers qui lui sont explicitement attribués.</p></div>
        <div className="card"><h3>Traçabilité</h3><p className="muted">Versions de calcul, références, validations et journal d'audit sont conservés dans le dossier.</p></div>
        <div className="card"><h3>Validation ingénieur</h3><p className="muted">L'IA assiste la synthèse et la rédaction sans remplacer la responsabilité de l'ingénieur.</p></div>
      </div>
    </section>

    <section className="public-section" id="devis">
      <div className="eyebrow">Demande commerciale</div>
      <h2>Recevez une proposition adaptée à votre activité</h2>
      <p className="subtitle">Votre demande est adressée à l'équipe STIB France / VarGéo.AI.</p>
      <PublicQuoteForm/>
    </section>

    <footer className="public-footer">VarGéo.AI · STIB France · Plateforme professionnelle d'ingénierie</footer>
  </main>;
}
