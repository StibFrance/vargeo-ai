import { NextResponse } from "next/server";
import { requireUser,projectScope } from "@/lib/auth";
import { db } from "@/lib/db";
import { baseReportSections } from "@/lib/report";
import { aiText,TECHNICAL_SYSTEM_PROMPT } from "@/lib/ai";
import { readProjectGeodata } from "@/lib/geodata";

export async function POST(req:Request){
  try{
    const user=await requireUser();
    if(user.role==="client")return NextResponse.json({error:"Droit insuffisant"},{status:403});
    const {projectId,missionType}=await req.json();
    const sql=db();
    const scope=projectScope(user,"p",2);
    const projects=await sql.query(`SELECT p.* FROM projects p WHERE p.id=$1 AND ${scope.clause} LIMIT 1`,[projectId,...scope.params]);
    const project:any=projects[0];
    if(!project)return NextResponse.json({error:"Affaire introuvable"},{status:404});
    const analyses=await sql.query("SELECT module_code,title,outputs,standard_refs,status FROM analyses WHERE project_id=$1 ORDER BY created_at",[projectId]);
    const geodata=await readProjectGeodata(projectId).catch(()=>({boreholes:[]}));
    const content:any=baseReportSections(project,analyses as any,geodata);
    const compactGeodata=(geodata.boreholes||[]).map((b:any)=>({
      name:b.name,depth_m:b.depth_m,
      layers:(b.layers||[]).map((l:any)=>({from:l.from,to:l.to,family:l.family,description:l.description,source:l.source})),
      pressio:(b.pressio||[]).map((p:any)=>({depth:p.depth,em:p.em,pl:p.pl,p0:p.p0}))
    }));
    const synthesis=await aiText([
      {role:"system",content:TECHNICAL_SYSTEM_PROMPT},
      {role:"user",content:`Rédige une synthèse technique de 180 mots maximum. N'invente aucune donnée et distingue mesures et interprétations. Projet: ${JSON.stringify({code:project.code,title:project.title,mission:missionType,description:project.description})}. Données terrain centralisées: ${JSON.stringify(compactGeodata)}. Analyses disponibles: ${JSON.stringify(analyses)}.`}
    ]).catch(()=>null);
    if(synthesis)content.ai_synthesis=synthesis;
    const title=`${missionType} — ${project.code} — ${project.title}`;
    const report=await sql.query("INSERT INTO reports(project_id,mission_type,title,created_by) VALUES($1,$2,$3,$4) RETURNING id",[projectId,missionType,title,user.id]);
    const id=report[0].id;
    await sql.query("INSERT INTO report_versions(report_id,version,content,ai_generated_sections,created_by) VALUES($1,1,$2::jsonb,$3,$4)",[id,JSON.stringify(content),synthesis?["ai_synthesis"]:[],user.id]);
    return NextResponse.json({id,title});
  }catch(e){
    console.error(e);
    return NextResponse.json({error:"Génération du rapport impossible"},{status:500});
  }
}
