import { mkdir, readFile } from "node:fs/promises";
import sharp from "sharp";

await mkdir(new URL("../build/", import.meta.url), { recursive: true });
const svg = await readFile(new URL("../assets/icon.svg", import.meta.url));
await sharp(svg).resize(512, 512).png().toFile(new URL("../build/icon.png", import.meta.url));
console.log("Icone Windows generee.");
