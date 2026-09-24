import { NextResponse } from "next/server";

const TO_EMAIL=process.env.QUOTE_TO_EMAIL||"contact@stibfrance.fr";

function clean(v:unknown,max=2000){return String(v??"").trim().slice(0,max)}

export async function POST(req:Request){
  try{
    const b=await req.json();
    if(clean(b.website)) return NextResponse.json({ok:true});
    const name=clean(b.name,180),email=clean(b.email,220),phone=clean(b.phone,80),plan=clean(b.plan,80),billing=clean(b.billing,80),city=clean(b.city,120),company=clean(b.company,180),message=clean(b.message,4000);
    if(!name||!email||!message)return NextResponse.json({error:"Nom, e-mail et besoin sont requis."},{status:400});
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return NextResponse.json({error:"Adresse e-mail invalide."},{status:400});

    const subject=`Demande de devis VarGéo.AI — ${plan||"Formule à définir"} — ${name}`;
    const text=[
      "Nouvelle demande de devis VarGéo.AI",
      "",
      `Nom / société : ${name}`,
      `Entreprise : ${company||"Non renseignée"}`,
      `E-mail : ${email}`,
      `Téléphone : ${phone||"Non renseigné"}`,
      `Ville : ${city||"Non renseignée"}`,
      `Formule : ${plan||"À définir"}`,
      `Périodicité : ${billing||"À définir"}`,
      "",
      "Besoin :",
      message
    ].join("\n");

    const key=process.env.RESEND_API_KEY;
    const from=process.env.QUOTE_FROM_EMAIL;
    if(key&&from){
      const response=await fetch("https://api.resend.com/emails",{method:"POST",headers:{"content-type":"application/json","authorization":`Bearer ${key}`},body:JSON.stringify({from,to:[TO_EMAIL],reply_to:email,subject,text})});
      if(response.ok)return NextResponse.json({ok:true,delivered:true});
      console.error("quote email",response.status,await response.text().catch(()=>""));
    }

    const mailto=`mailto:${encodeURIComponent(TO_EMAIL)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
    return NextResponse.json({ok:true,delivered:false,mailto});
  }catch(e){
    console.error(e);
    return NextResponse.json({error:"Impossible de traiter la demande."},{status:500});
  }
}
