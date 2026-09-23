import Link from "next/link";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { MODULES } from "@/lib/modules";

export default async function Dashboard(){const user=await requireUser();const sql=db();const [p,a,r]=await Promise.all([
  sql.query("SELECT count(*)::int AS n FROM projects WHERE organization_id=$1",[user.organization_id]),
  sql.query("SELECT count(*)::int AS n FROM analyses x JOIN projects p ON p.id=x.project_id WHERE p.organization_id=$1",[user.organization_id]),
  sql.query("SELECT count(*)::int AS n FROM reports x JOIN projects p ON p.id=x.project_id WHERE p.organization_id=$1",[user.organization_id])
]);return <div className="content"><div className="hero"><div><div className="eyebrow">VarGéo.AI · Centre de calcul</div><h1 className="title">Ingénierie géotechnique traçable</h1><p className="subtitle">Neuf modules spécialisés, journal de calculs, dossiers d'affaires et génération structurée des rapports.</p></div><div className="toolbar"><Link className="button" href="/affaires/new">Nouvelle affaire</Link><Link className="button secondary" href="/modules">Lancer un calcul</Link></div></div>
  <div className="grid grid-3" style={{marginBottom:22}}><div className="card"><div className="muted">Affaires</div><div className="metric">{String(p[0]?.n??0)}</div></div><div className="card"><div className="muted">Calculs enregistrés</div><div className="metric">{String(a[0]?.n??0)}</div></div><div className="card"><div className="muted">Rapports</div><div className="metric">{String(r[0]?.n??0)}</div></div></div>
  <h2>Modules techniques</h2><div className="grid grid-3">{MODULES.map(m=><Link href={`/modules/${m.slug}`} className="card module-card" key={m.code}><div><div className="module-code">{m.code}</div><h3>{m.title}</h3><p className="muted">{m.short}</p></div><span className="go">Ouvrir →</span></Link>)}</div></div>}
