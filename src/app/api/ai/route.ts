import { NextResponse } from "next/server";
import { requireUser, projectScope } from "@/lib/auth";
import { db } from "@/lib/db";
import { runExpertOrchestration } from "@/lib/agents/orchestrator";
import type { AnalysisContext, KnowledgeSourceContext, ProjectContext } from "@/lib/agents/types";

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    if (user.role === "client") {
      return NextResponse.json({ error: "Droit insuffisant" }, { status: 403 });
    }

    const { projectId, question } = await req.json();
    const cleanQuestion = String(question || "").trim();
    if (!cleanQuestion) {
      return NextResponse.json({ error: "Question requise" }, { status: 400 });
    }

    const sql = db();
    let project: ProjectContext | null = null;
    let analyses: AnalysisContext[] = [];

    if (projectId) {
      const scope = projectScope(user, "p", 2);
      const projects = await sql.query<ProjectContext>(
        `SELECT p.id,p.code,p.title,p.mission_type,p.address,p.city,p.description
         FROM projects p
         WHERE p.id=$1 AND ${scope.clause}
         LIMIT 1`,
        [projectId, ...scope.params]
      );
      project = projects[0] ?? null;
      if (!project) {
        return NextResponse.json({ error: "Affaire non autorisée" }, { status: 403 });
      }

      analyses = await sql.query<AnalysisContext>(
        `SELECT module_code,title,status,outputs,standard_refs
         FROM analyses
         WHERE project_id=$1
         ORDER BY created_at DESC
         LIMIT 30`,
        [projectId]
      );
    }

    const knowledgeSources = await sql.query<KnowledgeSourceContext>(
      `SELECT title,source_type,reference,version
       FROM knowledge_sources
       WHERE organization_id=$1 AND status='active'
       ORDER BY created_at DESC
       LIMIT 30`,
      [user.organization_id]
    );

    const result = await runExpertOrchestration({
      organizationId: user.organization_id,
      userId: user.id,
      projectId: projectId || null,
      question: cleanQuestion,
      project,
      analyses,
      knowledgeSources
    });

    await sql.query(
      `INSERT INTO audit_log(organization_id,user_id,action,entity_type,entity_id,details)
       VALUES($1,$2,'ai_orchestration','ai_run',$3,$4::jsonb)`,
      [
        user.organization_id,
        user.id,
        result.runId,
        JSON.stringify({
          projectId: projectId || null,
          question: cleanQuestion.slice(0, 500),
          status: result.status,
          agents: result.agents.map((step) => ({
            code: step.code,
            status: step.status,
            model: step.model
          })),
          synthesisModel: result.synthesisModel
        })
      ]
    );

    return NextResponse.json({
      answer: result.answer,
      runId: result.runId,
      status: result.status,
      agents: result.agents.map((step) => ({
        code: step.code,
        name: step.name,
        status: step.status
      }))
    });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "Assistant indisponible";
    const notConfigured = /non configurée|non configuree|réponse vide|reponse vide/i.test(message);
    return NextResponse.json(
      { error: notConfigured ? "La couche IA n'est pas configurée dans l'environnement de déploiement." : "Assistant indisponible" },
      { status: notConfigured ? 503 : 500 }
    );
  }
}
