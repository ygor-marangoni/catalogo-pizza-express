"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { AdminAuthProvider, useAdminAuth } from "@/features/admin-auth/AdminAuthProvider";
import logo from "../../../../../assets/images/logo.webp";
import styles from "@/app/admin.module.css";

export const dynamic = "force-dynamic";

function LoginForm() {
  const { login } = useAdminAuth();
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError("");
    const data = new FormData(event.currentTarget);
    try {
      await login(data.get("email"), data.get("password"));
      router.replace("/admin");
    } catch (loginError) {
      setError(loginError.status === 429 ? "Muitas tentativas. Aguarde e tente novamente."
        : loginError.status === 401 ? "E-mail ou senha inválidos."
          : loginError.code === "API_OFFLINE" ? "API indisponível no momento."
            : loginError.message);
    } finally { setSubmitting(false); }
  }

  return <main className={styles.loginPage}>
    <section className={styles.loginCard} aria-labelledby="login-title">
      <div className={styles.loginLogo}><Image src={logo} alt="Pizza Express" loading="eager" /></div>
      <h1 id="login-title">Acesso administrativo</h1>
      <form className={styles.form} onSubmit={submit}>
        <label className={styles.field}>E-mail<input name="email" type="email" autoComplete="username" placeholder="seu@email.com" required /></label>
        <label className={styles.field}>Senha<span className={styles.password}><input name="password" type={show ? "text" : "password"} autoComplete="current-password" placeholder="Digite sua senha" required /><button type="button" aria-label={show ? "Ocultar senha" : "Mostrar senha"} onClick={() => setShow((value) => !value)}>{show ? <EyeOff size={19} /> : <Eye size={19} />}</button></span></label>
        {error && <p className={styles.error} role="alert">{error}</p>}
        <button className={styles.button} disabled={submitting}>{submitting ? "Entrando…" : "Entrar no painel"}</button>
      </form>
    </section>
  </main>;
}

export default function LoginPage() {
  return <AdminAuthProvider><LoginForm /></AdminAuthProvider>;
}
