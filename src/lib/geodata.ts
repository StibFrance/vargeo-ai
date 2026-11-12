import { db, withDbTransaction, type AppDb } from "@/lib/db";

export type ProjectGeoData = {
  boreholes:Array<{
    id?:string;
    name:string;
    x?:number|null;
    y?:number|null;
    z?:number|null;
    depth_m?:number|null;
    method?:string|null;
    layers:Array<{from:number;to:number;family:string;description:string;source?:"measured"|"interpreted";note?:string|null;}>;
    pressio:Array<{depth:number;em?:number|null;pl?:number|null;p0?:number|null;pf?:number|null;source?:string|null;}>;
    water:Array<{depth:number;observed_at?:string|null;observation_type?:string|null;note?:string|null;}>;
  }>;
};

export async function ensureGeodataSchema(sql:AppDb=db()){
  await sql.query(`CREATE TABLE IF NOT EXISTS stratigraphy_layers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    borehole_id uuid NOT NULL REFERENCES boreholes(id) ON DELETE CASCADE,
    depth_from_m double precision NOT NULL,
    depth_to_m double precision NOT NULL,
    family text NOT NULL,
    description text NOT NULL,
    source text NOT NULL DEFAULT 'measured' CHECK (source IN ('measured','interpreted')),
    note text,
    metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    CHECK (depth_to_m > depth_from_m)
  )`);
  await sql.query("CREATE INDEX IF NOT EXISTS stratigraphy_layers_borehole_idx ON stratigraphy_layers(borehole_id, depth_from_m)");
  await sql.query(`CREATE TABLE IF NOT EXISTS groundwater_observations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    borehole_id uuid NOT NULL REFERENCES boreholes(id) ON DELETE CASCADE,
    depth_m double precision NOT NULL,
    observed_at timestamptz,
    observation_type text NOT NULL DEFAULT 'observed',
    note text,
    created_at timestamptz NOT NULL DEFAULT now()
  )`);
  await sql.query("CREATE INDEX IF NOT EXISTS groundwater_borehole_idx ON groundwater_observations(borehole_id, observed_at DESC NULLS LAST)");
  await sql.query("CREATE UNIQUE INDEX IF NOT EXISTS boreholes_project_name_uidx ON boreholes(project_id, name)");
}

export async function readProjectGeodata(projectId:string):Promise<ProjectGeoData>{
  const sql=db();
  await ensureGeodataSchema(sql);
  const rows=await sql.query<any>(`
    SELECT b.id,b.name,b.x,b.y,b.z,b.depth_m,b.method,
      COALESCE(json_agg(DISTINCT jsonb_build_object(
        'from',sl.depth_from_m,'to',sl.depth_to_m,'family',sl.family,'description',sl.description,'source',sl.source,'note',sl.note
      )) FILTER (WHERE sl.id IS NOT NULL),'[]'::json) layers,
      COALESCE(json_agg(DISTINCT jsonb_build_object(
        'depth',pt.depth_m,'em',pt.em_mpa,'pl',pt.pl_mpa,'p0',pt.p0_mpa,'pf',pt.pf_mpa,'source',pt.source
      )) FILTER (WHERE pt.id IS NOT NULL),'[]'::json) pressio,
      COALESCE(json_agg(DISTINCT jsonb_build_object(
        'depth',gw.depth_m,'observed_at',gw.observed_at,'observation_type',gw.observation_type,'note',gw.note
      )) FILTER (WHERE gw.id IS NOT NULL),'[]'::json) water
    FROM boreholes b
    LEFT JOIN stratigraphy_layers sl ON sl.borehole_id=b.id
    LEFT JOIN pressio_tests pt ON pt.borehole_id=b.id
    LEFT JOIN groundwater_observations gw ON gw.borehole_id=b.id
    WHERE b.project_id=$1
    GROUP BY b.id
    ORDER BY b.name`,[projectId]);
  return {boreholes:rows.map((r:any)=>({
    id:r.id,name:r.name,x:r.x,y:r.y,z:r.z,depth_m:r.depth_m,method:r.method,
    layers:Array.isArray(r.layers)?r.layers.sort((a:any,b:any)=>a.from-b.from):[],
    pressio:Array.isArray(r.pressio)?r.pressio.sort((a:any,b:any)=>a.depth-b.depth):[],
    water:Array.isArray(r.water)?r.water.sort((a:any,b:any)=>a.depth-b.depth):[]
  }))};
}

export async function replaceProjectGeodata(projectId:string,data:ProjectGeoData){
  return withDbTransaction(async tx=>{
    await ensureGeodataSchema(tx);
    const incoming=new Set((data.boreholes||[]).map(b=>b.name.trim()).filter(Boolean));
    const existing=await tx.query<{id:string;name:string}>("SELECT id,name FROM boreholes WHERE project_id=$1",[projectId]);
    for(const old of existing){
      if(!incoming.has(old.name)) await tx.query("DELETE FROM boreholes WHERE id=$1",[old.id]);
    }

    for(const borehole of data.boreholes||[]){
      const name=borehole.name.trim();
      if(!name) continue;
      const maxLayer=Math.max(0,...(borehole.layers||[]).map(x=>Number(x.to)||0));
      const maxPressio=Math.max(0,...(borehole.pressio||[]).map(x=>Number(x.depth)||0));
      const depth=Math.max(Number(borehole.depth_m)||0,maxLayer,maxPressio)||null;
      const rows=await tx.query<{id:string}>(`
        INSERT INTO boreholes(project_id,name,x,y,z,depth_m,method,metadata)
        VALUES($1,$2,$3,$4,$5,$6,$7,'{}'::jsonb)
        ON CONFLICT (project_id,name) DO UPDATE
        SET x=EXCLUDED.x,y=EXCLUDED.y,z=EXCLUDED.z,depth_m=EXCLUDED.depth_m,method=EXCLUDED.method
        RETURNING id`,[projectId,name,borehole.x??null,borehole.y??null,borehole.z??null,depth,borehole.method??null]);
      const id=rows[0].id;
      await tx.query("DELETE FROM stratigraphy_layers WHERE borehole_id=$1",[id]);
      await tx.query("DELETE FROM pressio_tests WHERE borehole_id=$1",[id]);
      await tx.query("DELETE FROM groundwater_observations WHERE borehole_id=$1",[id]);

      for(const l of borehole.layers||[]){
        if(!(Number(l.to)>Number(l.from))) continue;
        await tx.query(`INSERT INTO stratigraphy_layers(borehole_id,depth_from_m,depth_to_m,family,description,source,note)
          VALUES($1,$2,$3,$4,$5,$6,$7)`,[id,Number(l.from),Number(l.to),l.family||"Terrain",l.description||l.family||"Terrain",l.source==="interpreted"?"interpreted":"measured",l.note||null]);
      }
      for(const p of borehole.pressio||[]){
        if(!(Number(p.depth)>=0)) continue;
        await tx.query(`INSERT INTO pressio_tests(borehole_id,depth_m,em_mpa,pl_mpa,p0_mpa,pf_mpa,source)
          VALUES($1,$2,$3,$4,$5,$6,$7)`,[id,Number(p.depth),p.em??null,p.pl??null,p.p0??null,p.pf??null,p.source||"project-geodata"]);
      }
      for(const w of borehole.water||[]){
        if(!(Number(w.depth)>=0)) continue;
        await tx.query(`INSERT INTO groundwater_observations(borehole_id,depth_m,observed_at,observation_type,note)
          VALUES($1,$2,$3,$4,$5)`,[id,Number(w.depth),w.observed_at||null,w.observation_type||"observed",w.note||null]);
      }
    }
    return readProjectGeodataWith(tx,projectId);
  });
}

async function readProjectGeodataWith(sql:AppDb,projectId:string):Promise<ProjectGeoData>{
  const rows=await sql.query<any>(`
    SELECT b.id,b.name,b.x,b.y,b.z,b.depth_m,b.method,
      COALESCE((SELECT json_agg(jsonb_build_object('from',sl.depth_from_m,'to',sl.depth_to_m,'family',sl.family,'description',sl.description,'source',sl.source,'note',sl.note) ORDER BY sl.depth_from_m) FROM stratigraphy_layers sl WHERE sl.borehole_id=b.id),'[]'::json) layers,
      COALESCE((SELECT json_agg(jsonb_build_object('depth',pt.depth_m,'em',pt.em_mpa,'pl',pt.pl_mpa,'p0',pt.p0_mpa,'pf',pt.pf_mpa,'source',pt.source) ORDER BY pt.depth_m) FROM pressio_tests pt WHERE pt.borehole_id=b.id),'[]'::json) pressio,
      COALESCE((SELECT json_agg(jsonb_build_object('depth',gw.depth_m,'observed_at',gw.observed_at,'observation_type',gw.observation_type,'note',gw.note) ORDER BY gw.depth_m) FROM groundwater_observations gw WHERE gw.borehole_id=b.id),'[]'::json) water
    FROM boreholes b WHERE b.project_id=$1 ORDER BY b.name`,[projectId]);
  return {boreholes:rows};
}
