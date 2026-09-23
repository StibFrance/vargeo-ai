import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import LoginForm from "./login-form";

export default async function LoginPage() {
  if (await getCurrentUser()) redirect("/dashboard");
  return <main className="login-wrap"><section className="login-card">
    <div className="login-logo"><div className="brand-mark"/><div><div className="eyebrow">Plateforme professionnelle</div><strong>VarGéo.AI</strong></div></div>
    <h1>Connexion sécurisée</h1><p className="muted">Accès réservé aux utilisateurs autorisés.</p>
    <LoginForm />
  </section></main>;
}
