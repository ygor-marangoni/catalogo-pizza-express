"use client";

import Link from "next/link";
import { CheckCircle2, Eye, EyeOff, UserPlus } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CustomerAuthShell } from "@/components/account/CustomerAuthShell";
import { useCustomerAuth } from "@/contexts/CustomerAuthContext";
import styles from "../conta/account.module.css";

export default function RegisterPage() {
  const { register } = useCustomerAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [sending, setSending] = useState(false);

  async function submit(event) {
    event.preventDefault();
    if (sending) return;
    setSending(true);
    setError("");

    try {
      await register(form);
      setSuccess(true);
      window.setTimeout(() => router.push("/login"), 900);
    } catch (exception) {
      setError(exception.message);
    } finally {
      setSending(false);
    }
  }

  return <CustomerAuthShell
    title="Crie sua conta"
    footer={!success && <p className={styles.authFooter}>
      Já possui uma conta? <Link href="/login">Entrar agora</Link>
    </p>}
  >
    {success ? <div className={styles.authSuccess}>
      <span className={styles.emptyIcon}><CheckCircle2 size={26} /></span>
      <h2>Conta criada com sucesso</h2>
      <p>Estamos direcionando você para o acesso.</p>
      <Link className={styles.primary} href="/login">Entrar agora</Link>
    </div> : <form className={styles.form} onSubmit={submit}>
      <label>
        Nome completo
        <input
          autoComplete="name"
          placeholder="Como podemos chamar você?"
          required
          minLength="2"
          maxLength="120"
          value={form.name}
          onChange={(event) => setForm({ ...form, name: event.target.value })}
        />
      </label>
      <label>
        E-mail
        <input
          autoComplete="email"
          type="email"
          placeholder="seu@email.com"
          required
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
        />
      </label>
      <label className={styles.passwordField}>
        Senha
        <span className={styles.passwordControl}>
          <input
            autoComplete="new-password"
            type={showPassword ? "text" : "password"}
            placeholder="Use pelo menos 8 caracteres"
            required
            minLength="8"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
          />
          <button
            className={styles.passwordToggle}
            type="button"
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            onClick={() => setShowPassword((current) => !current)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </span>
      </label>
      {error && <p className={styles.error} role="alert">{error}</p>}
      <button className={`${styles.primary} ${styles.authSubmit}`} disabled={sending}>
        <UserPlus size={17} />
        {sending ? "Criando conta..." : "Criar minha conta"}
      </button>
    </form>}
  </CustomerAuthShell>;
}
