"use client";

import Link from "next/link";
import { ArrowRight, ClipboardList, Heart, LogOut, Sparkles, UserRound } from "lucide-react";
import { useCustomerAuth } from "@/contexts/CustomerAuthContext";
import { Avatar } from "@/components/ui/Avatar";
import styles from "./account.module.css";

const accountLinks = [
  { href: "/conta/perfil", title: "Meu perfil", description: "Mantenha seus dados sempre atualizados.", icon: UserRound },
  { href: "/conta/favoritos", title: "Favoritos", description: "Acesse rapidamente suas pizzas preferidas.", icon: Heart },
  { href: "/conta/pedidos", title: "Meus pedidos", description: "Consulte seus pedidos e acompanhe cada etapa.", icon: ClipboardList },
];

export default function AccountPage() {
  const { account, loading, logout } = useCustomerAuth();

  if (loading) return <main className={styles.page}><div className={styles.panel}>Carregando sua conta…</div></main>;

  if (!account) return <main className={styles.page}>
    <header className={styles.pageHeader}>
      <p className={styles.eyebrow}>Pizza Express</p>
      <h1>Seu espaço, do seu jeito.</h1>
      <p>Entre para acompanhar pedidos, guardar favoritos e deixar seu próximo pedido ainda mais rápido.</p>
    </header>
    <section className={`${styles.panel} ${styles.narrow}`}>
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}><UserRound size={25} /></div>
        <h2>Você ainda não entrou</h2>
        <p>Faça login ou crie uma conta para acessar todos os recursos da sua área.</p>
        <div className={styles.heroActions}><Link className={styles.primary} href="/conta/login">Entrar</Link><Link className={styles.secondary} href="/conta/cadastro">Criar conta</Link></div>
      </div>
    </section>
  </main>;

  return <main className={styles.page}>
    <section className={styles.accountHero}>
      <div className={styles.heroIdentity}>
        <Avatar className={styles.heroAvatar} name={account.name} size="large" />
        <div><p className={styles.eyebrow}>Minha conta</p><h1>Olá, {account.name.split(" ")[0]}.</h1><p>Que bom ter você por aqui.</p></div>
      </div>
      <div className={styles.heroActions}><Link className={styles.secondary} href="/"><Sparkles size={16} />Ver cardápio</Link><button className={styles.secondary} type="button" onClick={logout}><LogOut size={16} />Sair</button></div>
    </section>

    <div className={styles.sectionHeader}><div><h2>Atalhos da sua conta</h2><p>Tudo o que você precisa, em um só lugar.</p></div></div>
    <section className={styles.grid} aria-label="Atalhos da conta">
      {accountLinks.map(({ href, title, description, icon: Icon }) => <Link className={styles.card} href={href} key={href}><span className={styles.cardIcon}><Icon size={21} /></span><h2>{title}</h2><p>{description}</p><span className={styles.cardArrow}><ArrowRight size={18} /></span></Link>)}
    </section>

    <section className={styles.featureBanner}><div><strong>Já sabe o que quer?</strong><p>Explore o cardápio e monte sua pizza do seu jeito.</p></div><Link className={styles.textLink} href="/">Pedir agora <ArrowRight size={16} /></Link></section>
  </main>;
}
