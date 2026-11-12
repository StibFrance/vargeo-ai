"use client";

import { useMemo, useState } from "react";

type ViewMode = "simple" | "expert";
type Layer = {
  borehole: string;
  from: number;
  to: number;
  family: string;
  description: string;
  em?: number;
  pl?: number;
  note?: string;
};

const DEMO = `S1;0;0.45;Remblai;Argile limoneuse remaniée;;;
S1;0.45;2.10;Sable;Sable fin beige;6.8;0.72;
S1;2.10;3.35;Argile;Argile sableuse brun-gris;7.4;0.81;Horizon sensible aux variations hydriques
S1;3.35;6.80;Calcaire altéré;Calcaire altéré fracturé;22.5;1.95;
S1;6.80;10.00;Calcaire;Calcaire compact gris;41.0;3.20;Horizon compétent
S2;0;0.60;Remblai;Remblai sablo-graveleux;;;
S2;0.60;2.55;Sable;Sable à graviers beige;9.2;0.95;
S2;2.55;4.10;Argile;Argile limoneuse;8.1;0.88;Horizon à surveiller
S2;4.10;7.30;Calcaire altéré;Calcaire très altéré;24.0;2.10;
S2;7.30;10.00;Calcaire;Calcaire compact;44.0;3.45;Horizon compétent
S3;0;0.35;Remblai;Terre végétale et remblai;;;
S3;0.35;2.00;Sable;Sable limoneux beige;7.0;0.78;
S3;2.00;3.75;Argile;Argile sableuse;7.9;0.84;Horizon sensible aux variations hydriques
S3;3.75;6.45;Calcaire altéré;Calcaire altéré;26.0;2.20;
S3;6.45;10.00;Calcaire;Calcaire sain à compact;46.0;3.60;Horizon compétent
S4;0;0.50;Remblai;Remblai limoneux;;;
S4;0.50;2.30;Sable;Sable fin beige;8.5;0.90;
S4;2.30;3.90;Argile;Argile limono-sableuse;7.6;0.80;Horizon sensible aux variations hydriques
S4;3.90;6.95;Calcaire altéré;Calcaire altéré à fracturé;23.5;2.00;
S4;6.95;10.00;Calcaire;Calcaire compact;43.0;3.35;Horizon compétent`;

function num(value: string) {
  const n = Number(value.replace(",", ".").trim());
  return Number.isFinite(n) ? n : undefined;
}

function parseRows(raw: string): Layer[] {
  return raw.split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [borehole, from, to, family, description, em, pl, note] = line.split(";");
      return {
        borehole: (borehole || "S?").trim(),
        from: num(from || "") ?? 0,
        to: num(to || "") ?? 0,
        family: (family || "Terrain").trim(),
        description: (description || family || "Terrain").trim(),
        em: num(em || ""),
        pl: num(pl || ""),
        note: note?.trim() || undefined,
      };
    })
    .filter((x) => x.to > x.from);
}

function palette(label: string) {
  const x = label.toLowerCase();
  if (x.includes("remblai") || x.includes("terre")) return "repeating-linear-gradient(45deg,#8a684f 0 8px,#9d7a5d 8px 16px)";
  if (x.includes("sable") || x.includes("grave")) return "repeating-linear-gradient(135deg,#d8b45d 0 9px,#caa24b 9px 18px)";
  if (x.includes("argile") || x.includes("limon")) return "repeating-linear-gradient(0deg,#6fb0c7 0 11px,#5ca2ba 11px 22px)";
  if (x.includes("marne")) return "repeating-linear-gradient(90deg,#6c8b78 0 11px,#5d7a69 11px 22px)";
  if (x.includes("calcaire") && x.includes("alt")) return "repeating-linear-gradient(45deg,#b1a987 0 8px,#9f9779 8px 16px)";
  if (x.includes("calcaire") || x.includes("roche")) return "repeating-linear-gradient(135deg,#7e748c 0 8px,#6d637b 8px 16px)";
  return "repeating-linear-gradient(45deg,#7f8b96 0 8px,#6f7c87 8px 16px)";
}

function simpleLabel(layer: Layer) {
  const x = layer.family.toLowerCase();
  if (x.includes("remblai") || x.includes("terre")) return "Terrain superficiel";
  if (x.includes("argile") || x.includes("limon")) return "Horizon fin / potentiellement sensible";
  if (x.includes("calcaire") && x.includes("alt")) return "Substratum altéré";
  if (x.includes("calcaire") || x.includes("roche")) return "Substratum compétent";
  if (x.includes("sable") || x.includes("grave")) return "Horizon granulaire";
  return layer.family;
}

export default function StratigraphyWorkbench() {
  const [raw, setRaw] = useState(DEMO);
  const [mode, setMode] = useState<ViewMode>("simple");
  const rows = useMemo(() => parseRows(raw), [raw]);
  const boreholes = useMemo(() => [...new Set(rows.map((r) => r.borehole))], [rows]);
  const maxDepth = useMemo(() => Math.max(1, ...rows.map((r) => r.to)), [rows]);

  return <section className="card strat-wrap">
    <div className="strat-head">
      <div>
        <div className="eyebrow">Visualisation intelligente</div>
        <h3>Logs & stratigraphie</h3>
        <p className="muted">Lecture graphique des forages avec double niveau de restitution : client / néophyte et géotechnicien.</p>
      </div>
      <div className="toolbar">
        <button className={`button ${mode==="simple"?"":"secondary"}`} type="button" onClick={()=>setMode("simple")}>Lecture simplifiée</button>
        <button className={`button ${mode==="expert"?"":"secondary"}`} type="button" onClick={()=>setMode("expert")}>Géotechnicien</button>
        <button className="button secondary" type="button" onClick={()=>window.print()}>Imprimer la planche</button>
      </div>
    </div>

    <div className="notice">
      <strong>Données mesurées</strong> : profondeurs, descriptions et paramètres saisis. <strong>Interprétation VarGéo.AI</strong> : regroupement visuel et libellés pédagogiques. Toute corrélation entre sondages doit rester validée par l'ingénieur.
    </div>

    <div className="strat-grid">
      <div className="strat-editor">
        <label>Import / saisie des sondages</label>
        <textarea value={raw} onChange={(e)=>setRaw(e.target.value)} spellCheck={false}/>
        <small className="muted">Format : Sondage;De(m);À(m);Famille;Description;Em(MPa);pl*(MPa);Note</small>
      </div>

      <div className="strat-board">
        <div className="strat-scale" aria-hidden="true">
          {Array.from({length:Math.floor(maxDepth)+1},(_,i)=><span key={i} style={{top:`${(i/maxDepth)*100}%`}}>{i} m</span>)}
        </div>

        <div className="strat-columns">
          {boreholes.map((name)=>{
            const layers=rows.filter((r)=>r.borehole===name).sort((a,b)=>a.from-b.from);
            return <article className="borehole" key={name}>
              <header>
                <strong>Sondage {name}</strong>
                <small>0,00 → {maxDepth.toFixed(2)} m</small>
              </header>
              <div className="borehole-log">
                {layers.map((layer,idx)=>{
                  const top=(layer.from/maxDepth)*100;
                  const height=((layer.to-layer.from)/maxDepth)*100;
                  return <div
                    className="soil-layer"
                    key={`${name}-${idx}`}
                    style={{top:`${top}%`,height:`${height}%`,background:palette(layer.family)}}
                    title={`${layer.from.toFixed(2)} à ${layer.to.toFixed(2)} m — ${layer.description}`}
                  >
                    <div className="soil-label">
                      <strong>{mode==="simple"?simpleLabel(layer):layer.description}</strong>
                      <span>{layer.from.toFixed(2)} – {layer.to.toFixed(2)} m</span>
                      {mode==="expert" && (layer.em!==undefined || layer.pl!==undefined) &&
                        <small>{layer.em!==undefined?`Em ${layer.em.toFixed(1)} MPa`:""}{layer.em!==undefined&&layer.pl!==undefined?" · ":""}{layer.pl!==undefined?`pl* ${layer.pl.toFixed(2)} MPa`:""}</small>}
                      {layer.note && <small>{layer.note}</small>}
                    </div>
                  </div>;
                })}
              </div>
            </article>;
          })}
        </div>
      </div>
    </div>

    <div className="grid grid-3 strat-summary">
      <div className="card"><div className="module-code">LOG</div><strong>Lecture immédiate</strong><p className="muted">Couleurs, textures, profondeurs et unités géotechniques visibles d'un seul regard.</p></div>
      <div className="card"><div className="module-code">COMPARE</div><strong>Comparaison multi-sondages</strong><p className="muted">Repérage des variations latérales et des horizons récurrents entre reconnaissances.</p></div>
      <div className="card"><div className="module-code">EXPLAIN</div><strong>Deux niveaux de lecture</strong><p className="muted">Une restitution pédagogique pour le client, sans perdre les paramètres de l'ingénieur.</p></div>
    </div>

    <style>{`
      .strat-wrap{margin-bottom:18px}.strat-head{display:flex;justify-content:space-between;gap:18px;align-items:flex-start;margin-bottom:14px}.strat-head h3{font-size:24px;margin:5px 0}.strat-grid{display:grid;grid-template-columns:minmax(280px,.7fr) minmax(0,1.6fr);gap:18px;margin-top:18px}.strat-editor{display:grid;gap:8px}.strat-editor label{font-weight:800;color:#dce8f5}.strat-editor textarea{min-height:620px;width:100%;resize:vertical;background:#071524;color:#eef6ff;border:1px solid #294560;border-radius:12px;padding:12px;font:12px/1.55 ui-monospace,SFMono-Regular,Menlo,monospace}.strat-board{display:grid;grid-template-columns:50px 1fr;min-height:620px;background:#f8fafc;border:1px solid #dce5ee;border-radius:14px;padding:14px;color:#172033;overflow:auto}.strat-scale{position:relative;height:560px;border-right:1px solid #ccd6e0;margin-top:48px}.strat-scale span{position:absolute;right:8px;transform:translateY(-50%);font-size:10px;color:#667789}.strat-columns{display:grid;grid-template-columns:repeat(auto-fit,minmax(145px,1fr));gap:12px;padding-left:12px;min-width:560px}.borehole header{height:48px;display:grid;align-content:center;text-align:center;border-bottom:1px solid #d8e1e9}.borehole header strong{font-size:13px}.borehole header small{font-size:10px;color:#6d7c8c}.borehole-log{position:relative;height:560px;border:1px solid #ccd6e0;background:#fff;overflow:hidden}.soil-layer{position:absolute;left:0;right:0;border-bottom:1px solid rgba(255,255,255,.65);display:flex;align-items:center;justify-content:center;text-align:center;padding:4px}.soil-label{display:grid;gap:2px;padding:4px 5px;border-radius:7px;background:rgba(255,255,255,.72);backdrop-filter:blur(2px);max-width:94%;box-shadow:0 1px 8px #0001}.soil-label strong{font-size:10px;line-height:1.15}.soil-label span,.soil-label small{font-size:8px;line-height:1.2;color:#34495e}.strat-summary{margin-top:18px}.strat-summary .card{background:#081522}.strat-summary p{margin-bottom:0;font-size:13px;line-height:1.5}
      @media(max-width:1050px){.strat-grid{grid-template-columns:1fr}.strat-editor textarea{min-height:300px}.strat-head{flex-direction:column}}
      @media print{.sidebar,.topbar,.strat-editor,.strat-summary,.strat-head .toolbar,.notice{display:none!important}.shell{display:block}.content{padding:0;max-width:none}.strat-wrap{border:0;box-shadow:none;background:#fff}.strat-head{display:block;color:#111}.strat-board{border:0}.strat-columns{min-width:0}.borehole-log{height:650px}.strat-scale{height:650px}}
    `}</style>
  </section>;
}
