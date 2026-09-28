"use client";
import { FormEvent,useState } from "react";
import { useRouter } from "next/navigation";

export default function KnowledgeUpload({projectId}:{projectId:string}){
  const router=useRouter();
  const [busy,setBusy]=useState(false);
  const [message,setMessage]=useState("");
  const [error,setError]=useState("");

  async function submit(e:FormEvent<HTMLFormElement>){
    e.preventDefault();
    setBusy(true);setMessage("");setError("");
    const form=new FormData(e.currentTarget);
    form.set("projectId",projectId);
    const res=await fetch("/api/knowledge/ingest",{method:"POST",body:form});
    const data=await res.json().catch(()=>({}));
    setBusy(false);
    if(!res.ok){setError(data.error||"Import impossible");return;}
    setMessage(data.duplicate?"Document déjà indexé.":`Document indexé : ${data.chunkCount} passage(s).`);
    e.currentTarget.reset();
    router.refresh();
  }

  return <form className="card form" onSubmit={submit}>
    <h3>Base documentaire VarGéo.AI</h3>
    <p className="muted">Ajoutez les pièces techniques de l'affaire. PDF et DOCX sont extraits puis découpés en passages traçables pour les agents.</p>
    <div className="field"><label>Titre</label><input name="title" required placeholder="Ex. Étude G2 AVP antérieure"/></div>
    <div className="field"><label>Type</label><select name="documentType" defaultValue="rapport"><option value="rapport">Rapport</option><option value="plan">Plan / note</option><option value="norme">Référence normative</option><option value="essai">Essais / résultats</option><option value="courrier">Courrier / expertise</option><option value="source">Autre source</option></select></div>
    <div className="field"><label>Référence</label><input name="sourceReference" placeholder="Référence, version, date…"/></div>
    <div className="field"><label>Fichier</label><input name="file" type="file" accept=".pdf,.docx,.txt,.md,.csv,.json,.html,text/*,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" required/></div>
    <div className="notice">Taille maximale : 20 Mo. Les documents importés restent rattachés à cette affaire et à votre organisation.</div>
    {message&&<div className="success">{message}</div>}
    {error&&<div className="danger-text">{error}</div>}
    <button className="button" disabled={busy}>{busy?"Indexation…":"Ajouter à la base documentaire"}</button>
  </form>;
}
