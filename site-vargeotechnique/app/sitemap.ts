import type { MetadataRoute } from "next";
const base = "https://vargeotechnique.fr";
export default function sitemap(): MetadataRoute.Sitemap {
  const areas = ["var-83","bouches-du-rhone-13","alpes-maritimes-06","vaucluse-84","alpes-de-haute-provence-04","hautes-alpes-05"];
  const missions = ["g1","g2-avp","g2-pro","g3","g4","g5"];
  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    ...missions.map((slug) => ({ url: `${base}/missions/${slug}`, changeFrequency: "monthly" as const, priority: .85 })),
    ...areas.map((slug) => ({ url: `${base}/geotechnique/${slug}`, changeFrequency: "monthly" as const, priority: .8 })),
    { url: `${base}/mentions-legales`, changeFrequency: "yearly", priority: .2 },
    { url: `${base}/confidentialite`, changeFrequency: "yearly", priority: .2 }
  ];
}
