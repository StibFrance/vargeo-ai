type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export async function aiText(messages: ChatMessage[]) {
  const base = process.env.AI_GATEWAY_BASE_URL;
  const key = process.env.AI_GATEWAY_API_KEY;
  const model = process.env.AI_MODEL;
  if (!base || !key || !model) return null;

  const response = await fetch(`${base.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
    body: JSON.stringify({ model, messages, temperature: 0.2 }),
    cache: "no-store"
  });
  if (!response.ok) throw new Error(`AI gateway: ${response.status}`);
  const data = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
  return data.choices?.[0]?.message?.content?.trim() ?? null;
}

export const TECHNICAL_SYSTEM_PROMPT = `Tu es l'assistant de rédaction VarGéo.AI. Tu aides un ingénieur géotechnicien à structurer un rapport. Tu ne modifies jamais les résultats numériques fournis. Tu distingues faits, hypothèses, calculs et recommandations. Tu signales les données manquantes. Tu n'affirmes pas une conformité normative sans vérification explicite par un ingénieur. Réponds en français technique, précis et traçable.`;
