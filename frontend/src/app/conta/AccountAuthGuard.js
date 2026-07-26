"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useCustomerAuth } from "@/contexts/CustomerAuthContext";
import styles from "./account.module.css";

const privatePaths = ["/conta/perfil", "/conta/favoritos", "/conta/pedidos"];

export function AccountAuthGuard({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { account, loading } = useCustomerAuth();
  const requiresAuth = privatePaths.some((path) => pathname === path || pathname.startsWith(`${path}/`));

  useEffect(() => {
    if (requiresAuth && !loading && !account) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [account, loading, pathname, requiresAuth, router]);

  if (requiresAuth && (loading || !account)) {
    return <main className={styles.page} aria-live="polite">
      <section className={styles.loadingState}>
        <span className={styles.loadingSpinner} />
        <p>Carregando sua conta...</p>
      </section>
    </main>;
  }

  return children;
}
