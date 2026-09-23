import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VarGéo.AI",
  description: "Plateforme d'ingénierie géotechnique assistée par IA"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr"><body>{children}</body></html>;
}
