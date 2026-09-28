export type TextChunk = {
  index: number;
  heading: string | null;
  content: string;
};

function cleanText(value: string) {
  return value.replace(/\r/g, "").replace(/[\t ]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
}

export function chunkDocumentText(text: string, targetChars = 2200, overlapChars = 300): TextChunk[] {
  const clean = cleanText(text);
  if (!clean) return [];
  const paragraphs = clean.split(/\n{2,}/).map((x) => x.trim()).filter(Boolean);
  const chunks: TextChunk[] = [];
  let current = "";
  let heading: string | null = null;

  const flush = () => {
    const content = current.trim();
    if (!content) return;
    chunks.push({ index: chunks.length, heading, content });
    current = content.slice(Math.max(0, content.length - overlapChars));
  };

  for (const paragraph of paragraphs) {
    const looksLikeHeading = paragraph.length <= 140 && !/[.!?]$/.test(paragraph) &&
      (paragraph === paragraph.toUpperCase() || /^[0-9IVX]+[.\-)]\s+/.test(paragraph));
    if (looksLikeHeading) heading = paragraph;
    if ((current + "\n\n" + paragraph).length > targetChars && current.length > 600) flush();
    current = current ? `${current}\n\n${paragraph}` : paragraph;
  }

  if (current.trim()) chunks.push({ index: chunks.length, heading, content: current.trim() });
  return chunks;
}
