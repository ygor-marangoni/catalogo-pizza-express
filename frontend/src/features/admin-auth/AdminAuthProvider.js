"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { loginAdmin, logoutAdmin, restoreAdminSession } from "./admin-auth-api";
import { onSessionExpired } from "@/lib/api/api-client";

const AdminAuthContext = createContext(null);
export function AdminAuthProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const clearSession = useCallback(() => { setAdmin(null); router.replace("/admin/login"); }, [router]);
  useEffect(() => {
    if (pathname === "/admin/login") {
      return undefined;
    }
    onSessionExpired(clearSession);
    restoreAdminSession().then(setAdmin).catch(() => setAdmin(null)).finally(() => setLoading(false));
    return () => onSessionExpired(null);
  }, [clearSession, pathname]);
  const login = useCallback(async (email, password) => { const current = await loginAdmin(email, password); setAdmin(current); return current; }, []);
  const logout = useCallback(async () => {
    try {
      await logoutAdmin();
    } finally {
      clearSession();
    }
  }, [clearSession]);
  const value = useMemo(() => ({ admin, loading: isLoginPage ? false : loading, login, logout }), [admin, isLoginPage, loading, login, logout]);
  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}
export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error("useAdminAuth deve ser usado dentro de AdminAuthProvider.");
  return context;
}
