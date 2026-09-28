import { createHash } from "node:crypto";
import { aiTextDetailed } from "@/lib/ai";
import { db } from "@/lib/db";
import { getAgent, selectAgents } from "@/lib/agents/catalog";
import type { AgentDefinition, AgentStepResult, OrchestratorInput, OrchestratorResult } from "@/lib/agents/types";

function modelFor(agent: AgentDefinition) {
  if (agent.preferredModelEnv === "AI_MODEL_CRITIC") return process.env.AI_MODEL_CRITIC || process.env.AI_MODEL || null;
  if (agent.preferredModelEnv === "AI_MODEL_SYNTHESIS") return process.env.AI_MODEL_SYNTHESIS || process.env.AI_MODEL || null;
  return process.env.AI_MODEL || null;
}

function compactContext(input: OrchestratorInput) {
  return JSON.stringify({
    project: input.project ?? null,
    analyses: (input.analyses ?? []).slice(0, 30),
    knowledgeSources: (input.knowledgeSources ?? []).slice(0, 30)
  });
}

function promptHash(system: string, user: string) {
  return createHash("sha256").update(system).update("\n---\n").update(user).digest("hex");
}

async function executeAgent(args: {
  runId: string;
  sequence: number;
  agent: AgentDefinition;
  question: string;
  context: string;
  previous?: AgentStepResult[];
}) {
  const sql = db();
  const prior = (args.previous ?? [])
    .filter((step) => step.output)
    .map((step) => `[${step.code}] ${step.output}`)
    .join("\n\n");

  const userPrompt = [
    `Question de l'ingénieur : ${args.question}`,
    `Contexte contrôlé : ${args.context}`,
    prior ? `Analyses produites par les autres agents :\n${prior}` : "",
    "Produis uniquement une analyse exploitable par un ingénieur : constats, points robustes, incertitudes, contrôles à effectuer et conclusion prudente. Ne révèle pas de raisonnement interne détaillé."
  ].filter(Boolean).join("\n\n");

  const model = modelFor(args.agent);
  const hash = promptHash(args.agent.systemPrompt, userPrompt);

  const inserted = await sql.query<{ id: string }>(
    `INSERT INTO ai_agent_steps(run_id,sequence,agent_code,agent_name,status,model,prompt_hash)
     VALUES($1,$2,$3,$4,'running',$5,$6)
     RETURNING id`,
    [args.runId, args.sequence, args.agent.code, args.agent.name, model, hash]
  );
  const stepId = inserted[0].id;

  try {
    const response = await aiTextDetailed(
      [
        { role: "system", content: args.agent.systemPrompt },
        { role: "user", content: userPrompt }
      ],
      { model, temperature: args.agent.code === "CRITIC" ? 0.2 : 0.1 }
    );

    if (!response.text) throw new Error("Couche IA non configurée ou réponse vide.");

    await sql.query(
      `UPDATE ai_agent_steps
       SET status='completed',model=$2,output=$3,completed_at=now()
       WHERE id=$1`,
      [stepId, response.model, response.text]
    );

    return {
      code: args.agent.code,
      name: args.agent.name,
      sequence: args.sequence,
      status: "completed",
      model: response.model,
      output: response.text,
      error: null
    } satisfies AgentStepResult;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur agent";
    await sql.query(
      `UPDATE ai_agent_steps
       SET status='failed',error=$2,completed_at=now()
       WHERE id=$1`,
      [stepId, message]
    );

    return {
      code: args.agent.code,
      name: args.agent.name,
      sequence: args.sequence,
      status: "failed",
      model,
      output: null,
      error: message
    } satisfies AgentStepResult;
  }
}

export async function runExpertOrchestration(input: OrchestratorInput): Promise<OrchestratorResult> {
  const question = input.question.trim();
  if (!question) throw new Error("Question requise");

  const sql = db();
  const agents = selectAgents({
    question,
    project: input.project,
    analyses: input.analyses
  });
  const selectedCodes = agents.map((agent) => agent.code);
  const runRows = await sql.query<{ id: string }>(
    `INSERT INTO ai_runs(organization_id,project_id,user_id,question,mode,status,selected_agents)
     VALUES($1,$2,$3,$4,'expert','running',$5)
     RETURNING id`,
    [input.organizationId, input.projectId ?? null, input.userId, question, selectedCodes]
  );
  const runId = runRows[0].id;
  const context = compactContext(input);

  try {
    const firstPassAgents = agents.filter((agent) => agent.code !== "CRITIC" && agent.code !== "QA");
    const firstPass = await Promise.all(
      firstPassAgents.map((agent, index) =>
        executeAgent({
          runId,
          sequence: index + 1,
          agent,
          question,
          context
        })
      )
    );

    const criticSequence = firstPassAgents.length + 1;
    const critic = await executeAgent({
      runId,
      sequence: criticSequence,
      agent: getAgent("CRITIC"),
      question,
      context,
      previous: firstPass
    });

    const qaSequence = criticSequence + 1;
    const qa = await executeAgent({
      runId,
      sequence: qaSequence,
      agent: getAgent("QA"),
      question,
      context,
      previous: [...firstPass, critic]
    });

    const steps = [...firstPass, critic, qa];
    const usable = steps.filter((step) => step.output);
    if (!usable.length) throw new Error("Aucun agent n'a pu produire d'analyse.");

    const synthesisSystem = `Tu es l'orchestrateur final VarGéo.AI. Tu synthétises les analyses de plusieurs agents experts sans inventer ni recalculer de valeurs. Tu conserves les divergences lorsqu'elles existent. Tu structures la réponse en : synthèse, points techniques établis, incertitudes/contradictions, contrôles ou données manquantes, conclusion à valider par l'ingénieur. Tu ne présentes jamais la réponse comme une validation réglementaire ou une décision automatique.`;
    const synthesisPrompt = [
      `Question : ${question}`,
      `Contexte contrôlé : ${context}`,
      "Contributions des agents :",
      ...usable.map((step) => `### ${step.name} (${step.code})\n${step.output}`)
    ].join("\n\n");

    const synthesis = await aiTextDetailed(
      [
        { role: "system", content: synthesisSystem },
        { role: "user", content: synthesisPrompt }
      ],
      { model: process.env.AI_MODEL_SYNTHESIS || process.env.AI_MODEL || null, temperature: 0.1 }
    );

    if (!synthesis.text) throw new Error("La synthèse finale n'a pas pu être produite.");

    const status = steps.some((step) => step.status === "failed") ? "partial" : "completed";
    await sql.query(
      `UPDATE ai_runs
       SET status=$2,final_answer=$3,synthesis_model=$4,completed_at=now()
       WHERE id=$1`,
      [runId, status, synthesis.text, synthesis.model]
    );

    return {
      runId,
      answer: synthesis.text,
      status,
      agents: steps,
      synthesisModel: synthesis.model
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur d'orchestration";
    await sql.query(
      `UPDATE ai_runs SET status='failed',error=$2,completed_at=now() WHERE id=$1`,
      [runId, message]
    );
    throw error;
  }
}
