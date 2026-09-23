import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { readFile } from "node:fs/promises";
import vm from "node:vm";

const require = createRequire(import.meta.url);
let ts;
try {
  ts = require("typescript");
} catch {
  const nodeRoot = dirname(dirname(process.execPath));
  ts = require(join(nodeRoot, "lib", "node_modules", "typescript", "lib", "typescript.js"));
}

const source = await readFile(new URL("../src/lib/docx.ts", import.meta.url), "utf8");
const js = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
}).outputText;
const moduleObject = { exports: {} };
const context = vm.createContext({
  module: moduleObject,
  exports: moduleObject.exports,
  require,
  Buffer,
  process,
  console,
});
vm.runInContext(js, context, { filename: "docx.cjs" });
const { buildReportDocx } = moduleObject.exports;
const out = buildReportDocx({
  cover: { title: "Rapport test", code: "TEST-001", mission: "G2 PRO", address: "Brignoles" },
  sections: [{ title: "1. Objet", content: "Test export Word" }],
});
assert.ok(Buffer.isBuffer(out));
assert.ok(out.length > 500);
assert.equal(out.readUInt32LE(0), 0x04034b50);
assert.equal(out.subarray(out.length - 22, out.length - 18).readUInt32LE(0), 0x06054b50);
console.log(`Export DOCX valide: ${out.length} octets.`);
