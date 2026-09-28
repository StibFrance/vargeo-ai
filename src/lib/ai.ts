type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export type AiTextOptions = {
  model?: string | null;
  temperature?: number;
};

export type AiTextResult = {
  text: string | null;
  model: string | null;
};

function configuredModel(explicit?: string | null) {
  return explicit || process.env.AI_MODEL || null;
}

export async function aiTextDetailed(messages: ChatMessage[], options: AiTextOptions = {}): Promise<AiTextResult> {
  const base = process.env.AI_GATEWAY_BASE_URL;
  const key = process.env.AI_GATEWAY_API_KEY;
  const model = configuredModel(options.model);
  if (!base || !key || !model) return { text: null, model };

  const response = await fetch(`${base.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model,
      messages,
      temperature: options.temperature ?? 0.15
    }),
    cache: "no-store"
  });

  if (!response.ok) throw new Error(`AI gateway: ${response.status}`);
  const data = await response.json() as {
    model?: string;
    choices?: Array<{ message?: { content?: string } }>;
  };

  return {
    text: data.choices?.[0]?.message?.content?.trim() ?? null,
    model: data.model ?? model
  };
}

export async function aiText(messages: ChatMessage[], options: AiTextOptions = {}) {
  return (await aiTextDetailed(messages, options)).text;
}

export const TECHNICAL_SYSTEM_PROMPT = `Tu es l'assistant de rédaction VarGéo.AI. Tu aides un ingénieur géotechnicien à structurer un rapport. Tu ne modifies jamais les résultats numériques fournis. Tu distingues faits, hypothèses, calculs et recommandations. Tu signales les données manquantes. Tu n'affirmes pas une conformité normative sans vérification explicite par un ingénieur. Réponds en français technique, précis et traçable.`;
