"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, Pizza, Tags, Ruler, CircleDot, PlusCircle, Store, LogOut, ExternalLink, Users, ClipboardList, Ellipsis } from "lucide-react";
import logo from "../../../assets/images/logo.webp";
import { useAdminAuth } from "@/features/admin-auth/AdminAuthProvider";
import styles from "@/app/admin.module.css";

const links = [
  ["/admin", "Início", LayoutDashboard],
  ["/admin/pedidos", "Pedidos", ClipboardList],
  ["/admin/produtos", "Produtos", Pizza],
  ["/admin/categorias", "Categorias", Tags],
  ["/admin/loja", "Configurações", Store],
  ["/admin/tamanhos", "Tamanhos", Ruler],
  ["/admin/bordas", "Bordas", CircleDot],
  ["/admin/adicionais", "Adicionais", PlusCircle],
  ["/admin/clientes", "Clientes", Users],
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

function MobileAdminNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const primaryLinks = links.slice(0, 5);
  const moreLinks = links.slice(5);
  const isActive = (href) => href === "/admin" ? pathname === href : pathname.startsWith(href);
  const moreIsActive = moreLinks.some(([href]) => isActive(href));

  return <nav className={styles.mobileNavList} aria-label="Navegação administrativa móvel">
    {primaryLinks.map(([href, label, Icon]) => <Link key={href} href={href} className={isActive(href) ? styles.mobileNavActive : ""} aria-label={label} aria-current={isActive(href) ? "page" : undefined}>
      <Icon size={19} strokeWidth={2} aria-hidden="true" />
    </Link>)}
    <button type="button" className={`${moreOpen || moreIsActive ? styles.mobileNavActive : ""}`} onClick={() => setMoreOpen((value) => !value)} aria-label="Mais opções" aria-expanded={moreOpen}>
      <Ellipsis size={21} strokeWidth={2.2} aria-hidden="true" />
    </button>
    {moreOpen && <div className={styles.mobileMoreMenu}>
      {moreLinks.map(([href, label, Icon]) => <Link key={href} href={href} onClick={() => setMoreOpen(false)} className={isActive(href) ? styles.mobileMoreActive : ""} aria-current={isActive(href) ? "page" : undefined}>
        <Icon size={18} strokeWidth={2} aria-hidden="true" /><span>{label}</span>
      </Link>)}
    </div>}
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
    <div className={styles.mobileNav}><MobileAdminNav /></div>
    <main className={styles.main}><div className={styles.content}>{children}</div></main>
  </div>;
}
