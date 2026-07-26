"use client";

import Link from "next/link";
import { ArrowLeft, Check, Save, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { useCustomerAuth } from "@/contexts/CustomerAuthContext";
import styles from "../account.module.css";

function ProfileForm({ account, updateProfile, onCancel }) {
  const [form, setForm] = useState({ name: account.name, email: account.email });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(event) {
    event.preventDefault();
    if (saving) return;
    setError("");
    setMessage("");
    setSaving(true);
    try {
      await updateProfile(form);
      setMessage("Perfil atualizado com sucesso.");
    } catch (exception) {
      setError(exception.message);
    } finally {
      setSaving(false);
    }
  }

  return <form className={styles.form} onSubmit={submit}>
    <div className={styles.formGrid}>
      <label>Nome completo<input autoComplete="name" required minLength="2" maxLength="120" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
      <label>E-mail<input autoComplete="email" type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label>
    </div>
    {message && <p className={styles.success}><Check size={16} />{message}</p>}
    {error && <p className={styles.error} role="alert">{error}</p>}
    <div className={styles.formActions}>
      <button className={styles.secondary} type="button" onClick={onCancel}>Cancelar</button>
      <button className={styles.primary} disabled={saving}><Save size={16} />{saving ? "Salvando..." : "Salvar alterações"}</button>
    </div>
  </form>;
}

export default function ProfilePage() {
  const { account, loading, updateProfile } = useCustomerAuth();
  const [editing, setEditing] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (!editing || closing) return undefined;
    const timer = window.setTimeout(() => document.getElementById("profile-edit-form")?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
    return () => window.clearTimeout(timer);
  }, [closing, editing]);

  function openEditor() {
    setClosing(false);
    setEditing(true);
  }

  function closeEditor() {
    setClosing(true);
    window.setTimeout(() => { setEditing(false); setClosing(false); }, 220);
  }

  if (loading) return <main className={styles.page}><section className={styles.loadingState}><span className={styles.loadingSpinner} /><p>Carregando seu perfil...</p></section></main>;
  if (!account) return <main className={styles.page}><section className={styles.emptyState}><p>Entre para acessar seu perfil.</p><Link className={styles.primary} href="/login?next=/conta/perfil">Entrar</Link></section></main>;

  return <main className={styles.page}>
    <Link className={styles.backLink} href="/conta"><ArrowLeft size={16} />Minha conta</Link>
    <section className={styles.profileShowcase} aria-labelledby="profile-title">
      <div className={styles.profileCover} aria-hidden="true" />
      <div className={styles.profileIdentity}>
        <Avatar className={styles.profileAvatar} name={account.name} size="large" />
        <p className={styles.eyebrow}>Perfil Pizza Express</p>
        <h1 id="profile-title">{account.name}</h1>
        <p className={styles.profileEmail}>{account.email}</p>
        <div className={styles.profileActions}>
          <button className={styles.primary} type="button" onClick={openEditor}>Editar perfil</button>
        </div>
      </div>
    </section>
    {editing && <section className={`${styles.panel} ${styles.profileEditPanel} ${closing ? styles.profileEditPanelClosing : ""}`} id="profile-edit-form">
      <div className={styles.formHeader}>
        <div className={styles.profileSectionIcon}><ShieldCheck size={19} /></div>
        <div><h2>Informações da conta</h2><p>Revise seus dados para agilizar os próximos pedidos.</p></div>
      </div>
      <ProfileForm account={account} updateProfile={updateProfile} onCancel={closeEditor} />
    </section>}
  </main>;
}
