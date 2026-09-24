import Link from "next/link";
import styles from "../report.module.css";

export const metadata={title:"Rapport specimen G5 RGA - VarGeo.AI"};

const toc=[
"Objet, cadre et limites de la mission",
"Documents et donnees examines",
"Description de l'ouvrage et des desordres",
"Contexte geologique et hydrique",
"Investigations et observations disponibles",
"Modele geotechnique retenu",
"Analyse des fondations existantes",
"Analyse de la fissuration",
"Analyse hydrique et facteurs aggravants",
"Diagnostic causal",
"Instrumentation et suivi",
"Scenarios de traitement",
"Principe de reprise en sous-oeuvre",
"Eau, drainage et vegetation",
"Phasage et precautions d'execution",
"Registre des risques residuels",
"Programme G2 PRO / G3 / G4",
"Conclusion generale et avis G5"
];

export default function G5Example(){
  return <main className={styles.page}>
    <header className={styles.nav}>
      <Link href="/" className={styles.brand}>VarGeo.AI</Link>
      <div className={styles.navlinks}>
        <Link href="/" className={styles.btnAlt}>Accueil</Link>
        <Link href="/exemples/g2-pro" className={styles.btnAlt}>Voir le G2 PRO</Link>
        <Link href="/#devis" className={styles.btn}>Demander une demonstration</Link>
      </div>
    </header>

    <section className={styles.hero}>
      <div className={styles.eyebrow}>Rapport specimen professionnel · Mission G5</div>
      <h1>Diagnostic geotechnique d'un batiment fissure en contexte de retrait-gonflement des argiles</h1>
      <p className={styles.lead}>Exemple complet reconstitue montrant le niveau de structuration, de controle, de calcul et de tracabilite attendu d'un rapport VarGeo.AI. Les donnees sont fictives et non rattachables a un client reel.</p>
      <div className={styles.reportMeta}>
        <span className={styles.badge}>NF P 94-500</span><span className={styles.badge}>Eurocode 7</span><span className={styles.badge}>M1 STRAT</span><span className={styles.badge}>M3 FONDA</span><span className={styles.badge}>M5 SENSOR</span><span className={styles.badge}>M6 STRUCT</span><span className={styles.badge}>M8 HYDRO</span>
      </div>
    </section>

    <div className={styles.warning}><strong>SPECIMEN DE DEMONSTRATION.</strong> Ce rapport reproduit une logique professionnelle de diagnostic mais ne correspond a aucun chantier reel. Les profondeurs, valeurs, quantites et conclusions sont volontairement generiques.</div>

    <section className={styles.report}>
      <div className={styles.coverGrid}>
        <article className={styles.card}>
          <div className={styles.smallcaps}>Fiche de controle du document</div>
          <table className={styles.controlTable}><tbody>
            <tr><td>Mission</td><td>G5 - Diagnostic geotechnique d'un ouvrage existant sinistre</td></tr>
            <tr><td>Ouvrage</td><td>Batiment collectif R+3 sur fondations superficielles</td></tr>
            <tr><td>Contexte</td><td>Fissuration evolutive en environnement argileux</td></tr>
            <tr><td>Objet</td><td>Analyser l'interaction sol - eau - fondations - structure - chronologie</td></tr>
            <tr><td>Statut</td><td>Specimen public - non opposable</td></tr>
            <tr><td>Indice</td><td>DEMO A</td></tr>
          </tbody></table>
        </article>
        <article className={styles.card}>
          <div className={styles.smallcaps}>Avis de synthese</div>
          <div className={styles.kpi}>Mecanisme RGA contributif</div>
          <p>Les donnees disponibles sont compatibles avec des mouvements differentiels de fondations superficielles situes dans une zone active hydrique. La gestion des eaux et la continuite des appuis constituent des facteurs aggravants probables.</p>
          <div className={[styles.callout,styles.calloutWarn].join(" ")}><strong>Suite de mission :</strong> le G5 fixe le diagnostic et le principe de traitement. Le dimensionnement de la reprise releve d'une G2 PRO puis des missions G3/G4.</div>
        </article>
      </div>

      <article className={styles.chapter}>
        <h2>Sommaire detaille</h2>
        <ol className={styles.toc}>{toc.map((x)=><li key={x}>{x}</li>)}</ol>
      </article>

      <article className={styles.chapter}>
        <h2><span className={styles.chapterNumber}>1</span>Objet, cadre et limites de la mission</h2>
        <p>La mission porte sur le diagnostic geotechnique d'un ouvrage existant affecte par des fissures apparues progressivement et presentant une evolution saisonniere. L'objectif est d'identifier les mecanismes geotechniques compatibles, de hierarchiser les facteurs de causalite et de definir les suites de conception necessaires.</p>
        <div className={styles.callout}>VarGeo.AI distingue explicitement : <strong>faits constates</strong>, <strong>donnees mesurees</strong>, <strong>hypotheses de travail</strong>, <strong>calculs</strong> et <strong>avis d'ingenieur</strong>.</div>
        <h3>Limites</h3>
        <ul className={styles.list}><li>absence de descente de charges structurelle exhaustive ;</li><li>absence de recollement complet des fondations ;</li><li>niveau d'eau observe ponctuellement uniquement ;</li><li>instrumentation disponible sur une periode limitee ;</li><li>aucun dimensionnement d'execution de micropieux ou longrines dans la presente G5.</li></ul>
      </article>

      <article className={styles.chapter}>
        <h2><span className={styles.chapterNumber}>2</span>Documents et donnees examines</h2>
        <table className={styles.table}><thead><tr><th>Famille</th><th>Donnees analysees</th><th>Controle VarGeo.AI</th></tr></thead><tbody>
          <tr><td>Structure</td><td>plans de niveaux, plans de fondations, releves de fissures</td><td>coherence geometrie / desordres</td></tr>
          <tr><td>Geotechnique</td><td>sondages destructifs, pressiometrie, reconnaissance de fondations</td><td>qualite et representativite des donnees</td></tr>
          <tr><td>Hydrique</td><td>pluie, humidite du sol, reseaux, drainage</td><td>correlation temporelle</td></tr>
          <tr><td>Historique</td><td>dates d'apparition, aggravation, travaux anterieurs</td><td>chronologie causale</td></tr>
        </tbody></table>
      </article>

      <article className={styles.chapter}>
        <h2><span className={styles.chapterNumber}>3</span>Description de l'ouvrage et des desordres</h2>
        <p>Le batiment est suppose constitue de murs porteurs en maconnerie et voiles beton, repris sur semelles filantes et ponctuelles. Les fissures sont majoritairement obliques et en escalier, localisees au droit de changements de rigidite, d'angles et de zones d'appui differenciees.</p>
        <div className={styles.calcGrid}>
          <div className={styles.calcBox}><span>Typologie</span><strong>diagonales</strong></div>
          <div className={styles.calcBox}><span>Evolution</span><strong>saisonniere</strong></div>
          <div className={styles.calcBox}><span>Amplitude</span><strong>mm</strong></div>
          <div className={styles.calcBox}><span>Reversibilite</span><strong>partielle</strong></div>
        </div>
      </article>

      <article className={styles.chapter}>
        <h2><span className={styles.chapterNumber}>4</span>Contexte geologique et hydrique</h2>
        <p>Le modele de contexte retient une couverture superficielle remaniee, surmontant un horizon argileux a forte sensibilite aux variations de teneur en eau, puis un horizon plus ferme en profondeur.</p>
        <table className={styles.table}><thead><tr><th>Horizon</th><th>Profondeur indicative</th><th>Nature</th><th>Enjeu</th></tr></thead><tbody>
          <tr><td>H1</td><td>0 a env. 1 m</td><td>remblais / sols remanies</td><td>heterogeneite</td></tr>
          <tr><td>H2</td><td>env. 1 a 5 m</td><td>argiles et limons argileux</td><td>zone active RGA</td></tr>
          <tr><td>H3</td><td>au-dela</td><td>formation plus compacte</td><td>cible potentielle de reprise</td></tr>
        </tbody></table>
      </article>

      <article className={styles.chapter}>
        <h2><span className={styles.chapterNumber}>5</span>Investigations et observations disponibles</h2>
        <table className={styles.table}><thead><tr><th>Investigation</th><th>But</th><th>Resultat synthetique</th></tr></thead><tbody>
          <tr><td>2 sondages pressiometriques</td><td>profil mecanique</td><td>heterogeneite superficielle, amelioration en profondeur</td></tr>
          <tr><td>2 reconnaissances de fondations</td><td>geometrie / assise</td><td>fondations superficielles dans la zone active</td></tr>
          <tr><td>prelevements</td><td>identification des sols</td><td>sols fins plastiques</td></tr>
          <tr><td>instrumentation fissures</td><td>cinematique</td><td>ouvertures / refermetures saisonnieres</td></tr>
        </tbody></table>
      </article>

      <article className={styles.chapter}>
        <h2><span className={styles.chapterNumber}>6</span>Modele geotechnique retenu</h2>
        <p>Les valeurs ci-dessous sont des valeurs de demonstration volontairement arrondies. Elles illustrent la facon dont VarGeo.AI construit une enveloppe de calcul conservative.</p>
        <table className={styles.table}><thead><tr><th>Horizon</th><th>pL* representatif</th><th>EM representatif</th><th>Alpha</th><th>Utilisation</th></tr></thead><tbody>
          <tr><td>H1</td><td>0,4 MPa</td><td>4 MPa</td><td>0,67</td><td>non porteur de reference</td></tr>
          <tr><td>H2</td><td>0,8 MPa</td><td>7 MPa</td><td>0,67</td><td>diagnostic des appuis existants</td></tr>
          <tr><td>H3</td><td>2,5 MPa</td><td>25 MPa</td><td>0,50</td><td>cible potentielle pour RSO</td></tr>
        </tbody></table>
      </article>

      <article className={styles.chapter}>
        <h2><span className={styles.chapterNumber}>7</span>Analyse des fondations existantes</h2>
        <p>Les fondations sont superficielles et se situent dans l'horizon soumis aux variations hydriques. La profondeur d'assise est donc consideree comme insuffisante pour s'affranchir totalement de la zone active.</p>
        <div className={styles.calloutWarn+" "+styles.callout}><strong>Point critique :</strong> la presence d'une fondation superficielle dans la zone active ne suffit pas, a elle seule, a prouver le RGA. Elle devient significative lorsqu'elle est coherente avec la nature du sol, la chronologie, la cinematique et les facteurs hydriques.</div>
      </article>

      <article className={styles.chapter}>
        <h2><span className={styles.chapterNumber}>8</span>Analyse de la fissuration</h2>
        <table className={styles.table}><thead><tr><th>Phase</th><th>Comportement</th><th>Interpretation</th></tr></thead><tbody>
          <tr><td>printemps / debut ete</td><td>faible variation</td><td>etat de reference</td></tr>
          <tr><td>ete sec</td><td>ouverture progressive</td><td>dessiccation compatible</td></tr>
          <tr><td>automne humide</td><td>refermeture partielle</td><td>rehumidification compatible</td></tr>
          <tr><td>cycle suivant</td><td>reprise du mouvement</td><td>mecanisme actif</td></tr>
        </tbody></table>
      </article>

      <article className={styles.chapter}>
        <h2><span className={styles.chapterNumber}>9</span>Analyse hydrique et facteurs aggravants</h2>
        <div className={styles.cards3}>
          <div className={styles.decision}><strong>Ruissellement</strong><span className={styles.riskMed}>RISQUE MODERE</span><p>pentes et collectes a verifier autour des facades.</p></div>
          <div className={styles.decision}><strong>Reseaux enterres</strong><span className={styles.riskMed}>A CONTROLER</span><p>fuite lente ou exfiltration possibles sans trace en surface.</p></div>
          <div className={styles.decision}><strong>Vegetation</strong><span className={styles.riskMed}>FACTEUR POSSIBLE</span><p>influence racinaire a analyser selon distance et essence.</p></div>
        </div>
      </article>

      <article className={styles.chapter}>
        <h2><span className={styles.chapterNumber}>10</span>Diagnostic causal</h2>
        <table className={[styles.table,styles.matrix].join(" ")}><thead><tr><th>Facteur</th><th>Coherence</th><th>Poids diagnostic</th><th>Commentaire</th></tr></thead><tbody>
          <tr><td>Sols argileux</td><td>forte</td><td className={styles.riskHigh}>Eleve</td><td>sols sensibles presents sous les appuis</td></tr>
          <tr><td>Chronologie secheresse</td><td>forte</td><td className={styles.riskHigh}>Eleve</td><td>evolution compatible avec cycles hydriques</td></tr>
          <tr><td>Fondations superficielles</td><td>forte</td><td className={styles.riskHigh}>Eleve</td><td>implantation dans zone active</td></tr>
          <tr><td>Gestion des eaux</td><td>moyenne</td><td className={styles.riskMed}>Modere</td><td>peut amplifier les gradients hydriques</td></tr>
          <tr><td>Defaut structurel seul</td><td>faible a moyenne</td><td className={styles.riskLow}>Secondaire</td><td>n'explique pas seul la cyclicite observee</td></tr>
        </tbody></table>
        <div className={[styles.callout,styles.calloutOk].join(" ")}><strong>Avis de diagnostic :</strong> un mecanisme de retrait-gonflement des argiles est retenu comme cause geotechnique compatible et contributive, avec facteurs aggravants hydriques possibles.</div>
      </article>

      <article className={styles.chapter}>
        <h2><span className={styles.chapterNumber}>11</span>Instrumentation et suivi</h2>
        <p>Le suivi doit permettre de verifier la stabilisation avant travaux, de documenter le comportement pendant chantier et de confirmer l'efficacite du traitement.</p>
        <table className={styles.table}><thead><tr><th>Capteur</th><th>Nombre indicatif</th><th>Frequence</th><th>Usage</th></tr></thead><tbody>
          <tr><td>fissurometre</td><td>3 a 5</td><td>horaire / journalier</td><td>cinematique</td></tr>
          <tr><td>humidite sol</td><td>2 a 4</td><td>horaire</td><td>correlation hydrique</td></tr>
          <tr><td>pluviometre</td><td>1</td><td>horaire</td><td>evenements de pluie</td></tr>
          <tr><td>gateway</td><td>1</td><td>temps reel</td><td>teletransmission</td></tr>
        </tbody></table>
      </article>

      <article className={styles.chapter}>
        <h2><span className={styles.chapterNumber}>12</span>Scenarios de traitement</h2>
        <div className={styles.comparison}>
          <div className={styles.option}><h3>A - Eau uniquement</h3><p>Drainage, reseaux, gestion des EP.</p><p className={styles.riskMed}>Insuffisant si mouvements d'appui deja installes.</p></div>
          <div className={styles.option}><h3>B - Reprise localisee</h3><p>Traitement de quelques zones fissurees.</p><p className={styles.riskMed}>Risque de transfert de deformation.</p></div>
          <div className={[styles.option,styles.optionRecommended].join(" ")}><h3>C - Reprise coherente</h3><p>RSO des lignes porteuses concernees + longrines + gestion des eaux.</p><p className={styles.statusOk}>Scenario de reference a etudier en G2 PRO.</p></div>
        </div>
      </article>

      <article className={styles.chapter}>
        <h2><span className={styles.chapterNumber}>13</span>Principe de reprise en sous-oeuvre</h2>
        <p>Le principe retenu pour la demonstration est une reprise profonde par micropieux ou elements equivalents, connectes aux murs porteurs par des longrines ou massifs de transfert. L'ancrage devra etre confirme dans un horizon continu et competent.</p>
        <div className={styles.formula}>Capacite geotechnique unitaire = frottement lateral + eventuelle resistance de pointe{"\n"}Verification = ELU + ELS + tassements + interaction groupe{"\n"}Dimensionnement final = G2 PRO + note structure</div>
      </article>

      <article className={styles.chapter}>
        <h2><span className={styles.chapterNumber}>14</span>Eau, drainage et vegetation</h2>
        <ul className={styles.list}><li>collecter et evacuer les eaux pluviales sans infiltration au pied des facades ;</li><li>controler l'etancheite des reseaux enterres ;</li><li>eviter les variations hydriques brutales apres travaux ;</li><li>traiter les plantations a proximite selon leur developpement racinaire ;</li><li>ne pas creer de drains susceptibles d'assecher unilatéralement le sol sans etude.</li></ul>
      </article>

      <article className={styles.chapter}>
        <h2><span className={styles.chapterNumber}>15</span>Phasage et precautions d'execution</h2>
        <ol className={styles.list}><li>instrumenter et etablir un etat zero ;</li><li>reconnaitre les reseaux et structures existantes ;</li><li>executer les reprises par passes et sequence controlee ;</li><li>surveiller les fissures pendant les phases sensibles ;</li><li>recoler les longueurs, injections et charges d'essai ;</li><li>maintenir le suivi post-travaux.</li></ol>
      </article>

      <article className={styles.chapter}>
        <h2><span className={styles.chapterNumber}>16</span>Registre des risques residuels</h2>
        <table className={styles.table}><thead><tr><th>Risque</th><th>Niveau</th><th>Mesure</th></tr></thead><tbody>
          <tr><td>horizon porteur discontinu</td><td className={styles.riskHigh}>Eleve</td><td>forages complementaires profonds</td></tr>
          <tr><td>reseau fuyard non detecte</td><td className={styles.riskMed}>Modere</td><td>inspection / essais d'etancheite</td></tr>
          <tr><td>transfert de charge incomplet</td><td className={styles.riskHigh}>Eleve</td><td>note structure PRO</td></tr>
          <tr><td>mouvement residuel post-travaux</td><td className={styles.riskMed}>Modere</td><td>instrumentation 6 a 12 mois</td></tr>
        </tbody></table>
      </article>

      <article className={styles.chapter}>
        <h2><span className={styles.chapterNumber}>17</span>Programme G2 PRO / G3 / G4</h2>
        <table className={styles.table}><thead><tr><th>Mission</th><th>Livrables attendus</th></tr></thead><tbody>
          <tr><td>G2 PRO</td><td>modele final, valeurs caracteristiques, capacites, longueurs, tassements, prescriptions d'execution</td></tr>
          <tr><td>BET structure PRO</td><td>descente de charges, longrines, massifs, armatures, interfaces existant / neuf</td></tr>
          <tr><td>G3</td><td>dimensionnement EXE, methodes et plans d'execution</td></tr>
          <tr><td>G4</td><td>avis sur etudes G3, controles de chantier, adaptations au terrain rencontre</td></tr>
        </tbody></table>
      </article>

      <article className={styles.chapter}>
        <h2><span className={styles.chapterNumber}>18</span>Conclusion generale et avis G5</h2>
        <div className={[styles.callout,styles.calloutOk].join(" ")}><strong>AVIS G5 :</strong> la combinaison sol argileux sensible + fondations superficielles dans la zone active + cinematique saisonniere rend le mecanisme RGA techniquement compatible et contributif. Une reprise structurelle ne doit etre engagee qu'apres conception G2 PRO.</div>
        <table className={styles.table}><thead><tr><th>Decision</th><th>Statut</th></tr></thead><tbody>
          <tr><td>poursuivre l'instrumentation</td><td className={styles.statusOk}>OUI</td></tr>
          <tr><td>maitriser les eaux</td><td className={styles.statusOk}>OUI</td></tr>
          <tr><td>dimensionner une RSO en G5</td><td className={styles.statusWarn}>NON - G2 PRO requise</td></tr>
          <tr><td>engager G3/G4 apres conception</td><td className={styles.statusOk}>OUI</td></tr>
        </tbody></table>
      </article>

      <article className={styles.chapter}>
        <h2>Annexes du specimen</h2>
        <div className={styles.annex}>Annexe A - Plan d'implantation fictif des investigations</div>
        <div className={styles.annex}>Annexe B - Tableau synthetique des essais pressiometriques fictifs</div>
        <div className={styles.annex}>Annexe C - Chronologie instrumentee fictive</div>
        <div className={styles.annex}>Annexe D - Matrice de causalite et registre des hypotheses</div>
        <div className={styles.annex}>Annexe E - Programme de mission G2 PRO recommande</div>
      </article>

      <div className={styles.signature}>
        <div className={styles.signatureBox}><strong>Redaction</strong><p>VarGeo.AI - production assistee et tracee</p></div>
        <div className={styles.signatureBox}><strong>Validation</strong><p>Ingenieur geotechnicien responsable de mission</p></div>
      </div>
    </section>

    <footer className={styles.footer}>VarGeo.AI · Rapport specimen G5 · Demonstration publique</footer>
  </main>;
}
