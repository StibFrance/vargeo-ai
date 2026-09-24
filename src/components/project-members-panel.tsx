"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Row={id:string;name:string;email:string;assigned:boolean};

export default function ProjectMembersPanel({projectId,clients}:{projectId:string;clients:Row[]}){
  const router=useRouter();
  const [busy,setBusy]=useState("");
  async function toggle(row:Row){
    setBusy(row.id);
    const res=await fetch(`/api/affaires/${projectId}/members`,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({userId:row.id,action:row.assigned?"remove":"add"})});
    setBusy("");
    if(res.ok)router.refresh();else alert("Modification impossible");
  }
  return <section className="card" style={{marginTop:18}}>
    <h3>Accès clients à ce dossier</h3>
    <p className="muted">Seuls les comptes cochés ci-dessous pourront voir cette affaire, ses calculs et ses rapports.</p>
    {!clients.length?<p className="muted">Aucun compte client. Créez-en un dans Référentiel & paramètres.</p>:<table><tbody>{clients.map(c=><tr key={c.id}><td><strong>{c.name}</strong><br/><span className="muted">{c.email}</span></td><td><span className={c.assigned?"success":"muted"}>{c.assigned?"Accès autorisé":"Aucun accès"}</span></td><td style={{textAlign:"right"}}><button className="button secondary" disabled={busy===c.id} onClick={()=>toggle(c)}>{busy===c.id?"…":c.assigned?"Retirer l'accès":"Donner accès"}</button></td></tr>)}</tbody></table>}
  </section>
}
