"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type UserRow = { id: string; email: string; name: string; role: string; is_active: boolean; created_at: string; last_login_at?: string | null };

export default function AdminUsersPanel({ users }: { users: UserRow[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(Object.fromEntries(fd.entries())),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setError(data.error || "Creation impossible");
      return;
    }
    e.currentTarget.reset();
    router.refresh();
  }

  return <div className="split" style={{ marginTop: 18 }}>
    <form className="card form" onSubmit={submit}>
      <h3>Ajouter un utilisateur</h3>
      <div className="field"><label>Nom</label><input name="name" required /></div>
      <div className="field"><label>E-mail</label><input name="email" type="email" required /></div>
      <div className="field"><label>Role</label><select name="role" defaultValue="engineer"><option value="engineer">Ingenieur</option><option value="technician">Technicien</option><option value="admin">Administrateur</option><option value="client">Client</option></select></div>
      <div className="field"><label>Mot de passe initial</label><input name="password" type="password" minLength={12} autoComplete="new-password" required /></div>
      <div className="notice">Les comptes client sont cloisonnés : ils ne voient que les dossiers qui leur sont explicitement attribués.</div>
      {error && <div className="danger-text">{error}</div>}
      <button className="button" disabled={busy}>{busy ? "Création..." : "Créer l'utilisateur"}</button>
    </form>
    <section className="card">
      <h3>Utilisateurs</h3>
      <table><tbody>{users.map((u) => <tr key={u.id}><td><strong>{u.name}</strong><br/><span className="muted">{u.email}</span></td><td><span className="badge">{u.role}</span></td><td><span className={u.is_active ? "success" : "muted"}>{u.is_active ? "Actif" : "Inactif"}</span></td></tr>)}</tbody></table>
    </section>
  </div>;
}
