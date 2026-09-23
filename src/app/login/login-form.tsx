"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm(){
  const router=useRouter(); const [error,setError]=useState(""); const [loading,setLoading]=useState(false);
  async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();setLoading(true);setError("");const fd=new FormData(e.currentTarget);const res=await fetch("/api/auth/login",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({email:fd.get("email"),password:fd.get("password")})});const data=await res.json().catch(()=>({}));setLoading(false);if(!res.ok){setError(data.error||"Connexion impossible");return;}router.replace("/dashboard");router.refresh();}
  return <form className="form" onSubmit={submit} style={{marginTop:20}}><div className="field"><label>E-mail</label><input name="email" type="email" autoComplete="email" required/></div><div className="field"><label>Mot de passe</label><input name="password" type="password" autoComplete="current-password" required/></div>{error&&<div className="danger-text">{error}</div>}<button className="button" disabled={loading}>{loading?"Connexion…":"Se connecter"}</button></form>;
}
