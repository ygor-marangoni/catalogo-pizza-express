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
  const [role, setRole] = useState(null);
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
        if (session.role === "ADMIN") {
          setRole("ADMIN");
          return;
        }
        if (session.role !== "CUSTOMER") {
          setRole(null);
          setAccessToken(null);
          return;
        }

        const profile = await authService.me();
        if (mounted) { setRole("CUSTOMER"); setAccount(profile); }
      } catch {
        setAccessToken(null);
        if (mounted) { setRole(null); setAccount(null); }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    restoreSession();
    return () => { mounted = false; };
  }, [isAdminRoute]);

  const value = useMemo(() => ({
    account,
    role,
    loading,
    async adoptSession(session) {
      if (session.role !== "CUSTOMER") throw new Error("Esta conta não é de cliente.");
      const profile = await authService.me();
      setRole("CUSTOMER");
      setAccount(profile);
      return profile;
    },
    async login(credentials) {
      const session = await authService.login(credentials);
      if (session.role !== "CUSTOMER") throw new Error("Use o acesso administrativo na área de administração.");
      const profile = await authService.me();
      setRole("CUSTOMER");
      setAccount(profile);
      return profile;
    },
    async register(data) { return authService.register(data); },
    async updateProfile(data) { const profile = await authService.updateMe(data); setAccount(profile); return profile; },
    async logout() { await authService.logout(); setRole(null); setAccount(null); router.replace("/"); },
  }), [account, loading, role, router]);

  return <CustomerAuthContext.Provider value={value}>{children}</CustomerAuthContext.Provider>;
}

export function useCustomerAuth() {
  const context = useContext(CustomerAuthContext);
  if (!context) throw new Error("useCustomerAuth deve ser usado dentro de CustomerAuthProvider");
  return context;
}
