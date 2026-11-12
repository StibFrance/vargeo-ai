import { mkdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const buildDir = fileURLToPath(new URL("../build/", import.meta.url));
const source = fileURLToPath(new URL("../assets/icon.svg", import.meta.url));
const target = fileURLToPath(new URL("../build/icon.png", import.meta.url));

await mkdir(buildDir, { recursive: true });
const svg = await readFile(source);
await sharp(svg).resize(512, 512).png().toFile(target);
console.log("Icone Windows generee :", target);
