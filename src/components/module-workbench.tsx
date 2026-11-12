"use client";
import { FormEvent, useEffect, useState } from "react";
import type { ModuleDefinition } from "@/lib/modules";

type Project={id:string;code:string;title:string};
type GeoBorehole={name:string;pressio:Array<{depth:number;em?:number|null;pl?:number|null;p0?:number|null}>};

function median(values:number[]){
  if(!values.length)return 0;
  const a=[...values].sort((x,y)=>x-y),m=Math.floor(a.length/2);
  return a.length%2?a[m]:(a[m-1]+a[m])/2;
}

export default function ModuleWorkbench({module,projects,initialProjectId=""}:{module:ModuleDefinition;projects:Project[];initialProjectId?:string}){
  const [result,setResult]=useState<unknown>(null);
  const [error,setError]=useState("");
  const [busy,setBusy]=useState(false);
  const [selectedProject,setSelectedProject]=useState(initialProjectId);
  const [geo,setGeo]=useState<{boreholes:GeoBorehole[]}|null>(null);
  const [selectedBorehole,setSelectedBorehole]=useState("");
  const [autoDefaults,setAutoDefaults]=useState<Record<string,string|number>>({});
  const [revision,setRevision]=useState(0);
  const [autoContext,setAutoContext]=useState("");

  useEffect(()=>{ if(initialProjectId) void projectChanged(initialProjectId); },[initialProjectId]);

  async function projectChanged(id:string){
    setSelectedProject(id);
    if(module.slug!=="fonda"||!id){setGeo(null);setSelectedBorehole("");setAutoContext("");return;}
    const res=await fetch(`/api/projects/${id}/geodata`,{cache:"no-store"});
    const data=await res.json().catch(()=>({}));
    if(!res.ok){setAutoContext(data.error||"Données terrain indisponibles.");return;}
    setGeo(data);
    const first=data.boreholes?.[0];
    if(first) applyBorehole(first.name,data);
    else setAutoContext("Aucun sondage centralisé dans cette affaire.");
  }

  function applyBorehole(name:string,data:any=geo){
    setSelectedBorehole(name);
    const b=(data?.boreholes||[]).find((x:any)=>x.name===name);
    if(!b)return;
    const tests=(b.pressio||[]).filter((p:any)=>Number(p.em)>0&&Number(p.pl)>0);
    const ems=tests.map((p:any)=>Number(p.em));
    const plStars=tests.map((p:any)=>Math.max(Number(p.pl)-Number(p.p0||0),0)).filter((x:number)=>x>0);
    if(ems.length){
      const em=median(ems);
      setAutoDefaults(d=>({...d,Em:Number(em.toFixed(2))}));
      setRevision(x=>x+1);
      const pl=plStars.length?median(plStars):0;
      setAutoContext(`Sondage ${name} : Em médian mesuré ${em.toFixed(2)} MPa${pl? ` · pl* médian ${pl.toFixed(2)} MPa`:""}. Seul Em est prérempli car γ, φ' et c' ne sont pas déductibles automatiquement de ces essais.`);
    }else setAutoContext(`Sondage ${name} : aucun essai pressiométrique exploitable pour préremplir Em.`);
  }

  async function submit(e:FormEvent<HTMLFormElement>){
    e.preventDefault();setBusy(true);setError("");
    const fd=new FormData(e.currentTarget);
    const inputs:Object=Object.fromEntries(fd.entries());
    const projectId=String(fd.get("projectId")||"")||null;
    const res=await fetch(`/api/calc/${module.slug}`,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({inputs,projectId})});
    const data=await res.json().catch(()=>({}));
    setBusy(false);
    if(!res.ok){setError(data.error||"Calcul impossible");return;}
    setResult(data);
  }

  return <div className="split">
    <form className="card form" onSubmit={submit}>
      <div className="field"><label>Affaire liée</label><select name="projectId" value={selectedProject} onChange={e=>projectChanged(e.target.value)}><option value="">Calcul non rattaché</option>{projects.map(p=><option key={p.id} value={p.id}>{p.code} — {p.title}</option>)}</select></div>
      {module.slug==="fonda"&&geo&&<div className="field"><label>Sondage source</label><select value={selectedBorehole} onChange={e=>applyBorehole(e.target.value)}><option value="">Choisir…</option>{geo.boreholes.map(b=><option key={b.name} value={b.name}>{b.name}</option>)}</select></div>}
      {autoContext&&<div className="notice">{autoContext}</div>}
      {module.fields.map(f=><div className="field" key={f.name}><label>{f.label}{f.unit&&<span className="unit"> · {f.unit}</span>}</label>{f.type==="textarea"?<textarea name={f.name} defaultValue={f.defaultValue} placeholder={f.placeholder} required/>:<input key={f.name+"-"+revision} name={f.name} type={f.type} defaultValue={autoDefaults[f.name]??f.defaultValue} placeholder={f.placeholder} step={f.type==="number"?"any":undefined} required/>}</div>)}
      <div className="notice">{module.caution}</div>
      {error&&<div className="danger-text">{error}</div>}
      <button className="button" disabled={busy}>{busy?"Calcul en cours…":"Calculer et tracer"}</button>
    </form>
    <section className="card"><h3>Résultat</h3><p className="muted">Les résultats sont enregistrés en statut brouillon lorsqu'une affaire est sélectionnée.</p>{result?<div className="result"><pre>{JSON.stringify(result,null,2)}</pre></div>:<div className="notice">Saisissez les hypothèses puis lancez le calcul. Aucune IA générative n'intervient dans les formules.</div>}</section>
  </div>;
}
