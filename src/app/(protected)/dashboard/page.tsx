import Link from "next/link";
import { db } from "@/lib/db";
import { requireUser, projectScope } from "@/lib/auth";
import { MODULES } from "@/lib/modules";

export default async function Dashboard(){const user=await requireUser();const sql=db();const scope=projectScope(user,"p",1);const [p,a,r]=await Promise.all([
  sql.query(`SELECT count(*)::int AS n FROM projects p WHERE ${scope.clause}`,scope.params),
  sql.query(`SELECT count(*)::int AS n FROM analyses x JOIN projects p ON p.id=x.project_id WHERE ${scope.clause}`,scope.params),
  sql.query(`SELECT count(*)::int AS n FROM reports x JOIN projects p ON p.id=x.project_id WHERE ${scope.clause}`,scope.params)
]);const client=user.role==="client";return <div className="content"><div className="hero"><div><div className="eyebrow">VarGéo.AI · {client?"Espace client":"Centre de calcul"}</div><h1 className="title">{client?"Vos dossiers techniques":"Ingénierie géotechnique traçable"}</h1><p className="subtitle">{client?"Accès sécurisé limité aux affaires qui vous sont attribuées.":"Neuf modules spécialisés, journal de calculs, dossiers d'affaires et génération structurée des rapports."}</p></div>{!client&&<div className="toolbar"><Link className="button" href="/affaires/new">Nouvelle affaire</Link><Link className="button secondary" href="/modules">Lancer un calcul</Link></div>}</div>
  <div className="grid grid-3" style={{marginBottom:22}}><div className="card"><div className="muted">Affaires</div><div className="metric">{String(p[0]?.n??0)}</div></div><div className="card"><div className="muted">Calculs enregistrés</div><div className="metric">{String(a[0]?.n??0)}</div></div><div className="card"><div className="muted">Rapports</div><div className="metric">{String(r[0]?.n??0)}</div></div></div>
  {client?<div className="card"><h3>Accès cloisonné</h3><p className="muted">Votre compte ne peut consulter que les dossiers explicitement rattachés à votre utilisateur.</p><Link className="button" href="/affaires">Voir mes dossiers</Link></div>:<><h2>Modules techniques</h2><div className="grid grid-3">{MODULES.map(m=><Link href={`/modules/${m.slug}`} className="card module-card" key={m.code}><div><div className="module-code">{m.code}</div><h3>{m.title}</h3><p className="muted">{m.short}</p></div><span className="go">Ouvrir →</span></Link>)}</div></>}</div>}
