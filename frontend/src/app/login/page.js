"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCustomerAuth } from "@/contexts/CustomerAuthContext";
import { authService } from "@/services/auth-service";
import styles from "../conta/account.module.css";

export default function LoginPage() {
  const { adoptSession } = useCustomerAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setSending(true); setError("");
    try {
      const session = await authService.login(form);
      const next = searchParams.get("next");
      if (session.role === "ADMIN") router.replace(next || "/admin");
      else { await adoptSession(session); router.replace(next || "/conta"); }
    } catch (exception) { setError(exception.message); setSending(false); }
  }

  return <main className={styles.page}><section className={`${styles.panel} ${styles.narrow}`}><h1>Entrar</h1><p>Use sua conta de cliente ou administrador.</p><form className={styles.form} onSubmit={submit}><label>Email<input type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label><label>Senha<input type="password" required value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /></label>{error && <p className={styles.error} role="alert">{error}</p>}<button className={styles.primary} disabled={sending}>{sending ? "Entrando…" : "Entrar"}</button></form><div className={styles.links}><Link href="/conta/cadastro">Criar conta de cliente</Link><Link href="/">Voltar ao cardápio</Link></div></section></main>;
}

