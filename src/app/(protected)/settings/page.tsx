import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { aiRuntimeStatus } from "@/lib/ai-governance";
import AdminUsersPanel from "@/components/admin-users-panel";

const refs = ["NF P 94-500", "NF EN ISO 22475-1", "NF P 94-110-1", "NF P 94-261", "NF P 94-262", "NF P 94-281", "EN 1997-1", "EN 1997-2", "DTU 13.1", "DTU 13.2", "DTU 13.3"];

type AiStats={
  runs_24h:number;
  completed_24h:number;
  partial_24h:number;
  failed_24h:number;
  active_users_24h:number;
};
type TokenStats={total_tokens:string|number};
type ModelStat={model:string;calls:number};

export default async function Settings() {
  const user = await requireUser();
  if(user.role==="client") redirect("/affaires");
  const runtime=aiRuntimeStatus();
  const sql=db();

  const users = user.role === "admin"
    ? await sql.query("SELECT id,email,name,role,is_active,created_at,last_login_at FROM users WHERE organization_id=$1 ORDER BY name", [user.organization_id])
    : [];

  const [statsRows,tokenRows,modelRows]=user.role==="admin"
    ? await Promise.all([
        sql.query<AiStats>(
          `SELECT
             count(*) FILTER (WHERE created_at>now()-interval '24 hours')::int runs_24h,
             count(*) FILTER (WHERE created_at>now()-interval '24 hours' AND status='completed')::int completed_24h,
             count(*) FILTER (WHERE created_at>now()-interval '24 hours' AND status='partial')::int partial_24h,
             count(*) FILTER (WHERE created_at>now()-interval '24 hours' AND status='failed')::int failed_24h,
             count(DISTINCT user_id) FILTER (WHERE created_at>now()-interval '24 hours')::int active_users_24h
           FROM ai_runs WHERE organization_id=$1`,
          [user.organization_id]
        ),
        sql.query<TokenStats>(
          `SELECT COALESCE(sum(COALESCE((s.metadata#>>'{usage,totalTokens}')::bigint,0)),0)::bigint total_tokens
           FROM ai_agent_steps s
           JOIN ai_runs r ON r.id=s.run_id
           WHERE r.organization_id=$1 AND s.started_at>now()-interval '24 hours'`,
          [user.organization_id]
        ),
        sql.query<ModelStat>(
          `SELECT COALESCE(s.model,'non renseigné') model,count(*)::int calls
           FROM ai_agent_steps s
           JOIN ai_runs r ON r.id=s.run_id
           WHERE r.organization_id=$1 AND s.started_at>now()-interval '24 hours' AND s.status='completed'
           GROUP BY s.model ORDER BY calls DESC LIMIT 8`,
          [user.organization_id]
        )
      ])
    : [[],[],[]];

  const stats=(statsRows[0] as AiStats|undefined) ?? {runs_24h:0,completed_24h:0,partial_24h:0,failed_24h:0,active_users_24h:0};
  const totalTokens=Number((tokenRows[0] as TokenStats|undefined)?.total_tokens??0);

  return <div className="content">
    <div className="hero"><div>
      <div className="eyebrow">Gouvernance technique</div>
      <h1 className="title">Référentiel & paramètres</h1>
      <p className="subtitle">Contrôle des référentiels, services, utilisateurs et exécutions IA sans exposer les secrets.</p>
    </div></div>

    <div className="grid grid-3">
      <div className="card"><h3>Utilisateur</h3><p>{user.name}</p><span className="badge">{user.role}</span></div>
      <div className="card"><h3>Base de données</h3><p className="success">Configurée</p><p className="muted">Connexion serveur uniquement.</p></div>
      <div className="card">
        <h3>Couche IA</h3>
        <p className={runtime.configured ? "success" : "muted"}>{runtime.configured ? "Prête" : "En attente de clé"}</p>
        <p className="muted">{runtime.model ? `Principal : ${runtime.model}` : "Modèle principal non configuré"}</p>
      </div>
    </div>

    {user.role==="admin"&&<div style={{marginTop:18}}>
      <div className="eyebrow">Supervision IA · dernières 24 h</div>
      <div className="grid grid-3" style={{marginTop:10}}>
        <div className="card"><div className="muted">Analyses</div><div className="metric">{stats.runs_24h}</div><div className="muted">{stats.active_users_24h} utilisateur(s) actif(s)</div></div>
        <div className="card"><div className="muted">Terminées / partielles / échecs</div><div className="metric">{stats.completed_24h} / {stats.partial_24h} / {stats.failed_24h}</div></div>
        <div className="card"><div className="muted">Tokens agents</div><div className="metric">{totalTokens.toLocaleString("fr-FR")}</div><div className="muted">Selon métadonnées retournées par la passerelle</div></div>
      </div>
      <div className="card" style={{marginTop:18}}>
        <h3>Modèles utilisés · 24 h</h3>
        {modelRows.length?<div className="toolbar">{modelRows.map((m)=><span className="badge" key={m.model}>{m.model} · {m.calls} appel(s)</span>)}</div>:<p className="muted">Aucun appel IA abouti sur la période.</p>}
        <p className="notice" style={{marginTop:16}}>
          Limites actuelles : {runtime.limits.maxRunsPerHour} analyses/heure/utilisateur, {runtime.limits.maxConcurrentRuns} analyse(s) simultanée(s), {runtime.limits.maxQuestionChars.toLocaleString("fr-FR")} caractères par question.
        </p>
      </div>
    </div>}

    <div className="card" style={{ marginTop: 18 }}>
      <h3>Référentiel principal</h3>
      <div className="toolbar">{refs.map((x) => <span className="badge" key={x}>{x}</span>)}</div>
      <p className="notice" style={{ marginTop: 16 }}>Les références affichées orientent la mission. La conformité d'un calcul ou d'un rapport ne peut être prononcée qu'après vérification de la version applicable, du domaine d'emploi et des hypothèses.</p>
    </div>

    {user.role === "admin" && <AdminUsersPanel users={users as any} />}
  </div>;
}
