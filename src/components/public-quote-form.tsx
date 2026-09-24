"use client";

import { FormEvent, useState } from "react";

export default function PublicQuoteForm(){
  const [busy,setBusy]=useState(false);
  const [message,setMessage]=useState("");
  const [error,setError]=useState("");

  async function submit(e:FormEvent<HTMLFormElement>){
    e.preventDefault();
    setBusy(true);setMessage("");setError("");
    const data=Object.fromEntries(new FormData(e.currentTarget).entries());
    const res=await fetch("/api/devis",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(data)});
    const body=await res.json().catch(()=>({}));
    setBusy(false);
    if(!res.ok){setError(body.error||"Impossible d'envoyer la demande.");return;}
    if(body.mailto){window.location.href=body.mailto;setMessage("Votre messagerie va s'ouvrir pour finaliser l'envoi.");return;}
    e.currentTarget.reset();
    setMessage("Votre demande a bien été transmise à STIB France.");
  }

  return <form className="card form public-quote" onSubmit={submit}>
    <div className="grid grid-3">
      <div className="field"><label>Nom / société</label><input name="name" required/></div>
      <div className="field"><label>E-mail</label><input name="email" type="email" required/></div>
      <div className="field"><label>Téléphone</label><input name="phone"/></div>
    </div>
    <div className="grid grid-3">
      <div className="field"><label>Formule souhaitée</label><select name="plan" defaultValue="Pro"><option>Starter</option><option>Pro</option><option>Expert</option><option>À définir</option></select></div>
      <div className="field"><label>Périodicité</label><select name="billing" defaultValue="Annuelle"><option>Mensuelle</option><option>Annuelle</option><option>À définir</option></select></div>
      <div className="field"><label>Ville</label><input name="city"/></div>
    </div>
    <div className="field"><label>Entreprise</label><input name="company"/></div>
    <div className="field"><label>Votre besoin</label><textarea name="message" placeholder="Décrivez votre activité, le nombre de rapports mensuels envisagé et vos besoins techniques." required/></div>
    <input name="website" tabIndex={-1} autoComplete="off" style={{display:"none"}}/>
    {message&&<div className="success">{message}</div>}
    {error&&<div className="danger-text">{error}</div>}
    <button className="button" disabled={busy}>{busy?"Envoi…":"Demander un devis"}</button>
  </form>;
}
