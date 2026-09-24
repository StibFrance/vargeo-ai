import Link from "next/link";
import styles from "../report.module.css";

export const metadata={title:"Exemple de rapport G2 PRO - VarGeo.AI"};

export default function G2Example(){
  return <main className={styles.page}>
    <header className={styles.nav}>
      <Link href="/" className={styles.brand}>VarGeo.AI</Link>
      <div className={styles.navlinks}><Link href="/" className={styles.btnAlt}>Accueil</Link><Link href="/#devis" className={styles.btn}>Demander un devis</Link></div>
    </header>
    <section className={styles.hero}>
      <div className={styles.eyebrow}>Exemple de rapport - G2 PRO / Fondations / Zonage</div>
      <h1>Conception de fondations sur un sous-sol mecaniquement heterogene</h1>
      <p className={styles.lead}>Exemple demonstratif reconstitue montrant la logique VarGeo.AI : controle des donnees, zonage, calculs pressiometriques, tassements, alertes et prescriptions.</p>
      <div><span className={styles.badge}>NF P 94-500</span><span className={styles.badge}>NF P 94-261</span><span className={styles.badge}>M1 STRAT</span><span className={styles.badge}>M2 PRESSIO</span><span className={styles.badge}>M3 FONDA</span><span className={styles.badge}>M4 STAB</span></div>
    </section>
    <div className={styles.warning}>Les valeurs ci-dessous sont volontairement generiques et servent uniquement a illustrer le processus de calcul et de decision.</div>
    <section className={styles.report}>
      <div className={styles.grid}>
        <article className={styles.card}><h2>1. Objet de la mission</h2><p>Definir les principes de fondation d'un projet residentiel, en tenant compte d'une variabilite laterale importante du sous-sol.</p><ul className={styles.list}><li>analyse des sondages ;</li><li>zonage geotechnique ;</li><li>portance aux ELS / ELU ;</li><li>tassements ;</li><li>prescriptions de terrassement et drainage.</li></ul></article>
        <article className={styles.card}><h2>2. Synthese executive</h2><div className={styles.kpi}>Deux secteurs geotechniques</div><p>Le site ne peut pas etre traite par une solution unique. Un secteur presente un comportement compatible avec des fondations superficielles rigidifiees, tandis qu'un second secteur necessite une reconnaissance complementaire avant solution profonde.</p></article>
        <article className={styles.card}><h2>3. QA/QC des investigations</h2><table className={styles.table}><thead><tr><th>Controle</th><th>Resultat</th></tr></thead><tbody><tr><td>Continuite des horizons</td><td>variable selon les points</td></tr><tr><td>Valeurs pressiometriques</td><td>dispersion localisee</td></tr><tr><td>Profondeur reconnue</td><td>insuffisante dans une zone</td></tr><tr><td>Decision</td><td className={styles.statusWarn}>blocage du dimensionnement profond local</td></tr></tbody></table></article>
        <article className={styles.card}><h2>4. Modele par zones</h2><table className={styles.table}><thead><tr><th>Secteur</th><th>Lecture</th><th>Orientation</th></tr></thead><tbody><tr><td>A</td><td>profil relativement homogene</td><td>fondations superficielles rigidifiees</td></tr><tr><td>B</td><td>heterogeneite / decompaction</td><td>reconnaissance complementaire puis solution profonde ou traitement</td></tr></tbody></table></article>
        <article className={styles.card}><h2>5. Portance pressiometrique</h2><div className={styles.formula}>q_net = k_p x pL* x i_delta x i_beta{"\n"}R_d,ELS = q_net / facteurs de securite{"\n"}R_d,ELU = resistance de projet verifiee</div><p>Les parametres de calcul sont rattaches a chaque horizon et controles avant utilisation.</p></article>
        <article className={styles.card}><h2>6. Tassements</h2><div className={styles.formula}>s = fonction(q, E_M, alpha, B, lambda_c, lambda_d){"\n"}Controle : tassement absolu + differentiel</div><p>La decision ne repose pas uniquement sur la portance : le comportement en deformation est verifie simultanement.</p></article>
        <article className={[styles.card,styles.full].join(" ")}><h2>7. Decision par secteur</h2><div className={styles.cards3}><div className={styles.decision}><strong>Secteur A</strong><span className={styles.statusOk}>OK sous conditions</span><p>Fondations superficielles rigidifiees envisageables avec reception du fond de fouille.</p></div><div className={styles.decision}><strong>Secteur B</strong><span className={styles.statusWarn}>ALERTE</span><p>Donnees insuffisantes pour figer un horizon d'ancrage. Investigation complementaire requise.</p></div><div className={styles.decision}><strong>Execution</strong><span className={styles.statusWarn}>SUITE</span><p>G3 pour le dimensionnement EXE, puis G4 pour la supervision geotechnique.</p></div></div></article>
        <article className={[styles.card,styles.full].join(" ")}><h2>8. Conclusion VarGeo.AI</h2><table className={styles.table}><thead><tr><th>Verification</th><th>Decision</th></tr></thead><tbody><tr><td>Portance secteur A</td><td className={styles.statusOk}>Compatible sous enveloppe de calcul</td></tr><tr><td>Tassements secteur A</td><td className={styles.statusOk}>A verifier au dimensionnement final</td></tr><tr><td>Fondation secteur B</td><td className={styles.statusWarn}>Dimensionnement bloque avant investigation complementaire</td></tr><tr><td>Drainage / terrassement</td><td className={styles.statusWarn}>Prescriptions specifiques a integrer au DCE</td></tr></tbody></table></article>
      </div>
    </section>
    <footer className={styles.footer}>VarGeo.AI - Exemple technique reconstitue</footer>
  </main>;
}
