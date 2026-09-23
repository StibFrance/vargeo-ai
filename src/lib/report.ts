export function baseReportSections(project: Record<string, unknown>, analyses: Array<Record<string, unknown>>) {
  const moduleSummary = analyses.map((a) => ({
    module: a.module_code,
    title: a.title,
    status: a.status,
    outputs: a.outputs,
    standards: a.standard_refs
  }));
  return {
    cover: { title: project.title, code: project.code, mission: project.mission_type, address: [project.address, project.postal_code, project.city].filter(Boolean).join(" ") },
    sections: [
      { key: "objet", title: "1. Objet de la mission", content: `Mission ${project.mission_type} - ${project.title}.` },
      { key: "documents", title: "2. Documents et données disponibles", content: "À compléter et valider avant émission." },
      { key: "site", title: "3. Contexte du site et du projet", content: String(project.description ?? "À compléter.") },
      { key: "investigations", title: "4. Investigations et résultats", content: `Analyses disponibles : ${moduleSummary.map((x) => x.module).join(", ") || "aucune"}.` },
      { key: "model", title: "5. Modèle géotechnique", content: "Synthèse à établir à partir de M1 STRAT et des investigations." },
      { key: "calculations", title: "6. Calculs et vérifications", content: moduleSummary },
      { key: "recommendations", title: "7. Préconisations", content: "À consolider après revue de l'ensemble des résultats." },
      { key: "limits", title: "8. Limites et conditions de validité", content: "Le rapport doit être relu, validé et approuvé par un ingénieur habilité avant émission." }
    ]
  };
}
