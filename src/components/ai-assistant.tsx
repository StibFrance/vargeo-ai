"use client";
import { FormEvent, useState } from "react";

type P = { id: string; code: string; title: string };
type AgentBadge = { code: string; name: string; status: "completed" | "failed" };
type SourceRef = { id:string; title:string; reference?:string|null; page?:number|null };
type RuntimeStatus = {
  configured:boolean;
  model:string|null;
  criticModel:string|null;
  synthesisModel:string|null;
  maxQuestionChars:number;
};

export default function AiAssistant({ projects, runtime }: { projects: P[]; runtime:RuntimeStatus }) {
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [agents, setAgents] = useState<AgentBadge[]>([]);
  const [sources, setSources] = useState<SourceRef[]>([]);
  const [status, setStatus] = useState<string>("");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if(!runtime.configured){
      setError("La passerelle de modèle n'est pas encore configurée sur cet environnement.");
      return;
    }
    setBusy(true); setError(""); setAnswer(""); setAgents([]); setSources([]); setStatus("");
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(Object.fromEntries(fd.entries()))
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) { setError(data.error || "Assistant indisponible"); return; }
    setAnswer(data.answer || "");
    setAgents(Array.isArray(data.agents) ? data.agents : []);
    setSources(Array.isArray(data.sources) ? data.sources : []);
    setStatus(data.status || "");
  }

  return (
    <div className="split">
      <form className="card form" onSubmit={submit}>
        <div className={runtime.configured ? "notice" : "notice"} style={{marginBottom:12}}>
          <strong>{runtime.configured ? "Moteur IA prêt" : "Moteur IA en attente de passerelle"}</strong>
          <div className="muted" style={{marginTop:4}}>
            {runtime.configured
              ? `Principal : ${runtime.model} · Contradicteur : ${runtime.criticModel} · Synthèse : ${runtime.synthesisModel}`
              : "Les calculs, dossiers et la base documentaire restent disponibles. Aucun appel IA n'est lancé tant qu'une clé de passerelle valide n'est pas présente."}
          </div>
        </div>

        <div className="field">
          <label>Contexte affaire</label>
          <select name="projectId" defaultValue="">
            <option value="">Sans affaire</option>
            {projects.map((p) => <option key={p.id} value={p.id}>{p.code} — {p.title}</option>)}
          </select>
        </div>
        <div className="field">
          <label>Question technique</label>
          <textarea
            name="question"
            maxLength={runtime.maxQuestionChars}
            placeholder="Ex. Analyse contradictoirement cette G2 PRO et liste les points à vérifier avant validation…"
            required
          />
          <div className="muted" style={{fontSize:12}}>Maximum {runtime.maxQuestionChars.toLocaleString("fr-FR")} caractères.</div>
        </div>
        <div className="notice">
          VarGéo.AI V2 confronte plusieurs agents experts et recherche d'abord les pièces indexées de l'affaire. Toute conclusion doit être validée par un ingénieur.
        </div>
        {error && <div className="danger-text">{error}</div>}
        <button className="button" disabled={busy||!runtime.configured}>
          {busy ? "Analyse multi-agents…" : runtime.configured ? "Interroger VarGéo.AI" : "Passerelle IA non configurée"}
        </button>
      </form>

      <section className="card">
        <h3>Réponse experte</h3>
        {agents.length > 0 && <div className="toolbar" style={{ marginBottom: 16 }}>
          {agents.map((agent) => <span className="badge" key={agent.code} title={agent.name}>{agent.code} · {agent.status === "completed" ? "OK" : "ÉCHEC"}</span>)}
          {status && <span className="badge">Pipeline · {status}</span>}
        </div>}

        {sources.length > 0 && <div className="notice" style={{marginBottom:16}}>
          <strong>Sources documentaires retrouvées</strong>
          <div style={{marginTop:8}}>
            {sources.map((source)=><div key={source.id} style={{marginTop:5}}>
              <span className="module-code">{source.id}</span> {source.title}
              {source.reference ? ` · ${source.reference}` : ""}
              {source.page ? ` · p. ${source.page}` : ""}
            </div>)}
          </div>
        </div>}

        {answer ? <div className="result" style={{ whiteSpace: "pre-wrap", lineHeight: 1.65 }}>{answer}</div>
          : <p className="muted">La réponse consolidée des agents apparaîtra ici.</p>}
      </section>
    </div>
  );
}
