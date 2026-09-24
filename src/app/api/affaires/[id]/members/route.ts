import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req:Request,{params}:{params:Promise<{id:string}>}){
  try{
    const user=await requireUser();
    if(user.role!=="admin")return NextResponse.json({error:"Droit insuffisant"},{status:403});
    const {id}=await params;
    const body=await req.json();
    const targetUserId=String(body.userId||"");
    const action=body.action==="remove"?"remove":"add";
    const sql=db();

    const [project,target]=await Promise.all([
      sql.query("SELECT id FROM projects WHERE id=$1 AND organization_id=$2",[id,user.organization_id]),
      sql.query("SELECT id,role FROM users WHERE id=$1 AND organization_id=$2 AND is_active=true",[targetUserId,user.organization_id])
    ]);
    if(!project[0])return NextResponse.json({error:"Affaire introuvable"},{status:404});
    if(!target[0]||target[0].role!=="client")return NextResponse.json({error:"Compte client invalide"},{status:400});

    if(action==="add"){
      await sql.query("INSERT INTO project_members(project_id,user_id,project_role) VALUES($1,$2,'client') ON CONFLICT(project_id,user_id) DO UPDATE SET project_role='client'",[id,targetUserId]);
    }else{
      await sql.query("DELETE FROM project_members WHERE project_id=$1 AND user_id=$2",[id,targetUserId]);
    }
    await sql.query("INSERT INTO audit_log(organization_id,user_id,action,entity_type,entity_id,details) VALUES($1,$2,$3,'project',$4,$5::jsonb)",[user.organization_id,user.id,action==="add"?"assign_client":"unassign_client",id,JSON.stringify({clientUserId:targetUserId})]);
    return NextResponse.json({ok:true});
  }catch(e){console.error(e);return NextResponse.json({error:"Modification impossible"},{status:500})}
}
