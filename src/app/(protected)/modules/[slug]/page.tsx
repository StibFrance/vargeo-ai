import { notFound,redirect } from "next/navigation";
import { getModuleBySlug } from "@/lib/modules";
import ModuleWorkbench from "@/components/module-workbench";
import StratigraphyWorkbench from "@/components/stratigraphy-workbench";
import PressioProfileWorkbench from "@/components/pressio-profile-workbench";
import { requireUser,projectScope } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function ModulePage({params,searchParams}:{params:Promise<{slug:string}>;searchParams:Promise<{projectId?:string}>}){
  const {slug}=await params;
  const {projectId=""}=await searchParams;
  const module=getModuleBySlug(slug);
  if(!module)notFound();
  const user=await requireUser();
  if(user.role==="client")redirect("/affaires");
  const scope=projectScope(user,"p",1);
  const projects=await db().query(
    `SELECT p.id,p.code,p.title FROM projects p WHERE ${scope.clause} AND p.status<>'archived' ORDER BY p.created_at DESC LIMIT 100`,
    scope.params
  );
  const validInitial=projects.some((p:any)=>String(p.id)===projectId)?projectId:"";

  return <div className="content">
    <div className="hero"><div>
      <div className="eyebrow">{module.code} · {module.title}</div>
      <h1 className="title">{module.short}</h1>
      <p className="subtitle">{module.description}</p>
      <div className="toolbar">{module.standards.map(s=><span className="badge" key={s}>{s}</span>)}</div>
    </div></div>

    {slug==="strat" && <StratigraphyWorkbench projects={projects as {id:string;code:string;title:string}[]} initialProjectId={validInitial}/>}
    {slug==="pressio" && <PressioProfileWorkbench projects={projects as {id:string;code:string;title:string}[]} initialProjectId={validInitial}/>}
    <ModuleWorkbench module={module} projects={projects as {id:string;code:string;title:string}[]} initialProjectId={validInitial}/>
  </div>;
}
