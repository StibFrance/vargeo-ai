import Link from "next/link";
import styles from "../report.module.css";

export const metadata={title:"Exemple de rapport G5 RGA - VarGeo.AI"};

export default function G5Example(){
  return <main className={styles.page}>
    <header className={styles.nav}>
      <Link href="/" className={styles.brand}>VarGeo.AI</Link>
      <div className={styles.navlinks}><Link href="/" className={styles.btnAlt}>Accueil</Link><Link href="/#devis" className={styles.btn}>Demander un devis</Link></div>
    </header>
    <section className={styles.hero}>
      <div className={styles.eyebrow}>Exemple de rapport - G5 / RGA / Instrumentation</div>
      <h1>Diagnostic geotechnique d'un batiment fissure en contexte argileux</h1>
      <p className={styles.lead}>Rapport demonstratif reconstitue a partir de methodes de missions reelles. Toutes les donnees sont generiques, anonymisees et non reutilisables pour un autre projet.</p>
      <div><span className={styles.badge}>NF P 94-500</span><span className={styles.badge}>M1 STRAT</span><span className={styles.badge}>M3 FONDA</span><span className={styles.badge}>M5 SENSOR</span><span className={styles.badge}>M8 HYDRO</span></div>
    </section>
    <div className={styles.warning}>Document de demonstration : il illustre la structure et le niveau de detail de VarGeo.AI. Il ne constitue pas une etude opposable.</div>
    <section className={styles.report}>
      <div className={styles.grid}>
        <article className={styles.card}><h2>1. Objet de la mission</h2><p>Analyser l'origine probable de desordres de fissuration, croiser sol, eau, fondations, structure et chronologie, puis definir les suites techniques.</p><h3>Perimetre</h3><ul className={styles.list}><li>analyse documentaire ;</li><li>modele geotechnique ;</li><li>analyse de la fissuration ;</li><li>diagnostic causal ;</li><li>principe de confortement.</li></ul></article>
        <article className={styles.card}><h2>2. Synthese executive</h2><div className={styles.kpi}>Dynamique hydromecanique compatible</div><p>Les desordres sont compatibles avec des variations volumetriques de sols fins sensibles a l'eau, combinees a une continuite imparfaite des appuis.</p><p className={styles.statusWarn}>Suite : G2 PRO avant dimensionnement de reprise en sous-oeuvre.</p></article>
        <article className={styles.card}><h2>3. Modele geotechnique</h2><table className={styles.table}><thead><tr><th>Horizon</th><th>Description</th><th>Comportement</th></tr></thead><tbody><tr><td>H1</td><td>Sol remanie</td><td>heterogene</td></tr><tr><td>H2</td><td>Sols fins argileux</td><td>sensibles aux variations hydriques</td></tr><tr><td>H3</td><td>Horizon competent</td><td>cible potentielle de reprise profonde</td></tr></tbody></table></article>
        <article className={styles.card}><h2>4. Fissuration et cinematique</h2><p>VarGeo.AI analyse amplitude, vitesse, reversibilite et synchronisation avec les periodes seches et humides.</p><table className={styles.table}><tbody><tr><td>Periode seche</td><td>ouverture progressive</td></tr><tr><td>Periode humide</td><td>refermeture partielle</td></tr><tr><td>Lecture</td><td>signature cyclique compatible avec un mecanisme hydrique</td></tr></tbody></table></article>
        <article className={styles.card}><h2>5. Instrumentation</h2><ul className={styles.list}><li>capteurs de fissures ;</li><li>humidite du sol ;</li><li>pluviometrie ;</li><li>teletransmission ;</li><li>seuils d'alerte.</li></ul><p className={styles.statusOk}>Objectif : mesurer la stabilisation avant et apres travaux.</p></article>
        <article className={styles.card}><h2>6. Principe de reprise</h2><p>Reprise profonde des appuis, redistribution des charges par longrines et maitrise peripherique des eaux, a confirmer et dimensionner en G2 PRO.</p><div className={styles.formula}>G5 = diagnostic + principe de solution{"\n"}G2 PRO = dimensionnement{"\n"}G3 = execution{"\n"}G4 = supervision</div></article>
        <article className={[styles.card,styles.full].join(" ")}><h2>7. Conclusion VarGeo.AI</h2><table className={styles.table}><thead><tr><th>Point</th><th>Decision</th><th>Statut</th></tr></thead><tbody><tr><td>Mecanisme RGA</td><td>compatible et contributif</td><td className={styles.statusWarn}>A suivre</td></tr><tr><td>Gestion des eaux</td><td>action prioritaire</td><td className={styles.statusWarn}>Requise</td></tr><tr><td>RSO</td><td>principe pertinent</td><td className={styles.statusWarn}>G2 PRO</td></tr><tr><td>Instrumentation</td><td>recommandee</td><td className={styles.statusOk}>OK</td></tr></tbody></table></article>
      </div>
    </section>
    <footer className={styles.footer}>VarGeo.AI - Exemple technique reconstitue</footer>
  </main>;
}
