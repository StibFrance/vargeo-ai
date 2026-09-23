import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import AdminUsersPanel from "@/components/admin-users-panel";

const refs = ["NF P 94-500", "NF EN ISO 22475-1", "NF P 94-110-1", "NF P 94-261", "NF P 94-262", "NF P 94-281", "EN 1997-1", "EN 1997-2", "DTU 13.1", "DTU 13.2", "DTU 13.3"];

export default async function Settings() {
  const user = await requireUser();
  const ai = Boolean(process.env.AI_GATEWAY_BASE_URL && process.env.AI_GATEWAY_API_KEY && process.env.AI_MODEL);
  const users = user.role === "admin"
    ? await db().query("SELECT id,email,name,role,is_active,created_at,last_login_at FROM users WHERE organization_id=$1 ORDER BY name", [user.organization_id])
    : [];

  return <div className="content">
    <div className="hero"><div><div className="eyebrow">Gouvernance technique</div><h1 className="title">Referentiel & parametres</h1><p className="subtitle">Controle des referentiels, services et utilisateurs sans exposer les secrets.</p></div></div>
    <div className="grid grid-3">
      <div className="card"><h3>Utilisateur</h3><p>{user.name}</p><span className="badge">{user.role}</span></div>
      <div className="card"><h3>Base de donnees</h3><p className="success">Configuree</p><p className="muted">Connexion serveur uniquement.</p></div>
      <div className="card"><h3>Couche IA</h3><p className={ai ? "success" : "muted"}>{ai ? "Configuree" : "Non configuree"}</p><p className="muted">La plateforme reste utilisable pour les calculs sans IA.</p></div>
    </div>
    <div className="card" style={{ marginTop: 18 }}><h3>Referentiel principal</h3><div className="toolbar">{refs.map((x) => <span className="badge" key={x}>{x}</span>)}</div><p className="notice" style={{ marginTop: 16 }}>Les references affichees orientent la mission. La conformite d'un calcul ou d'un rapport ne peut etre prononcee qu'apres verification de la version applicable, du domaine d'emploi et des hypotheses.</p></div>
    {user.role === "admin" && <AdminUsersPanel users={users as any} />}
  </div>;
}
