import { aiTextDetailed } from "@/lib/ai";

export type StratigraphyLayer = {
  borehole: string; from: number; to: number; family: string; description: string;
  em?: number; pl?: number; note?: string; source: "measured" | "interpreted";
};

function n(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const parsed = Number(String(value ?? "").replace(",", ".").trim());
  return Number.isFinite(parsed) ? parsed : undefined;
}

function cleanLayer(input: Partial<StratigraphyLayer>): StratigraphyLayer | null {
  const from=n(input.from), to=n(input.to);
  if(from===undefined||to===undefined||to<=from) return null;
  const borehole=String(input.borehole||"S?").trim();
  const family=String(input.family||"Terrain").trim();
  const description=String(input.description||family).trim();
  const out: StratigraphyLayer = {borehole,from,to,family,description,source:input.source==="interpreted"?"interpreted":"measured"};
  const em=n(input.em), pl=n(input.pl);
  if(em!==undefined) out.em=em; if(pl!==undefined) out.pl=pl;
  if(input.note) out.note=String(input.note).trim();
  return out;
}

function fromDelimited(text:string){
  const lines=text.split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
  const rows:StratigraphyLayer[]=[];
  for(const line of lines){
    const sep=line.includes(";")?";":line.includes("\t")?"\t":",";
    const p=line.split(sep).map(x=>x.trim());
    if(p.length<5) continue;
    const maybeHeader=p.join(" ").toLowerCase();
    if(/sondage|borehole|profondeur|depth/.test(maybeHeader)&&!/\d/.test(p[1]||"")) continue;
    const layer=cleanLayer({borehole:p[0],from:n(p[1]),to:n(p[2]),family:p[3],description:p[4],em:n(p[5]),pl:n(p[6]),note:p[7],source:"measured"});
    if(layer) rows.push(layer);
  }
  return rows;
}

function extractJson(text:string){
  const fenced=text.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1];
  const raw=(fenced||text).trim();
  const first=raw.indexOf("["); const last=raw.lastIndexOf("]");
  if(first<0||last<=first) return [];
  try{
    const data=JSON.parse(raw.slice(first,last+1));
    if(!Array.isArray(data)) return [];
    return data.map((x)=>cleanLayer({...x,source:"measured"})).filter(Boolean) as StratigraphyLayer[];
  }catch{return [];}
}

export async function normalizeStratigraphyText(text:string){
  const direct=fromDelimited(text);
  if(direct.length) return {layers:direct,method:"deterministic" as const,warnings:[] as string[]};
  const system = "Tu extrais uniquement des données stratigraphiques et pressiométriques depuis un texte technique. Retourne exclusivement un tableau JSON valide, sans commentaire. Chaque objet doit respecter exactement: {\"borehole\":\"S1\",\"from\":0,\"to\":1.2,\"family\":\"Argile\",\"description\":\"Argile limoneuse\",\"em\":8.5,\"pl\":0.9,\"note\":\"...\"}. Ne jamais inventer une profondeur ou une valeur. Si Em ou pl* sont absents, omets-les. from/to sont en mètres. Un objet = une couche réellement décrite. Conserve le nom du sondage. N interprète pas une corrélation entre sondages.";
  const ai=await aiTextDetailed([{role:"system",content:system},{role:"user",content:text.slice(0,120000)}],{temperature:0.05,timeoutMs:90000});
  if(!ai.text) return {layers:[],method:"unavailable" as const,warnings:["Aucune extraction automatique disponible. Utilisez un CSV/TXT structuré ou vérifiez la configuration IA."]};
  const layers=extractJson(ai.text);
  return {layers,method:"ai" as const,warnings:layers.length?["Extraction assistée par IA : chaque horizon doit être contrôlé et validé par un ingénieur avant utilisation."]:["Le document n a pas pu être converti automatiquement en horizons exploitables."]};
}