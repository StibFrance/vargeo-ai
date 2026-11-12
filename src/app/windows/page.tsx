import Link from "next/link";

export default function WindowsPage(){
  const download="https://github.com/StibFrance/vargeo-ai/releases/download/desktop-latest/VarGeo-AI-Setup-1.0.0.exe";
  return <main className="public-site">
    <header className="public-nav">
      <div className="brand"><div className="brand-mark"/><div><strong>VarGéo.AI</strong><small>Application Windows</small></div></div>
      <div className="toolbar"><Link className="button secondary" href="/">Retour au site</Link><Link className="button" href="/login">Connexion</Link></div>
    </header>

    <section className="public-hero">
      <div className="eyebrow">Client Windows officiel</div>
      <h1>VarGéo.AI directement sur votre poste Windows.</h1>
      <p>L'application Windows utilise le même environnement VarGéo.AI que la version web : mêmes dossiers, mêmes calculs, mêmes rapports et mêmes mises à jour, sans duplication des données.</p>
      <div className="toolbar">
        <a className="button" href={download}>Télécharger l'installateur Windows</a>
        <Link className="button secondary" href="/login">Utiliser la version web</Link>
      </div>
    </section>

    <section className="public-section">
      <div className="grid grid-3">
        <div className="card"><div className="module-code">INSTALLATION</div><h3>Installateur .exe</h3><p className="muted">Installation classique sous Windows 10/11, raccourci Bureau et menu Démarrer.</p></div>
        <div className="card"><div className="module-code">DONNÉES</div><h3>Un compte unique</h3><p className="muted">Vos identifiants et vos dossiers restent les mêmes entre le navigateur et l'application Windows.</p></div>
        <div className="card"><div className="module-code">MISES À JOUR</div><h3>Application toujours alignée</h3><p className="muted">Le cœur métier reste hébergé sur VarGéo.AI : les corrections serveur sont disponibles immédiatement.</p></div>
      </div>
    </section>

    <section className="public-section">
      <div className="card">
        <div className="eyebrow">Procédure</div>
        <h2>Installation en quelques étapes</h2>
        <ol>
          <li>Téléchargez <strong>VarGeo-AI-Setup-1.0.0.exe</strong>.</li>
          <li>Lancez l'installateur puis choisissez le dossier d'installation.</li>
          <li>Autorisez Windows si SmartScreen vous avertit que l'éditeur n'est pas encore signé numériquement.</li>
          <li>Ouvrez VarGéo.AI depuis le Bureau ou le menu Démarrer.</li>
          <li>Connectez-vous avec votre compte VarGéo.AI habituel.</li>
        </ol>
        <div className="notice">La version actuelle est distribuée sans certificat de signature de code Windows. L'application reste fonctionnelle, mais Windows peut afficher un avertissement SmartScreen lors de la première installation.</div>
      </div>
    </section>

    <footer className="public-footer">VarGéo.AI Windows · Var Géotechnique / STIB France</footer>
  </main>;
}
