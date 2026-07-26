"use client";

import Link from "next/link";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CustomerAuthShell } from "@/components/account/CustomerAuthShell";
import { useCustomerAuth } from "@/contexts/CustomerAuthContext";
import { getSafeNextPath } from "@/lib/navigation/safe-next-path";
import { authService } from "@/services/auth-service";
import styles from "../conta/account.module.css";

export default function LoginPage() {
  const { adoptSession } = useCustomerAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  async function submit(event) {
    event.preventDefault();
    if (sending) return;
    setSending(true);
    setError("");

    try {
      const session = await authService.login(form);
      if (session.role === "ADMIN") {
        router.replace(getSafeNextPath(searchParams.get("next"), "/admin"));
        return;
      }

      await adoptSession(session);
      router.replace(getSafeNextPath(searchParams.get("next"), "/conta"));
    } catch (exception) {
      setError(exception.message);
      setSending(false);
    }
  }

  return <CustomerAuthShell
    title="Entre na sua conta"
    footer={<p className={styles.authFooter}>
      Ainda não tem uma conta? <Link href="/cadastro">Cadastre-se</Link>
    </p>}
  >
    <form className={styles.form} onSubmit={submit}>
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
            autoComplete="current-password"
            type={showPassword ? "text" : "password"}
            placeholder="Digite sua senha"
            required
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
        <LogIn size={17} />
        {sending ? "Entrando..." : "Entrar na minha conta"}
      </button>
    </form>
  </CustomerAuthShell>;
}
