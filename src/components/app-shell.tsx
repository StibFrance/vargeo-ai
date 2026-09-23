import Link from "next/link";
import type { CurrentUser } from "@/lib/auth";

export default function AppShell({user,children}:{user:CurrentUser;children:React.ReactNode}){
  return <div className="shell"><aside className="sidebar"><div className="brand"><div className="brand-mark"/><div><strong>VarGéo.AI</strong><small>Engineering Intelligence</small></div></div><nav className="nav">
    <Link href="/dashboard">Tableau de bord</Link><Link href="/affaires">Affaires</Link><Link href="/modules">Modules M1 → M9</Link><Link href="/assistant">Assistant VarGéo.AI</Link><Link href="/reports">Rapports</Link><Link href="/settings">Référentiel & paramètres</Link>
  </nav><div className="side-foot">NF P 94-500 · Eurocode 7<br/>Calculs traçables · Validation ingénieur</div></aside><main className="main"><header className="topbar"><div><span className="badge">V1 professionnelle</span></div><div style={{display:"flex",gap:12,alignItems:"center"}}><div style={{textAlign:"right"}}><strong>{user.name}</strong><div className="muted" style={{fontSize:12}}>{user.role}</div></div><form action="/api/auth/logout" method="post"><button className="button secondary" type="submit">Déconnexion</button></form></div></header>{children}</main></div>;
}
