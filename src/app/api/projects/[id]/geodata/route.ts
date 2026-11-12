import { NextResponse } from "next/server";
import { requireUser, projectScope } from "@/lib/auth";
import { db } from "@/lib/db";
import { readProjectGeodata, replaceProjectGeodata, type ProjectGeoData } from "@/lib/geodata";

async function authorize(projectId:string,user:Awaited<ReturnType<typeof requireUser>>,write=false){
  if(write && user.role==="client") return false;
  const scope=projectScope(user,"p",2);
  const rows=await db().query<{id:string}>(`SELECT p.id FROM projects p WHERE p.id=$1 AND ${scope.clause} LIMIT 1`,[projectId,...scope.params]);
  return Boolean(rows[0]);
}

export async function GET(_req:Request,{params}:{params:Promise<{id:string}>}){
  try{
    const user=await requireUser();
    const {id}=await params;
    if(!(await authorize(id,user,false))) return NextResponse.json({error:"Affaire non autorisée"},{status:403});
    return NextResponse.json(await readProjectGeodata(id));
  }catch(error){
    console.error(error);
    return NextResponse.json({error:error instanceof Error?error.message:"Lecture impossible"},{status:500});
  }
}

export async function PUT(req:Request,{params}:{params:Promise<{id:string}>}){
  try{
    const user=await requireUser();
    const {id}=await params;
    if(!(await authorize(id,user,true))) return NextResponse.json({error:"Affaire non autorisée"},{status:403});
    const body=await req.json() as ProjectGeoData;
    if(!body||!Array.isArray(body.boreholes)) return NextResponse.json({error:"Données géotechniques invalides"},{status:400});
    const saved=await replaceProjectGeodata(id,body);
    await db().query(
      "INSERT INTO audit_log(organization_id,user_id,action,entity_type,entity_id,details) VALUES($1,$2,'geodata_replace','project',$3,$4::jsonb)",
      [user.organization_id,user.id,id,JSON.stringify({boreholes:saved.boreholes.length})]
    );
    return NextResponse.json(saved);
  }catch(error){
    console.error(error);
    return NextResponse.json({error:error instanceof Error?error.message:"Enregistrement impossible"},{status:500});
  }
}
