import Link from "next/link";
import styles from "../report.module.css";

export const metadata={title:"Rapport specimen G2 PRO - VarGeo.AI"};

const toc=[
"Objet, cadre et limites de la mission",
"Pieces et donnees examinees",
"Description du projet et contraintes geometriques",
"Referentiel technique et normatif",
"Contexte geotechnique et risques",
"Programme d'investigations",
"Modele lithologique",
"Resultats pressiometriques",
"Analyse des sondages destructifs",
"Modele geotechnique de calcul",
"Verifications de portance",
"Tassements et interaction sol-structure",
"Conception des fondations - secteur A",
"Conception des fondations - secteur B",
"Ouvrages enterres et piscines",
"Terrassements et fouilles",
"Soutenements et voiles enterres",
"Eau, drainage et etancheite",
"RGA et variations hydriques",
"Seisme - dispositions geotechniques",
"Prescriptions G3 / G4",
"Registre des risques residuels",
"Prescriptions DCE / CCTP",
"Conclusion generale et avis G2 PRO"
];

export default function G2Example(){
  return <main className={styles.page}>
    <header className={styles.nav}>
      <Link href="/" className={styles.brand}>VarGeo.AI</Link>
      <div className={styles.navlinks}>
        <Link href="/" className={styles.btnAlt}>Accueil</Link>
        <Link href="/exemples/g5-rga" className={styles.btnAlt}>Voir le G5</Link>
        <Link href="/#devis" className={styles.btn}>Demander une demonstration</Link>
      </div>
    </header>

    <section className={styles.hero}>
      <div className={styles.eyebrow}>Rapport specimen professionnel · Mission G2 PRO</div>
      <h1>Etude geotechnique de conception PRO sur un projet residentiel a sous-sol heterogene</h1>
      <p className={styles.lead}>Specimen complet illustrant la transformation des investigations en modele geotechnique, valeurs de calcul, verifications ELS/ELU, variantes de fondation, prescriptions DCE et points de controle G3/G4.</p>
      <div className={styles.reportMeta}>
        <span className={styles.badge}>NF P 94-500</span><span className={styles.badge}>NF P 94-261</span><span className={styles.badge}>NF P 94-262</span><span className={styles.badge}>Eurocode 7</span><span className={styles.badge}>DTU 13.1</span><span className={styles.badge}>M1 STRAT</span><span className={styles.badge}>M2 PRESSIO</span><span className={styles.badge}>M3 FONDA</span><span className={styles.badge}>M4 STAB</span>
      </div>
    </section>

    <div className={styles.warning}><strong>SPECIMEN DE DEMONSTRATION.</strong> Les valeurs de sondage, dimensions, charges et niveaux sont fictifs et uniquement destines a montrer le niveau de production de VarGeo.AI.</div>

    <section className={styles.report}>
      <div className={styles.coverGrid}>
        <article className={styles.card}>
          <div className={styles.smallcaps}>Fiche de controle du document</div>
          <table className={styles.controlTable}><tbody>
            <tr><td>Mission</td><td>G2 PRO - Etude geotechnique de conception phase PRO</td></tr>
            <tr><td>Projet</td><td>Deux batiments residentiels, piscines et ouvrages associes</td></tr>
            <tr><td>Contexte</td><td>Terrain en pente avec heterogeneites mecaniques localisees</td></tr>
            <tr><td>Objet</td><td>Fixer les solutions et enveloppes geotechniques au stade PRO / DCE</td></tr>
            <tr><td>Statut</td><td>Specimen public - non opposable</td></tr>
            <tr><td>Indice</td><td>DEMO A</td></tr>
          </tbody></table>
        </article>
        <article className={styles.card}>
          <div className={styles.smallcaps}>Statut technique</div>
          <div className={styles.kpi}>Projet geotechniquement faisable sous zonage</div>
          <p>Le site est divise en deux secteurs. Le secteur A permet une solution superficielle rigidifiee sous conditions. Le secteur B presente une heterogeneite mecanique qui interdit de figer une fondation profonde sans reconnaissance complementaire de l'horizon d'ancrage.</p>
          <div className={[styles.callout,styles.calloutWarn].join(" ")}><strong>Point bloquant :</strong> aucune longueur de micropieu ne doit etre contractualisee tant que la continuite de l'horizon porteur n'est pas reconnue.</div>
        </article>
      </div>

      <article className={styles.chapter}>
        <h2>Sommaire detaille</h2>
        <ol className={styles.toc}>{toc.map((x)=><li key={x}>{x}</li>)}</ol>
      </article>

      <article className={styles.chapter}>
        <h2><span className={styles.chapterNumber}>1</span>Objet, cadre et limites de la mission</h2>
        <p>La G2 PRO transforme les donnees geotechniques disponibles en prescriptions de conception directement exploitables par la maitrise d'oeuvre, le BET structure et les entreprises consultees. Elle fixe le modele de calcul, les solutions envisageables, les enveloppes de contrainte et les controles d'execution.</p>
        <h3>Limites de conception</h3>
        <ul className={styles.list}><li>les reactions finales du BET structure restent a recaler avant execution ;</li><li>les profondeurs d'ancrage des fondations profondes restent indicatives dans le secteur B ;</li><li>le dimensionnement EXE appartient a la G3 ;</li><li>les adaptations au terrain rencontre relevent de la G4.</li></ul>
      </article>

      <article className={styles.chapter}>
        <h2><span className={styles.chapterNumber}>2</span>Pieces et donnees examinees</h2>
        <table className={styles.table}><thead><tr><th>Document</th><th>Usage</th><th>Controle</th></tr></thead><tbody>
          <tr><td>plans architecte</td><td>emprise, niveaux, ouvrages</td><td>coherence altimetrique</td></tr>
          <tr><td>plans structure provisoires</td><td>charges et lignes porteuses</td><td>enveloppes a confirmer</td></tr>
          <tr><td>sondages pressiometriques</td><td>portance et deformation</td><td>QA/QC des valeurs</td></tr>
          <tr><td>sondages destructifs</td><td>lithologie / decompaction</td><td>correlation avec pressiometres</td></tr>
          <tr><td>topographie</td><td>pentes et soutenements</td><td>interaction terrassements / fondations</td></tr>
        </tbody></table>
      </article>

      <article className={styles.chapter}>
        <h2><span className={styles.chapterNumber}>3</span>Description du projet et contraintes geometriques</h2>
        <p>Le projet comprend deux volumes residentiels de plusieurs niveaux, des piscines et des ouvrages enterres. Le terrain naturel est en pente, avec des deblais et remblais localises. Cette geometrie impose de traiter simultanement fondations, terrassements, soutenements et gestion des eaux.</p>
        <div className={styles.calcGrid}>
          <div className={styles.calcBox}><span>Batiments</span><strong>2</strong></div>
          <div className={styles.calcBox}><span>Piscines</span><strong>2</strong></div>
          <div className={styles.calcBox}><span>Secteurs geo.</span><strong>2</strong></div>
          <div className={styles.calcBox}><span>Mission</span><strong>PRO / DCE</strong></div>
        </div>
      </article>

      <article className={styles.chapter}>
        <h2><span className={styles.chapterNumber}>4</span>Referentiel technique et normatif</h2>
        <ul className={styles.list}><li>NF P 94-500 - missions d'ingenierie geotechnique ;</li><li>NF EN 1997-1 et annexe nationale - Eurocode 7 ;</li><li>NF EN 1997-2 - reconnaissance et essais ;</li><li>NF P 94-261 - fondations superficielles ;</li><li>NF P 94-262 - fondations profondes ;</li><li>NF EN ISO 22476-4 - essai pressiometrique Menard ;</li><li>NF DTU 13.1 - fondations superficielles.</li></ul>
      </article>

      <article className={styles.chapter}>
        <h2><span className={styles.chapterNumber}>5</span>Contexte geotechnique et risques</h2>
        <div className={styles.cards3}>
          <div className={styles.decision}><strong>Heterogeneite</strong><span className={styles.riskHigh}>ELEVEE secteur B</span><p>zones de decompaction detectees localement.</p></div>
          <div className={styles.decision}><strong>Pente</strong><span className={styles.riskMed}>MODEREE</span><p>interaction avec fouilles et soutenements.</p></div>
          <div className={styles.decision}><strong>Eau</strong><span className={styles.riskMed}>A MAITRISER</span><p>circulations temporaires et ruissellement possibles.</p></div>
        </div>
      </article>

      <article className={styles.chapter}>
        <h2><span className={styles.chapterNumber}>6</span>Programme d'investigations</h2>
        <table className={styles.table}><thead><tr><th>Type</th><th>Nombre</th><th>Profondeur indicative</th><th>Objectif</th></tr></thead><tbody>
          <tr><td>pressiometres</td><td>4</td><td>8 a 12 m</td><td>portance / tassements</td></tr>
          <tr><td>sondages destructifs</td><td>5</td><td>6 a 10 m</td><td>lithologie / decompaction</td></tr>
          <tr><td>reconnaissances ponctuelles</td><td>selon besoin</td><td>variable</td><td>interfaces ouvrages / terrain</td></tr>
        </tbody></table>
      </article>

      <article className={styles.chapter}>
        <h2><span className={styles.chapterNumber}>7</span>Modele lithologique</h2>
        <table className={styles.table}><thead><tr><th>Horizon</th><th>Description</th><th>Epaisseur indicative</th><th>Comportement</th></tr></thead><tbody>
          <tr><td>H1</td><td>terre vegetale / remblais</td><td>0,3 a 1,5 m</td><td>non porteur</td></tr>
          <tr><td>H2</td><td>argiles marneuses alterees</td><td>variable</td><td>deformable a moyenne</td></tr>
          <tr><td>H3</td><td>marnes plus compactes</td><td>continuite variable</td><td>horizon favorable</td></tr>
          <tr><td>Anomalies B</td><td>zones decompressees</td><td>ponctuelles</td><td>defavorable</td></tr>
        </tbody></table>
      </article>

      <article className={styles.chapter}>
        <h2><span className={styles.chapterNumber}>8</span>Resultats pressiometriques</h2>
        <p>Les valeurs ci-dessous sont fictives mais representent la logique de traitement VarGeo.AI : selection des valeurs representatives, exclusion des anomalies manifestes et conservation des valeurs basses pertinentes.</p>
        <table className={styles.table}><thead><tr><th>Sondage</th><th>Zone</th><th>pL* retenu</th><th>EM retenu</th><th>Lecture</th></tr></thead><tbody>
          <tr><td>SP1</td><td>A</td><td>1,4 MPa</td><td>12 MPa</td><td>profil regulier</td></tr>
          <tr><td>SP2</td><td>A</td><td>1,2 MPa</td><td>10 MPa</td><td>profil regulier</td></tr>
          <tr><td>SP3</td><td>B</td><td>0,6 MPa</td><td>6 MPa</td><td>valeur basse localisee</td></tr>
          <tr><td>SP4</td><td>B</td><td>1,8 MPa</td><td>15 MPa</td><td>amelioration en profondeur</td></tr>
        </tbody></table>
      </article>

      <article className={styles.chapter}>
        <h2><span className={styles.chapterNumber}>9</span>Analyse des sondages destructifs</h2>
        <p>Les sondages destructifs sont utilises pour rechercher des pertes d'avancement, zones de faible resistance, variations lithologiques et anomalies coherentes avec les valeurs pressiometriques.</p>
        <div className={[styles.callout,styles.calloutWarn].join(" ")}><strong>Secteur B :</strong> plusieurs indices de terrain decompresse sont compatibles avec la dispersion mecanique. Ces indices ne doivent pas etre assimiles a des cavites franches sans investigation complementaire.</div>
      </article>

      <article className={styles.chapter}>
        <h2><span className={styles.chapterNumber}>10</span>Modele geotechnique de calcul</h2>
        <table className={styles.table}><thead><tr><th>Secteur</th><th>pL* calcul</th><th>EM calcul</th><th>kp indicatif</th><th>Commentaire</th></tr></thead><tbody>
          <tr><td>A</td><td>1,2 MPa</td><td>10 MPa</td><td>0,8</td><td>valeurs conservatives</td></tr>
          <tr><td>B superficiel</td><td>0,6 MPa</td><td>6 MPa</td><td>0,8</td><td>non retenu pour fondations superficielles principales</td></tr>
          <tr><td>B profond</td><td>a confirmer</td><td>a confirmer</td><td>-</td><td>reconnaissance complementaire obligatoire</td></tr>
        </tbody></table>
      </article>

      <article className={styles.chapter}>
        <h2><span className={styles.chapterNumber}>11</span>Verifications de portance</h2>
        <div className={styles.formula}>q_net = kp x pL,e* x i_delta x i_beta{"\n"}R_d,ELS/A = q_net / (gamma_Rv x gamma_Rdv){"\n"}R_d,ELU/A = q_net / combinaison ELU</div>
        <p>Pour le specimen, on retient une semelle filante de largeur B = 1,00 m dans le secteur A, une valeur pL* = 1,20 MPa et kp = 0,80.</p>
        <div className={styles.calcGrid}>
          <div className={styles.calcBox}><span>pL*</span><strong>1,20 MPa</strong></div>
          <div className={styles.calcBox}><span>kp</span><strong>0,80</strong></div>
          <div className={styles.calcBox}><span>qnet</span><strong>960 kPa</strong></div>
          <div className={styles.calcBox}><span>ELS calc.</span><strong>~348 kPa</strong></div>
        </div>
        <table className={styles.table}><thead><tr><th>Cas</th><th>Contrainte projet</th><th>Resistance ELS</th><th>Taux</th><th>Avis</th></tr></thead><tbody>
          <tr><td>A-SF1</td><td>120 kPa</td><td>348 kPa</td><td>34 %</td><td className={styles.statusOk}>OK</td></tr>
          <tr><td>A-SF2</td><td>165 kPa</td><td>348 kPa</td><td>47 %</td><td className={styles.statusOk}>OK</td></tr>
        </tbody></table>
      </article>

      <article className={styles.chapter}>
        <h2><span className={styles.chapterNumber}>12</span>Tassements et interaction sol-structure</h2>
        <div className={styles.formula}>s = (q-q0)/9 x [(alpha/Ec) x lambda_c x B + (2/Ed) x B0 x (lambda_d x B/B0)^alpha]</div>
        <p>Les tassements sont controles en valeur absolue et surtout differentielle entre lignes porteuses. Une fondation verifiee en portance peut rester inacceptable si sa deformabilite est trop forte.</p>
        <table className={styles.table}><thead><tr><th>Cas</th><th>Tassement calcule</th><th>Seuil projet</th><th>Avis</th></tr></thead><tbody>
          <tr><td>A-SF1</td><td>5 mm</td><td>15 mm</td><td className={styles.statusOk}>OK</td></tr>
          <tr><td>A-SF2</td><td>7 mm</td><td>15 mm</td><td className={styles.statusOk}>OK</td></tr>
          <tr><td>Differentiel indicatif</td><td>2 mm</td><td>a coordonner structure</td><td className={styles.statusOk}>Compatible</td></tr>
        </tbody></table>
      </article>

      <article className={styles.chapter}>
        <h2><span className={styles.chapterNumber}>13</span>Conception des fondations - secteur A</h2>
        <div className={[styles.callout,styles.calloutOk].join(" ")}><strong>Solution de reference :</strong> semelles filantes ou isolees rigidifiees, ancrees integralement dans le terrain naturel competent, avec purge des remblais et reception geotechnique du fond de fouille.</div>
        <ul className={styles.list}><li>eviter toute assise mixte remblai / terrain naturel ;</li><li>uniformiser les niveaux d'assise autant que possible ;</li><li>prevoir longrines de liaison si le BET structure l'impose ;</li><li>beton de proprete immediat apres reception du fond de fouille.</li></ul>
      </article>

      <article className={styles.chapter}>
        <h2><span className={styles.chapterNumber}>14</span>Conception des fondations - secteur B</h2>
        <p>La solution superficielle principale n'est pas retenue en raison de l'heterogeneite et des zones de faible resistance. Deux familles de solutions restent ouvertes apres reconnaissance complementaire.</p>
        <div className={styles.comparison}>
          <div className={[styles.option,styles.optionRecommended].join(" ")}><h3>Micropieux</h3><p>Reprise jusqu'a un horizon continu et competent.</p><p className={styles.statusOk}>Reference si l'horizon profond est confirme.</p></div>
          <div className={styles.option}><h3>Traitement de terrain</h3><p>Amelioration locale ou globale selon extension des anomalies.</p><p className={styles.riskMed}>A etudier techniquement et economiquement.</p></div>
          <div className={styles.option}><h3>Radier</h3><p>Possible seulement si deformabilite et continuite deviennent compatibles.</p><p className={styles.riskMed}>Non retenu sans etude complementaire.</p></div>
        </div>
      </article>

      <article className={styles.chapter}>
        <h2><span className={styles.chapterNumber}>15</span>Ouvrages enterres et piscines</h2>
        <ul className={styles.list}><li>desolidariser si necessaire les ouvrages de comportements differents ;</li><li>verifier la poussee hydrostatique en phase accidentelle ;</li><li>prevoir drainage et etancheite compatibles avec la topographie ;</li><li>eviter l'infiltration concentree au voisinage des fondations principales.</li></ul>
      </article>

      <article className={styles.chapter}>
        <h2><span className={styles.chapterNumber}>16</span>Terrassements et fouilles</h2>
        <p>Les terrassements doivent limiter les decompressions et les venues d'eau. Les talus provisoires sont a adapter a la hauteur de fouille, a l'espace disponible et au delai d'exposition.</p>
        <div className={styles.calloutWarn+" "+styles.callout}><strong>Interdiction de principe :</strong> laisser un fond de fouille argileux expose longtemps a la pluie ou au soleil avant beton de proprete.</div>
      </article>

      <article className={styles.chapter}>
        <h2><span className={styles.chapterNumber}>17</span>Soutenements et voiles enterres</h2>
        <p>Les soutenements doivent etre calcules avec les actions de terre, surcharges de chantier, eau accidentelle et interaction avec les fondations voisines. La presente G2 PRO fixe les hypotheses geotechniques mais ne remplace pas la note structure du mur.</p>
      </article>

      <article className={styles.chapter}>
        <h2><span className={styles.chapterNumber}>18</span>Eau, drainage et etancheite</h2>
        <table className={styles.table}><thead><tr><th>Risque</th><th>Prescription</th></tr></thead><tbody>
          <tr><td>ruissellement amont</td><td>collecte en tete et evacuation maitrisee</td></tr>
          <tr><td>eau contre voiles</td><td>drainage + etancheite selon conception</td></tr>
          <tr><td>reseaux</td><td>essais d'etancheite et recollement</td></tr>
          <tr><td>infiltration au pied</td><td>a proscrire</td></tr>
        </tbody></table>
      </article>

      <article className={styles.chapter}>
        <h2><span className={styles.chapterNumber}>19</span>RGA et variations hydriques</h2>
        <p>Meme lorsque les fondations sont suffisamment encastrees, la maitrise des variations hydriques reste necessaire pour les amenagements, murs, dallages et ouvrages annexes. Les plantations et reseaux doivent etre integres au plan de prevention.</p>
      </article>

      <article className={styles.chapter}>
        <h2><span className={styles.chapterNumber}>20</span>Seisme - dispositions geotechniques</h2>
        <p>La verification sismique definitive appartient au projet structure. La geotechnique doit cependant assurer la coherence des fondations, l'absence d'assise mixte et la bonne transmission des efforts horizontaux dans le sol de fondation.</p>
      </article>

      <article className={styles.chapter}>
        <h2><span className={styles.chapterNumber}>21</span>Prescriptions G3 / G4</h2>
        <table className={styles.table}><thead><tr><th>Phase</th><th>Controle requis</th></tr></thead><tbody>
          <tr><td>G3 etude</td><td>dimensionnement final selon descentes de charges</td></tr>
          <tr><td>G3 suivi</td><td>adaptation aux terrains effectivement rencontres</td></tr>
          <tr><td>G4 etude</td><td>avis sur hypotheses et notes G3</td></tr>
          <tr><td>G4 chantier</td><td>reception fouilles, forages, injections, essais et drainage</td></tr>
        </tbody></table>
      </article>

      <article className={styles.chapter}>
        <h2><span className={styles.chapterNumber}>22</span>Registre des risques residuels</h2>
        <table className={[styles.table,styles.matrix].join(" ")}><thead><tr><th>Risque</th><th>Probabilite</th><th>Impact</th><th>Niveau</th><th>Action</th></tr></thead><tbody>
          <tr><td>extension reelle de la zone decompressee</td><td>moyenne</td><td>fort</td><td className={styles.riskHigh}>Eleve</td><td>investigation complementaire</td></tr>
          <tr><td>variation des charges BET structure</td><td>moyenne</td><td>moyen</td><td className={styles.riskMed}>Modere</td><td>recalcul avant EXE</td></tr>
          <tr><td>venue d'eau en fouille</td><td>faible a moyenne</td><td>moyen</td><td className={styles.riskMed}>Modere</td><td>pompage / drainage provisoire</td></tr>
          <tr><td>fond de fouille altere</td><td>moyenne</td><td>fort</td><td className={styles.riskHigh}>Eleve</td><td>reception immediate</td></tr>
        </tbody></table>
      </article>

      <article className={styles.chapter}>
        <h2><span className={styles.chapterNumber}>23</span>Prescriptions a reprendre au DCE / CCTP</h2>
        <ul className={styles.list}><li>obligation de reception geotechnique des fonds de fouille ;</li><li>purge des sols remanies et substitution si necessaire ;</li><li>interdiction d'assise mixte ;</li><li>recollement des forages et volumes injectes ;</li><li>essais de controle sur fondations profondes selon projet ;</li><li>gestion des eaux provisoire et definitive ;</li><li>procedure d'arret en cas d'anomalie non prevue.</li></ul>
      </article>

      <article className={styles.chapter}>
        <h2><span className={styles.chapterNumber}>24</span>Conclusion generale et avis G2 PRO</h2>
        <div className={[styles.callout,styles.calloutOk].join(" ")}><strong>AVIS PRO :</strong> le projet est geotechniquement compatible avec le site sous reserve d'un zonage des solutions. Le secteur A peut etre traite par fondations superficielles rigidifiees. Le secteur B necessite une reconnaissance complementaire avant choix et dimensionnement definitifs de la solution profonde ou du traitement.</div>
        <table className={styles.table}><thead><tr><th>Point</th><th>Avis</th></tr></thead><tbody>
          <tr><td>fondations secteur A</td><td className={styles.statusOk}>OK sous conditions</td></tr>
          <tr><td>fondations secteur B</td><td className={styles.statusWarn}>BLOQUEES avant complement</td></tr>
          <tr><td>terrassements</td><td className={styles.statusOk}>faisables avec precautions</td></tr>
          <tr><td>eau / drainage</td><td className={styles.statusWarn}>a integrer au DCE</td></tr>
          <tr><td>passage G3 / G4</td><td className={styles.statusOk}>obligatoire pour execution</td></tr>
        </tbody></table>
      </article>

      <article className={styles.chapter}>
        <h2>Annexes du specimen</h2>
        <div className={styles.annex}>Annexe A - Plan fictif d'implantation des sondages</div>
        <div className={styles.annex}>Annexe B - Logs lithologiques synthetiques</div>
        <div className={styles.annex}>Annexe C - Tableau complet des essais pressiometriques fictifs</div>
        <div className={styles.annex}>Annexe D - Feuilles de calcul portance / tassement</div>
        <div className={styles.annex}>Annexe E - Carte de zonage des solutions</div>
        <div className={styles.annex}>Annexe F - Registre des risques et prescriptions DCE</div>
      </article>

      <div className={styles.signature}>
        <div className={styles.signatureBox}><strong>Production</strong><p>VarGeo.AI - calculs, controle et redaction tracee</p></div>
        <div className={styles.signatureBox}><strong>Validation</strong><p>Ingenieur geotechnicien responsable de mission</p></div>
      </div>
    </section>

    <footer className={styles.footer}>VarGeo.AI · Rapport specimen G2 PRO · Demonstration publique</footer>
  </main>;
}
