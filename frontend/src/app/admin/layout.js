"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import styles from "./admin.module.css";

function AdminShell({ children }) {
  const { account, loading, logout } = useAuth();
  const pathname = usePathname();
  const isActive = (href) => pathname === href || (href !== "/admin" && pathname.startsWith(`${href}/`));
  if (loading) return <main className={styles.center}>Carregando sessão…</main>;
  if (!account) return children;
  return <div className={`${styles.shell} adminShell`}><aside className={styles.sidebar}><h1>Pizza Express</h1><p>Painel administrativo</p><nav><Link className={isActive("/admin") ? styles.activeNav : ""} href="/admin" aria-current={isActive("/admin") ? "page" : undefined}>Visão geral</Link><Link className={isActive("/admin/products") ? styles.activeNav : ""} href="/admin/products" aria-current={isActive("/admin/products") ? "page" : undefined}>Produtos</Link><Link className={isActive("/admin/categories") ? styles.activeNav : ""} href="/admin/categories" aria-current={isActive("/admin/categories") ? "page" : undefined}>Categorias</Link><Link className={isActive("/admin/settings") ? styles.activeNav : ""} href="/admin/settings" aria-current={isActive("/admin/settings") ? "page" : undefined}>Loja</Link></nav><button onClick={logout}>Sair</button></aside><main className={styles.content}>{children}</main></div>;
}

export default function AdminLayout({ children }) { return <AuthProvider><AdminShell>{children}</AdminShell></AuthProvider>; }

