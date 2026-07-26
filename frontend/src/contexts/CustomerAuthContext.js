"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth-service";
import { setAccessToken } from "@/services/api-client";

const CustomerAuthContext = createContext(null);

export function CustomerAuthProvider({ children }) {
  const router = useRouter();
  const [account, setAccount] = useState(null);
  const isAdminRoute = usePathname().startsWith("/admin");
  const [loading, setLoading] = useState(() => !isAdminRoute);

  useEffect(() => {
    if (isAdminRoute) {
      return undefined;
    }

    let mounted = true;

    async function restoreSession() {
      try {
        const session = await authService.refresh();
        if (session.role !== "CUSTOMER") {
          setAccessToken(null);
          return;
        }

        const profile = await authService.me();
        if (mounted) setAccount(profile);
      } catch {
        setAccessToken(null);
        if (mounted) setAccount(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    restoreSession();
    return () => { mounted = false; };
  }, [isAdminRoute]);

  const value = useMemo(() => ({
    account,
    loading,
    async adoptSession(session) {
      if (session.role !== "CUSTOMER") throw new Error("Esta conta não é de cliente.");
      const profile = await authService.me();
      setAccount(profile);
      return profile;
    },
    async login(credentials) {
      const session = await authService.login(credentials);
      if (session.role !== "CUSTOMER") throw new Error("Use o acesso administrativo na área de administração.");
      const profile = await authService.me();
      setAccount(profile);
      return profile;
    },
    async register(data) { return authService.register(data); },
    async updateProfile(data) { const profile = await authService.updateMe(data); setAccount(profile); return profile; },
    async logout() { await authService.logout(); setAccount(null); router.replace("/"); },
  }), [account, loading, router]);

  return <CustomerAuthContext.Provider value={value}>{children}</CustomerAuthContext.Provider>;
}

export function useCustomerAuth() {
  const context = useContext(CustomerAuthContext);
  if (!context) throw new Error("useCustomerAuth deve ser usado dentro de CustomerAuthProvider");
  return context;
}
