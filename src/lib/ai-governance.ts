import { db } from "@/lib/db";

function intEnv(name:string,fallback:number,min:number,max:number){
  const value=Number(process.env[name] ?? fallback);
  if(!Number.isFinite(value)) return fallback;
  return Math.min(Math.max(Math.trunc(value),min),max);
}

export function aiLimits(){
  return {
    maxQuestionChars:intEnv("AI_MAX_QUESTION_CHARS",6000,500,30000),
    maxRunsPerHour:intEnv("AI_MAX_RUNS_PER_HOUR",30,1,500),
    maxConcurrentRuns:intEnv("AI_MAX_CONCURRENT_RUNS",2,1,20)
  };
}

export async function assertAiCapacity(args:{organizationId:string;userId:string;question:string}){
  const limits=aiLimits();
  if(args.question.length>limits.maxQuestionChars){
    throw new Error(`Question trop longue (${limits.maxQuestionChars} caractères maximum).`);
  }

  const sql=db();
  const [hourRows,runningRows]=await Promise.all([
    sql.query<{count:number}>(
      `SELECT count(*)::int count FROM ai_runs
       WHERE organization_id=$1 AND user_id=$2 AND created_at>now()-interval '1 hour'`,
      [args.organizationId,args.userId]
    ),
    sql.query<{count:number}>(
      `SELECT count(*)::int count FROM ai_runs
       WHERE organization_id=$1 AND user_id=$2 AND status='running'
         AND created_at>now()-interval '10 minutes'`,
      [args.organizationId,args.userId]
    )
  ]);

  const used=Number(hourRows[0]?.count??0);
  const running=Number(runningRows[0]?.count??0);
  if(used>=limits.maxRunsPerHour) throw new Error("Quota horaire VarGéo.AI atteint pour cet utilisateur.");
  if(running>=limits.maxConcurrentRuns) throw new Error("Trop d'analyses VarGéo.AI sont déjà en cours pour cet utilisateur.");
  return {limits,used,running};
}

export function aiRuntimeStatus(){
  const base=process.env.AI_GATEWAY_BASE_URL || null;
  const model=process.env.AI_MODEL || null;
  const criticModel=process.env.AI_MODEL_CRITIC || model;
  const synthesisModel=process.env.AI_MODEL_SYNTHESIS || model;
  const keyConfigured=Boolean(process.env.AI_GATEWAY_API_KEY);
  return {
    configured:Boolean(base&&model&&keyConfigured),
    gatewayConfigured:Boolean(base),
    keyConfigured,
    model,
    criticModel,
    synthesisModel,
    limits:aiLimits()
  };
}
