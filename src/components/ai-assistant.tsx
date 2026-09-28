"use client";
import { FormEvent, useState } from "react";

type P = { id: string; code: string; title: string };
type AgentBadge = { code: string; name: string; status: "completed" | "failed" };
type SourceRef = { id:string; title:string; reference?:string|null; page?:number|null };

export default function AiAssistant({ projects }: { projects: P[] }) {
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [agents, setAgents] = useState<AgentBadge[]>([]);
  const [sources, setSources] = useState<SourceRef[]>([]);
  const [status, setStatus] = useState<string>("");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
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
        <div className="field">
          <label>Contexte affaire</label>
          <select name="projectId" defaultValue="">
            <option value="">Sans affaire</option>
            {projects.map((p) => <option key={p.id} value={p.id}>{p.code} — {p.title}</option>)}
          </select>
        </div>
        <div className="field">
          <label>Question technique</label>
          <textarea name="question" placeholder="Ex. Analyse contradictoirement cette G2 PRO et liste les points à vérifier avant validation…" required />
        </div>
        <div className="notice">
          VarGéo.AI V2 confronte plusieurs agents experts et recherche d'abord les pièces indexées de l'affaire. Toute conclusion doit être validée par un ingénieur.
        </div>
        {error && <div className="danger-text">{error}</div>}
        <button className="button" disabled={busy}>{busy ? "Analyse multi-agents…" : "Interroger VarGéo.AI"}</button>
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
