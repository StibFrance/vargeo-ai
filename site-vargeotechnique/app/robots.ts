import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: "https://vargeotechnique.fr/sitemap.xml", host: "https://vargeotechnique.fr" };
}
