import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://vargeotechnique.fr"),
  title: {
    default: "Var Géotechnique | Études de sol & ingénierie géotechnique en PACA",
    template: "%s | Var Géotechnique"
  },
  description:
    "Bureau d'études géotechniques en région PACA : missions G1 à G5, G2 PRO, investigations, pressiomètre, carottage, expertise fissures et RGA, fondations et suivi de travaux.",
  applicationName: "Var Géotechnique",
  keywords: [
    "étude de sol PACA",
    "bureau étude géotechnique",
    "G1",
    "G2 AVP",
    "G2 PRO",
    "G3",
    "G4",
    "G5",
    "retrait gonflement argiles",
    "fissures maison",
    "pressiomètre",
    "carottage",
    "fondations"
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Var Géotechnique | L'ingénierie du sol, de l'étude au chantier",
    description:
      "Particuliers et professionnels : études géotechniques G1 à G5, investigations, expertises RGA et accompagnement fondations sur toute la région PACA.",
    url: "https://vargeotechnique.fr",
    siteName: "Var Géotechnique",
    locale: "fr_FR",
    type: "website"
  },
  robots: { index: true, follow: true },
  icons: { icon: "/logo-brand.webp", apple: "/logo-brand.webp" }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${inter.variable} ${manrope.variable}`}>
      <body>{children}</body>
    </html>
  );
}
