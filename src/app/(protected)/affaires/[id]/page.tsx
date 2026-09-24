import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser, projectScope } from "@/lib/auth";
import { db } from "@/lib/db";
import ValidateAnalysisButton from "@/components/validate-analysis-button";
import ProjectMembersPanel from "@/components/project-members-panel";

export default async function ProjectDetail({params}:{params:Promise<{id:string}>}){
  const {id}=await params;
  const user=await requireUser();
  const sql=db();
  const scope=projectScope(user,"p",2);
  const projects=await sql.query(
    `SELECT p.*,c.name client_name
     FROM projects p
     LEFT JOIN clients c ON c.id=p.client_id
     WHERE p.id=$1 AND ${scope.clause}`,
    [id,...scope.params]
  );
  const p:any=projects[0];
  if(!p)notFound();

  const [analyses,reports,tests]=await Promise.all([
    sql.query("SELECT id,module_code,title,status,calculation_version,created_at,outputs FROM analyses WHERE project_id=$1 ORDER BY created_at DESC",[id]),
    sql.query("SELECT id,title,mission_type,status,current_version,updated_at FROM reports WHERE project_id=$1 ORDER BY updated_at DESC",[id]),
    sql.query(`SELECT count(DISTINCT b.id)::int boreholes,count(pt.id)::int pressio FROM boreholes b LEFT JOIN pressio_tests pt ON pt.borehole_id=b.id WHERE b.project_id=$1`,[id])
  ]);

  const clients=user.role==="admin"
    ? await sql.query(
        `SELECT u.id,u.name,u.email,
         EXISTS(SELECT 1 FROM project_members pm WHERE pm.project_id=$1 AND pm.user_id=u.id) assigned
         FROM users u
         WHERE u.organization_id=$2 AND u.role='client' AND u.is_active=true
         ORDER BY u.name`,
        [id,user.organization_id]
      )
    : [];

  const canValidate=user.role==="admin"||user.role==="engineer";
  const internal=user.role!=="client";

  return <div className="content">
    <div className="hero">
      <div>
        <div className="eyebrow">{p.code} · {p.mission_type}</div>
        <h1 className="title">{p.title}</h1>
        <p className="subtitle">{[p.address,p.postal_code,p.city].filter(Boolean).join(" ")||"Adresse non renseignée"} · Client : {p.client_name||"non renseigné"}</p>
      </div>
      {internal&&<div className="toolbar"><Link className="button" href="/modules">Nouveau calcul</Link><Link className="button secondary" href="/reports">Créer un rapport</Link></div>}
    </div>

    <div className="grid grid-3" style={{marginBottom:18}}>
      <div className="card"><div className="muted">Sondages</div><div className="metric">{String((tests[0] as any)?.boreholes??0)}</div></div>
      <div className="card"><div className="muted">Essais pressiométriques</div><div className="metric">{String((tests[0] as any)?.pressio??0)}</div></div>
      <div className="card"><div className="muted">Calculs</div><div className="metric">{analyses.length}</div></div>
    </div>

    <div className="split">
      <section className="card">
        <h3>Calculs et vérifications</h3>
        {analyses.map((a:any)=><div key={a.id} style={{padding:"14px 0",borderBottom:"1px solid var(--line)"}}>
          <div style={{display:"flex",justifyContent:"space-between",gap:12}}>
            <div><span className="module-code">{a.module_code}</span> <strong>{a.title}</strong><div className="muted" style={{fontSize:12}}>Version moteur {a.calculation_version} · {new Date(a.created_at).toLocaleString("fr-FR")}</div></div>
            <span className="badge">{a.status}</span>
          </div>
          <details style={{marginTop:10}}><summary className="muted">Voir le résultat tracé</summary><pre className="result">{JSON.stringify(a.outputs,null,2)}</pre></details>
          {canValidate&&a.status==="draft"&&<div style={{marginTop:10}}><ValidateAnalysisButton id={a.id}/></div>}
        </div>)}
        {!analyses.length&&<p className="muted">Aucun calcul rattaché.</p>}
      </section>

      <section className="card">
        <h3>Rapports</h3>
        {reports.map((r:any)=><Link key={r.id} href={`/reports/${r.id}`} style={{display:"block",padding:"14px 0",borderBottom:"1px solid var(--line)"}}>
          <strong>{r.mission_type}</strong><div className="muted">{r.title}</div><span className="badge">V{r.current_version} · {r.status}</span>
        </Link>)}
        {!reports.length&&<p className="muted">Aucun rapport.</p>}
      </section>
    </div>

    {user.role==="admin"&&<ProjectMembersPanel projectId={id} clients={clients as any}/>}
  </div>;
}
