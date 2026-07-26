"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "./AdminAuthProvider";
import { AdminLoader } from "@/components/admin/AdminLoader";

export function AdminAuthGuard({ children }) {
  const { admin, loading } = useAdminAuth();
  const router = useRouter();
  useEffect(() => { if (!loading && !admin) router.replace("/admin/login"); }, [admin, loading, router]);
  if (loading) return <AdminLoader fullScreen label="Preparando seu painel administrativo..." />;
  return admin ? children : null;
}
