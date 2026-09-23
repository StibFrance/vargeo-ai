import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

const require = createRequire(import.meta.url);
let ts;
try {
  ts = require("typescript");
} catch {
  const nodeRoot = dirname(dirname(process.execPath));
  ts = require(join(nodeRoot, "lib", "node_modules", "typescript", "lib", "typescript.js"));
}

const source = await readFile(new URL("../src/lib/calculations.ts", import.meta.url), "utf8");
const js = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const moduleObject = { exports: {} };
const context = vm.createContext({ module: moduleObject, exports: moduleObject.exports, console });
vm.runInContext(js, context, { filename: "calculations.cjs" });
const { calculateModule } = moduleObject.exports;

const cases = [
  ["strat", { horizons: "Argile;2;19;22;15;8;0.9\nMarne;3;21;28;25;20;1.8" }, (r) => assert.equal(r.layer_count, 2)],
  ["pressio", { pressio: "1;8;1.2;0.1\n2;10;1.5;0.1" }, (r) => assert.equal(r.n, 2)],
  ["fonda", { B: 1.2, L: 1.2, D: 0.8, gamma: 19, phi: 28, c: 0, servicePressure: 150, FS: 3, Em: 15, nu: 0.3 }, (r) => assert.ok(r.gross_ultimate_bearing_kPa > 0)],
  ["stab", { H: 2, phi: 30, gamma: 19, surcharge: 10, waterHeight: 0, baseWidth: 1.4, wallWeight: 55, baseFriction: 0.55, baseCohesion: 0 }, (r) => assert.ok(r.horizontal_actions_kN_per_m.total > 0)],
  ["sensor", { sensorType: "Fissurimetre", unit: "mm", warningThreshold: 2, alertThreshold: 4, series: "2026-09-01;0\n2026-09-08;0.5\n2026-09-15;1.0" }, (r) => assert.equal(r.measurement_count, 3)],
  ["struct", { span: 5, tributaryWidth: 3, deadLoad: 6, liveLoad: 2.5, serviceAxial: 350, footingB: 1.6, footingL: 1.6 }, (r) => assert.ok(r.footing_service_pressure_kPa > 0)],
  ["enviro", { risks: "Rejet boues;3;4;50\nPoussiere;2;2;60" }, (r) => assert.equal(r.risks.length, 2)],
  ["hydro", { Q: 0.0002, length: 1, area: 0.01, headLoss: 0.5, pumpQ: 0.002, drawdown: 1.2, radius: 20, wellRadius: 0.1, aquiferThickness: 8 }, (r) => assert.ok(r.darcy_permeability_m_s > 0)],
  ["pollu", { substance: "C10-C40", concentration: 650, threshold: 500, soilDensity: 1.8, volume: 120 }, (r) => assert.equal(r.screening_status, "au-dessus de la valeur de comparaison")],
];

for (const [slug, input, check] of cases) {
  const result = calculateModule(slug, input);
  check(result);
  console.log(`OK ${slug}`);
}

assert.throws(() => calculateModule("fonda", { B: 0, L: 1 }), /invalides/i);
assert.throws(() => calculateModule("sensor", { series: "2026-09-01;0" }), /Deux mesures/i);
console.log(`Tous les tests moteurs sont passes: ${cases.length} modules + 2 cas invalides.`);
