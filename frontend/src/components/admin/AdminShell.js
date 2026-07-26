"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Pizza, Tags, Ruler, CircleDot, PlusCircle, Store, LogOut, ExternalLink } from "lucide-react";
import logo from "../../../assets/images/logo.webp";
import { useAdminAuth } from "@/features/admin-auth/AdminAuthProvider";
import styles from "@/app/admin.module.css";

const links = [
  ["/admin", "Início", LayoutDashboard],
  ["/admin/produtos", "Produtos", Pizza],
  ["/admin/categorias", "Categorias", Tags],
  ["/admin/tamanhos", "Tamanhos", Ruler],
  ["/admin/bordas", "Bordas", CircleDot],
  ["/admin/adicionais", "Adicionais", PlusCircle],
  ["/admin/loja", "Configurações", Store],
];

function AdminNav() {
  const pathname = usePathname();
  return <nav className={styles.nav} aria-label="Administração">
    {links.map(([href, label, Icon]) => {
      const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
      return <Link key={href} href={href} className={active ? styles.navActive : ""} aria-current={active ? "page" : undefined}>
        <Icon size={19} strokeWidth={2} aria-hidden="true" /><span>{label}</span>
      </Link>;
    })}
  </nav>;
}

export function AdminShell({ children }) {
  const { logout } = useAdminAuth();
  return <div className={styles.shell}>
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <Image src={logo} alt="Pizza Express" loading="eager" />
        <span>Painel administrativo</span>
      </div>
      <AdminNav />
      <div className={styles.sidebarFooter}>
        <Link className={styles.catalogButton} href="/" target="_blank"><ExternalLink size={18} />Ver cardápio</Link>
        <button className={styles.logoutButton} onClick={logout}><LogOut size={18} />Sair</button>
      </div>
    </aside>
    <div className={styles.mobileBar}>
      <Link className={styles.mobileHeaderAction} href="/" target="_blank" aria-label="Ver cardápio"><ExternalLink size={20} /><span className={styles.srOnly}>Ver cardápio</span></Link>
      <Image className={styles.mobileHeaderLogo} src={logo} alt="Pizza Express" loading="eager" />
      <button className={`${styles.mobileHeaderAction} ${styles.mobileHeaderLogout}`} type="button" onClick={logout} aria-label="Sair"><LogOut size={20} /><span className={styles.srOnly}>Sair</span></button>
    </div>
    <div className={styles.mobileNav}><AdminNav /></div>
    <main className={styles.main}>
      <div className={styles.content}>
        {children}
      </div>
    </main>
  </div>;
}
