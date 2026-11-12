"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";

type Layer={from:number;to:number;family:string;description:string;source?:"measured"|"interpreted";note?:string|null};
type Pressio={depth:number;em?:number|null;pl?:number|null;p0?:number|null;pf?:number|null;source?:string|null};
type Water={depth:number;observed_at?:string|null;observation_type?:string|null;note?:string|null};
type Borehole={id?:string;name:string;x?:number|null;y?:number|null;z?:number|null;depth_m?:number|null;method?:string|null;layers:Layer[];pressio:Pressio[];water:Water[]};
type GeoData={boreholes:Borehole[]};

function rowsToLayers(raw:string):Layer[]{
  return raw.split(/\r?\n/).map(x=>x.trim()).filter(Boolean).map(line=>{
    const p=line.split(";");
    return {from:Number((p[0]||"").replace(",",".")),to:Number((p[1]||"").replace(",",".")),family:(p[2]||"Terrain").trim(),description:(p[3]||p[2]||"Terrain").trim(),source:"measured" as const,note:p[4]?.trim()||null};
  }).filter(x=>Number.isFinite(x.from)&&Number.isFinite(x.to)&&x.to>x.from);
}
function rowsToPressio(raw:string):Pressio[]{
  return raw.split(/\r?\n/).map(x=>x.trim()).filter(Boolean).map(line=>{
    const p=line.split(";"),n=(v:string)=>{const x=Number((v||"").replace(",","."));return Number.isFinite(x)?x:null};
    return {depth:n(p[0])??-1,em:n(p[1]),pl:n(p[2]),p0:n(p[3]),pf:n(p[4]),source:"manual"};
  }).filter(x=>x.depth>=0);
}
function serializeLayers(rows:Layer[]){return rows.map(x=>[x.from,x.to,x.family,x.description,x.note||""].join(";")).join("\n");}
function serializePressio(rows:Pressio[]){return rows.map(x=>[x.depth,x.em??"",x.pl??"",x.p0??"",x.pf??""].join(";")).join("\n");}

export default function ProjectGeodataPanel({projectId}:{projectId:string}){
  const [data,setData]=useState<GeoData>({boreholes:[]});
  const [selected,setSelected]=useState(0);
  const [busy,setBusy]=useState(false);
  const [message,setMessage]=useState("");
  const current=data.boreholes[selected];
  const totals=useMemo(()=>({boreholes:data.boreholes.length,layers:data.boreholes.reduce((s,b)=>s+b.layers.length,0),pressio:data.boreholes.reduce((s,b)=>s+b.pressio.length,0)}),[data]);

  async function load(){
    const res=await fetch(`/api/projects/${projectId}/geodata`,{cache:"no-store"});
    const json=await res.json().catch(()=>({boreholes:[]}));
    if(res.ok) setData(json); else setMessage(json.error||"Lecture impossible");
  }
  useEffect(()=>{load();},[projectId]);

  function updateCurrent(patch:Partial<Borehole>){
    setData(d=>({boreholes:d.boreholes.map((b,i)=>i===selected?{...b,...patch}:b)}));
  }
  function addBorehole(){
    setData(d=>({boreholes:[...d.boreholes,{name:"S"+(d.boreholes.length+1),layers:[],pressio:[],water:[]}]}));
    setSelected(data.boreholes.length);
  }
  function removeCurrent(){
    if(!current)return;
    setData(d=>({boreholes:d.boreholes.filter((_,i)=>i!==selected)}));
    setSelected(Math.max(0,selected-1));
  }
  async function save(){
    setBusy(true);setMessage("");
    const res=await fetch(`/api/projects/${projectId}/geodata`,{method:"PUT",headers:{"content-type":"application/json"},body:JSON.stringify(data)});
    const json=await res.json().catch(()=>({}));
    setBusy(false);
    if(!res.ok){setMessage(json.error||"Enregistrement impossible");return;}
    setData(json);setMessage("Données géotechniques enregistrées dans l'affaire.");
  }
  async function importFile(e:ChangeEvent<HTMLInputElement>){
    const file=e.target.files?.[0];if(!file)return;
    setBusy(true);setMessage("");
    const form=new FormData();form.set("file",file);
    const res=await fetch("/api/stratigraphy/import",{method:"POST",body:form});
    const json=await res.json().catch(()=>({}));
    setBusy(false);e.target.value="";
    if(!res.ok){setMessage(json.error||"Import impossible");return;}
    const grouped=new Map<string,Layer[]>();
    for(const l of json.layers||[]){
      const key=String(l.borehole||"S1");
      const arr=grouped.get(key)||[];
      arr.push({from:Number(l.from),to:Number(l.to),family:String(l.family||"Terrain"),description:String(l.description||l.family||"Terrain"),source:"measured",note:l.note||null});
      grouped.set(key,arr);
    }
    if(!grouped.size){setMessage("Aucun horizon exploitable détecté.");return;}
    setData(d=>{
      const next=[...d.boreholes];
      for(const [name,layers] of grouped){
        const idx=next.findIndex(b=>b.name===name);
        if(idx>=0) next[idx]={...next[idx],layers};
        else next.push({name,layers,pressio:[],water:[]});
      }
      return {boreholes:next};
    });
    setMessage(String(json.layers.length)+" horizon(s) importé(s). Contrôle requis avant enregistrement.");
  }

  return <section className="card project-geodata">
    <div className="geo-head"><div><div className="eyebrow">Données terrain centralisées</div><h3>Sondages & essais</h3><p className="muted">Une seule saisie pour M1 STRAT, M2 PRESSIO, M3 FONDA et les rapports.</p></div><div className="toolbar"><label className="button secondary geo-upload">Importer un log<input type="file" accept=".pdf,.docx,.csv,.txt,.md,.json" onChange={importFile}/></label><button className="button secondary" type="button" onClick={addBorehole}>Ajouter un sondage</button><button className="button" type="button" onClick={save} disabled={busy}>{busy?"Enregistrement…":"Enregistrer dans l'affaire"}</button></div></div>
    <div className="geo-kpis"><span><strong>{totals.boreholes}</strong> sondage(s)</span><span><strong>{totals.layers}</strong> horizon(s)</span><span><strong>{totals.pressio}</strong> essai(s) pressiométrique(s)</span></div>
    {message&&<div className="notice">{message}</div>}
    {data.boreholes.length?<div className="geo-layout">
      <aside className="geo-list">{data.boreholes.map((b,i)=><button type="button" className={i===selected?"active":""} key={b.id||b.name+"-"+i} onClick={()=>setSelected(i)}><strong>{b.name}</strong><small>{b.layers.length} couches · {b.pressio.length} essais</small></button>)}</aside>
      {current&&<div className="geo-editor">
        <div className="grid grid-3"><div className="field"><label>Nom</label><input value={current.name} onChange={e=>updateCurrent({name:e.target.value})}/></div><div className="field"><label>Profondeur totale (m)</label><input value={current.depth_m??""} onChange={e=>updateCurrent({depth_m:e.target.value?Number(e.target.value.replace(",",".")):null})}/></div><div className="field"><label>Méthode</label><input value={current.method??""} onChange={e=>updateCurrent({method:e.target.value})} placeholder="Destructif, carotté…"/></div></div>
        <div className="grid grid-3"><div className="field"><label>X</label><input value={current.x??""} onChange={e=>updateCurrent({x:e.target.value?Number(e.target.value.replace(",",".")):null})}/></div><div className="field"><label>Y</label><input value={current.y??""} onChange={e=>updateCurrent({y:e.target.value?Number(e.target.value.replace(",",".")):null})}/></div><div className="field"><label>Z / NGF</label><input value={current.z??""} onChange={e=>updateCurrent({z:e.target.value?Number(e.target.value.replace(",",".")):null})}/></div></div>
        <div className="split"><div className="field"><label>Stratigraphie</label><textarea value={serializeLayers(current.layers)} onChange={e=>updateCurrent({layers:rowsToLayers(e.target.value)})}/><small className="muted">De;À;Famille;Description;Note</small></div><div className="field"><label>Pressiométrie</label><textarea value={serializePressio(current.pressio)} onChange={e=>updateCurrent({pressio:rowsToPressio(e.target.value)})}/><small className="muted">Profondeur;Em;pl;p0;pf — MPa</small></div></div>
        <div className="toolbar"><button className="button danger" type="button" onClick={removeCurrent}>Supprimer ce sondage</button></div>
      </div>}
    </div>:<div className="notice">Aucun sondage enregistré. Importez un log ou créez le premier sondage.</div>}
    <style>{".project-geodata{margin-top:18px}.geo-head{display:flex;justify-content:space-between;gap:18px;align-items:flex-start}.geo-head h3{margin:5px 0}.geo-upload{position:relative;overflow:hidden}.geo-upload input{position:absolute;inset:0;opacity:0}.geo-kpis{display:flex;gap:10px;flex-wrap:wrap;margin:14px 0}.geo-kpis span{padding:8px 10px;border:1px solid var(--line);border-radius:10px;background:#081522;font-size:12px}.geo-layout{display:grid;grid-template-columns:190px 1fr;gap:14px}.geo-list{display:grid;align-content:start;gap:7px}.geo-list button{background:#081522;border:1px solid var(--line);color:var(--text);border-radius:10px;padding:10px;text-align:left;cursor:pointer}.geo-list button.active{border-color:var(--blue);box-shadow:0 0 0 2px #35a9ff22}.geo-list small{display:block;color:var(--muted);margin-top:4px}.geo-editor{display:grid;gap:14px}.geo-editor textarea{min-height:230px}@media(max-width:900px){.geo-layout{grid-template-columns:1fr}.geo-list{grid-template-columns:repeat(auto-fit,minmax(140px,1fr))}.geo-head{flex-direction:column}}"}</style>
  </section>;
}
