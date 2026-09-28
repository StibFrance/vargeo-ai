import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { aiRuntimeStatus } from "@/lib/ai-governance";

export async function GET(){
  const user=await requireUser();
  if(user.role==="client") return NextResponse.json({error:"Droit insuffisant"},{status:403});
  return NextResponse.json(aiRuntimeStatus(),{
    headers:{"cache-control":"private, no-store"}
  });
}
