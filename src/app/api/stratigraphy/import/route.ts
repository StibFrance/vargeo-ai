import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { extractTextFromFile } from "@/lib/knowledge/parse-file";
import { normalizeStratigraphyText } from "@/lib/stratigraphy-import";

export const runtime="nodejs";

export async function POST(req:Request){
  try{
    const user=await requireUser();
    if(user.role==="client") return NextResponse.json({error:"Droit insuffisant"},{status:403});
    const form=await req.formData();
    const file=form.get("file");
    if(!(file instanceof File)) return NextResponse.json({error:"Fichier requis"},{status:400});
    if(file.size>20*1024*1024) return NextResponse.json({error:"Fichier limité à 20 Mo"},{status:413});
    const text=await extractTextFromFile(file);
    if(text.trim().length<10) return NextResponse.json({error:"Aucun texte exploitable détecté"},{status:422});
    const normalized=await normalizeStratigraphyText(text);
    return NextResponse.json({filename:file.name,extractedCharacters:text.length,...normalized});
  }catch(error){
    console.error(error);
    return NextResponse.json({error:error instanceof Error?error.message:"Import stratigraphique impossible"},{status:500});
  }
}