export function baseReportSections(project: Record<string, unknown>, analyses: Array<Record<string, unknown>>, geodata?: any) {
  const moduleSummary = analyses.map((a) => ({
    module: a.module_code,
    title: a.title,
    status: a.status,
    outputs: a.outputs,
    standards: a.standard_refs
  }));
  const boreholes=Array.isArray(geodata?.boreholes)?geodata.boreholes:[];
  const investigationSummary=boreholes.map((b:any)=>({
    sondage:b.name,
    profondeur_m:b.depth_m,
    methode:b.method,
    horizons:Array.isArray(b.layers)?b.layers.map((l:any)=>({de_m:l.from,a_m:l.to,famille:l.family,description:l.description,source:l.source})):[],
    pressiometrie:Array.isArray(b.pressio)?b.pressio.map((p:any)=>({profondeur_m:p.depth,Em_MPa:p.em,pl_MPa:p.pl,p0_MPa:p.p0,pl_star_MPa:p.pl!=null?Math.max(Number(p.pl)-Number(p.p0||0),0):null})):[],
    niveaux_eau:Array.isArray(b.water)?b.water:[]
  }));
  const totals={
    sondages:boreholes.length,
    horizons:boreholes.reduce((s:number,b:any)=>s+(b.layers?.length||0),0),
    essais_pressiometriques:boreholes.reduce((s:number,b:any)=>s+(b.pressio?.length||0),0),
    observations_eau:boreholes.reduce((s:number,b:any)=>s+(b.water?.length||0),0)
  };
  return {
    cover: { title: project.title, code: project.code, mission: project.mission_type, address: [project.address, project.postal_code, project.city].filter(Boolean).join(" ") },
    geodata_summary: totals,
    sections: [
      { key: "objet", title: "1. Objet de la mission", content: `Mission ${project.mission_type} - ${project.title}.` },
      { key: "documents", title: "2. Documents et données disponibles", content: "À compléter et valider avant émission." },
      { key: "site", title: "3. Contexte du site et du projet", content: String(project.description ?? "À compléter.") },
      { key: "investigations", title: "4. Investigations et résultats", content: investigationSummary.length?{synthese:totals,sondages:investigationSummary}:`Analyses disponibles : ${moduleSummary.map((x) => x.module).join(", ") || "aucune"}.` },
      { key: "model", title: "5. Modèle géotechnique", content: investigationSummary.length?"Le modèle géotechnique doit être établi à partir des horizons centralisés ci-dessus et validé par l’ingénieur. Les corrélations entre sondages restent interprétatives.":"Synthèse à établir à partir de M1 STRAT et des investigations." },
      { key: "calculations", title: "6. Calculs et vérifications", content: moduleSummary },
      { key: "recommendations", title: "7. Préconisations", content: "À consolider après revue de l'ensemble des résultats." },
      { key: "limits", title: "8. Limites et conditions de validité", content: "Le rapport doit être relu, validé et approuvé par un ingénieur habilité avant émission. Les interpolations entre points de reconnaissance ne constituent pas des observations directes." }
    ]
  };
}
