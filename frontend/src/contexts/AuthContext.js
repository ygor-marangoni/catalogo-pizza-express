"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth-service";
import { setAccessToken } from "@/services/api-client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const router = useRouter();
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authService.refresh().then((session) => {
      if (session.role === "ADMIN") { setAccount(session); return session; }
      setAccessToken(null);
    }).catch(() => setAccessToken(null)).finally(() => setLoading(false));
  }, []);

  const value = useMemo(() => ({
    account, loading,
    async login(credentials) { const session = await authService.login(credentials); if (session.role !== "ADMIN") throw new Error("Esta área é exclusiva para administradores."); setAccount(session); return session; },
    async logout() { await authService.logout(); setAccount(null); router.replace("/login"); },
  }), [account, loading, router]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() { const context = useContext(AuthContext); if (!context) throw new Error("useAuth deve ser usado dentro de AuthProvider"); return context; }
