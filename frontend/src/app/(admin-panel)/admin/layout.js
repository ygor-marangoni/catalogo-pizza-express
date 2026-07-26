import { AdminAuthProvider } from "@/features/admin-auth/AdminAuthProvider";
import { AdminAuthGuard } from "@/features/admin-auth/AdminAuthGuard";
import { AdminShell } from "@/components/admin/AdminShell";
export const metadata = { title: "Administração | Pizza Express", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";
export default function AdminLayout({ children }) {
  return <AdminAuthProvider><AdminAuthGuard><AdminShell>{children}</AdminShell></AdminAuthGuard></AdminAuthProvider>;
}
