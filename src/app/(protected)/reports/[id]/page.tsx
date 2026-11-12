import { notFound } from "next/navigation";
import { requireUser,projectScope } from "@/lib/auth";
import { db } from "@/lib/db";
import PrintButton from "@/components/print-button";
import ReportApproveButton from "@/components/report-approve-button";

export default async function ReportPage({params}:{params:Promise<{id:string}>}){
  const {id}=await params;
  const user=await requireUser();
  const scope=projectScope(user,"p",2);
  const rows=await db().query(`
    SELECT r.id,r.title,r.mission_type,r.status,r.current_version,rv.content,p.code
    FROM reports r
    JOIN projects p ON p.id=r.project_id
    JOIN report_versions rv ON rv.report_id=r.id AND rv.version=r.current_version
    WHERE r.id=$1 AND ${scope.clause}`,[id,...scope.params]);
  const report:any=rows[0];
  if(!report)notFound();
  const content=report.content as any;
  const canApprove=user.role==="admin"||user.role==="engineer";
  return <div className="content">
    <div className="hero">
      <div><div className="eyebrow">{report.code} · {report.mission_type}</div><h1 className="title">{report.title}</h1><p className="subtitle">Version {report.current_version} · {report.status}</p></div>
      <div className="toolbar">{canApprove&&report.status==="draft"&&<ReportApproveButton id={report.id}/>}<a className="button secondary" href={`/api/reports/${report.id}/docx`}>Word (.docx)</a><PrintButton/></div>
    </div>
    <article className="report-page">
      <h1>{content.cover?.title}</h1>
      <p><strong>{content.cover?.code}</strong> — {content.cover?.mission}</p>
      <p>{content.cover?.address}</p>
      {content.ai_synthesis&&<><h2>Synthèse assistée</h2><p>{content.ai_synthesis}</p></>}
      {content.sections?.map((s:any)=><section key={s.key}><h2>{s.title}</h2>{typeof s.content==="string"?<p>{s.content}</p>:<pre className="json-inline">{JSON.stringify(s.content,null,2)}</pre>}</section>)}
      {content.annexes?.length>0&&<section className="report-annexes">
        <h2>Annexes techniques</h2>
        <p className="muted">Les annexes ci-dessous reprennent les données et synthèses issues des modules M1/M2. Toute interprétation reste soumise à validation de l’ingénieur avant émission.</p>
        {content.annexes.map((a:any)=><div className="report-annexe" key={a.key}>
          <div className="annexe-head"><h3>{a.title}</h3>{a.source&&<span className="badge">{a.source}</span>}</div>
          {a.content!==undefined&&<pre className="json-inline">{JSON.stringify(a.content,null,2)}</pre>}
          {a.boreholes!==undefined&&<pre className="json-inline">{JSON.stringify(a.boreholes,null,2)}</pre>}
        </div>)}
      </section>}
    </article>
    <style>{".report-annexes{margin-top:34px;border-top:2px solid var(--line);padding-top:18px}.report-annexe{margin:18px 0;padding:16px;border:1px solid var(--line);border-radius:14px;background:#081522}.annexe-head{display:flex;justify-content:space-between;gap:12px;align-items:center}.annexe-head h3{margin:0}"}</style>
  </div>;
}
