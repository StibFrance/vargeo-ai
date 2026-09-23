import { deflateRawSync } from "node:zlib";

type ReportSection = { key?: string; title?: string; content?: unknown };
type ReportContent = {
  cover?: { title?: unknown; code?: unknown; mission?: unknown; address?: unknown };
  ai_synthesis?: unknown;
  sections?: ReportSection[];
};

function xmlEscape(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function paragraph(text: unknown, options: { bold?: boolean; size?: number; after?: number } = {}) {
  const bold = options.bold ? "<w:b/>" : "";
  const size = options.size ? `<w:sz w:val="${options.size}"/><w:szCs w:val="${options.size}"/>` : "";
  const after = options.after ?? 120;
  return `<w:p><w:pPr><w:spacing w:after="${after}"/></w:pPr><w:r><w:rPr>${bold}${size}</w:rPr><w:t xml:space="preserve">${xmlEscape(text)}</w:t></w:r></w:p>`;
}

function contentParagraphs(content: unknown) {
  if (typeof content === "string" || typeof content === "number") return paragraph(content);
  const json = JSON.stringify(content ?? null, null, 2);
  return json.split("\n").map((line) => paragraph(line, { size: 18, after: 40 })).join("");
}

function crc32(buffer: Buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let i = 0; i < 8; i += 1) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function dosDateTime(date = new Date()) {
  const year = Math.max(date.getFullYear(), 1980);
  const time = (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2);
  const day = (year - 1980) << 9 | (date.getMonth() + 1) << 5 | date.getDate();
  return { time, day };
}

function zip(files: Array<{ name: string; data: Buffer }>) {
  const localParts: Buffer[] = [];
  const centralParts: Buffer[] = [];
  let offset = 0;
  const { time, day } = dosDateTime();

  for (const file of files) {
    const name = Buffer.from(file.name, "utf8");
    const raw = file.data;
    const compressed = deflateRawSync(raw);
    const crc = crc32(raw);

    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0x0800, 6);
    local.writeUInt16LE(8, 8);
    local.writeUInt16LE(time, 10);
    local.writeUInt16LE(day, 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(compressed.length, 18);
    local.writeUInt32LE(raw.length, 22);
    local.writeUInt16LE(name.length, 26);
    local.writeUInt16LE(0, 28);
    localParts.push(local, name, compressed);

    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4);
    central.writeUInt16LE(20, 6);
    central.writeUInt16LE(0x0800, 8);
    central.writeUInt16LE(8, 10);
    central.writeUInt16LE(time, 12);
    central.writeUInt16LE(day, 14);
    central.writeUInt32LE(crc, 16);
    central.writeUInt32LE(compressed.length, 20);
    central.writeUInt32LE(raw.length, 24);
    central.writeUInt16LE(name.length, 28);
    central.writeUInt16LE(0, 30);
    central.writeUInt16LE(0, 32);
    central.writeUInt16LE(0, 34);
    central.writeUInt16LE(0, 36);
    central.writeUInt32LE(0, 38);
    central.writeUInt32LE(offset, 42);
    centralParts.push(central, name);

    offset += local.length + name.length + compressed.length;
  }

  const centralDirectory = Buffer.concat(centralParts);
  const localData = Buffer.concat(localParts);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(0, 4);
  eocd.writeUInt16LE(0, 6);
  eocd.writeUInt16LE(files.length, 8);
  eocd.writeUInt16LE(files.length, 10);
  eocd.writeUInt32LE(centralDirectory.length, 12);
  eocd.writeUInt32LE(localData.length, 16);
  eocd.writeUInt16LE(0, 20);
  return Buffer.concat([localData, centralDirectory, eocd]);
}

export function buildReportDocx(content: ReportContent) {
  const body: string[] = [];
  body.push(paragraph(content.cover?.title ?? "Rapport VarGeo.AI", { bold: true, size: 36, after: 220 }));
  body.push(paragraph(`${content.cover?.code ?? ""} - ${content.cover?.mission ?? ""}`, { bold: true, size: 24 }));
  if (content.cover?.address) body.push(paragraph(content.cover.address, { size: 22, after: 260 }));

  if (content.ai_synthesis) {
    body.push(paragraph("Synthese assistee", { bold: true, size: 28, after: 100 }));
    body.push(contentParagraphs(content.ai_synthesis));
  }

  for (const section of content.sections ?? []) {
    body.push(paragraph(section.title ?? section.key ?? "Section", { bold: true, size: 28, after: 100 }));
    body.push(contentParagraphs(section.content));
  }

  body.push(paragraph("Document genere par VarGeo.AI - validation ingenieur requise avant emission.", { size: 18, after: 0 }));

  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${body.join("")}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134" w:header="708" w:footer="708" w:gutter="0"/></w:sectPr></w:body></w:document>`;

  const contentTypes = `<?xml version="1.0" encoding="UTF-8"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>`;
  const rels = `<?xml version="1.0" encoding="UTF-8"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`;

  return zip([
    { name: "[Content_Types].xml", data: Buffer.from(contentTypes, "utf8") },
    { name: "_rels/.rels", data: Buffer.from(rels, "utf8") },
    { name: "word/document.xml", data: Buffer.from(documentXml, "utf8") },
  ]);
}
