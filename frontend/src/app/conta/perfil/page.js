"use client";

import Link from "next/link";
import { ArrowLeft, Check, Save } from "lucide-react";
import { useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { useCustomerAuth } from "@/contexts/CustomerAuthContext";
import styles from "../account.module.css";

function ProfileForm({ account, updateProfile }) {
  const [form, setForm] = useState({ name: account.name, email: account.email });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(event) {
    event.preventDefault(); setError(""); setMessage(""); setSaving(true);
    try { await updateProfile(form); setMessage("Perfil atualizado com sucesso."); }
    catch (exception) { setError(exception.message); }
    finally { setSaving(false); }
  }

  return <form className={styles.form} onSubmit={submit}>
    <label>Nome<input required minLength="2" maxLength="120" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
    <label>Email<input type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label>
    {message && <p className={styles.success}><Check size={15} />{message}</p>}
    {error && <p className={styles.error}>{error}</p>}
    <div className={styles.formActions}><Link className={styles.secondary} href="/conta">Cancelar</Link><button className={styles.primary} disabled={saving}><Save size={16} />{saving ? "Salvando…" : "Salvar alterações"}</button></div>
  </form>;
}

export default function ProfilePage() {
  const { account, loading, updateProfile } = useCustomerAuth();

  if (loading) return <main className={styles.page}><div className={styles.panel}>Carregando seu perfil…</div></main>;
  if (!account) return <main className={styles.page}><section className={styles.panel}><p>Entre para acessar seu perfil.</p><Link className={styles.primary} href="/conta/login?next=/conta/perfil">Entrar</Link></section></main>;

  return <main className={styles.page}>
    <div className={styles.toolbar}><div><Link className={styles.backLink} href="/conta"><ArrowLeft size={16} />Minha conta</Link><h1>Meu perfil</h1><p>Cuide dos dados que usamos para reconhecer você.</p></div></div>
    <section className={`${styles.panel} ${styles.narrow}`}>
      <div className={styles.profileHeader}><Avatar name={account.name} size="medium" /><div><h1>Dados pessoais</h1><p>Seu perfil Pizza Express</p></div></div>
      <ProfileForm account={account} updateProfile={updateProfile} />
    </section>
  </main>;
}
