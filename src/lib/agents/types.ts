export type AgentCode =
  | "STRAT"
  | "PRESSIO"
  | "FONDA"
  | "STAB"
  | "SENSOR"
  | "STRUCT"
  | "ENVIRO"
  | "HYDRO"
  | "POLLU"
  | "RGA"
  | "NORM"
  | "CRITIC"
  | "QA";

export type AgentDefinition = {
  code: AgentCode;
  name: string;
  purpose: string;
  moduleCodes?: string[];
  keywords?: string[];
  systemPrompt: string;
  preferredModelEnv?: "AI_MODEL" | "AI_MODEL_CRITIC" | "AI_MODEL_SYNTHESIS";
};

export type ProjectContext = {
  id?: string;
  code?: string;
  title?: string;
  mission_type?: string;
  address?: string | null;
  city?: string | null;
  description?: string | null;
};

export type AnalysisContext = {
  module_code: string;
  title: string;
  status: string;
  outputs: unknown;
  standard_refs: string[] | null;
};

export type KnowledgeSourceContext = {
  title: string;
  source_type: string;
  reference?: string | null;
  version?: string | null;
};

export type AgentStepResult = {
  code: AgentCode;
  name: string;
  sequence: number;
  status: "completed" | "failed";
  model: string | null;
  output: string | null;
  error: string | null;
};

export type OrchestratorInput = {
  organizationId: string;
  userId: string;
  projectId?: string | null;
  question: string;
  project?: ProjectContext | null;
  analyses?: AnalysisContext[];
  knowledgeSources?: KnowledgeSourceContext[];
};

export type OrchestratorResult = {
  runId: string;
  answer: string;
  status: "completed" | "partial";
  agents: AgentStepResult[];
  synthesisModel: string | null;
};
