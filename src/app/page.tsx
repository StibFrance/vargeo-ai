import Link from "next/link";
import PublicQuoteForm from "@/components/public-quote-form";

const plans=[
  {name:"Starter",price:"1 800 € HT",volume:"5 rapports / mois",text:"Pour démarrer avec les outils VarGéo.AI et industrialiser une production régulière."},
  {name:"Pro",price:"3 200 € HT",volume:"10 rapports / mois",text:"Pour les bureaux d'études ayant une activité soutenue et plusieurs missions en parallèle."},
  {name:"Expert",price:"5 500 € HT",volume:"Illimité raisonnable",text:"Pour une utilisation intensive, multi-dossiers, avec accès complet aux modules spécialisés."}
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
            <div className="result"><pre>{`q_net = k_p × pL* × iδ × iβ\nR_d,ELS = q_net / facteurs de sécurité\ns = vérification pressiométrique des tassements\nDécision = OK / À JUSTIFIER / BLOQUANT`}</pre></div>
            <p><strong>Décision :</strong> fondations superficielles rigidifiées dans le secteur favorable ; reconnaissance complémentaire avant solution profonde dans le secteur hétérogène.</p>
          </details>
        </article>
        <article className="card">
          <div className="module-code">SORTIE VARGÉO.AI</div>
          <h3>Une décision technique traçable</h3>
          <p className="muted">Entrées, contrôles, calculs, alertes, limites de mission et validation ingénieur réunis dans la même interface.</p>
        </article>
      </div>
    </section>\n\n    <section className="public-section" id="formules">
      <div className="eyebrow">Abonnements professionnels</div>
      <h2>Choisissez le niveau adapté à votre production</h2>
      <div className="grid grid-3">{plans.map(p=><div className="card pricing-card" key={p.name}><div><div className="module-code">{p.name}</div><div className="pricing-price">{p.price}</div><strong>{p.volume}</strong><p className="muted">{p.text}</p></div><a className="button" href="#devis">Demander un devis</a></div>)}</div>
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
