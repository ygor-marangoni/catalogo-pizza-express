"use client";

import Link from "next/link";
import { AlertTriangle, ArrowRight, ClipboardList, Heart, LogOut, ShoppingBag, Trash2, UserRound } from "lucide-react";
import { useState } from "react";
import { useCustomerAuth } from "@/contexts/CustomerAuthContext";
import { Avatar } from "@/components/ui/Avatar";
import { Modal } from "@/components/ui/Modal";
import styles from "./account.module.css";

const accountLinks = [
  { href: "/conta/perfil", title: "Meu perfil", description: "Mantenha seus dados pessoais sempre atualizados.", icon: UserRound },
  { href: "/conta/favoritos", title: "Favoritos", description: "Encontre rapidamente as pizzas que você mais gosta.", icon: Heart },
  { href: "/conta/pedidos", title: "Meus pedidos", description: "Consulte seu histórico e acompanhe cada pedido.", icon: ClipboardList },
];

function AccountLoading() {
  return <main className={styles.page}>
    <section className={styles.loadingState} aria-live="polite">
      <span className={styles.loadingSpinner} />
      <p>Preparando sua conta...</p>
    </section>
  </main>;
}

export default function AccountPage() {
  const { account, loading, logout, deleteAccount } = useCustomerAuth();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteText, setDeleteText] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deleting, setDeleting] = useState(false);

  async function confirmDelete() {
    if (deleteText.trim().toUpperCase() !== "EXCLUIR" || deleting) return;
    setDeleting(true);
    setDeleteError("");
    try {
      await deleteAccount();
    } catch (exception) {
      setDeleteError(exception.message);
      setDeleting(false);
    }
  }

  if (loading) return <AccountLoading />;

  if (!account) {
    return <main className={styles.page}>
      <header className={`${styles.toolbar} ${styles.favoriteToolbar} ${styles.pageHeader}`}>
        <div>
        <p className={styles.eyebrow}>Área do cliente</p>
        <h1>Seu espaço, do seu jeito.</h1>
        <p>Entre para acompanhar pedidos, guardar favoritos e deixar seu próximo pedido ainda mais rápido.</p>
        </div>
      </header>
      <section className={styles.emptyState}>
        <div className={styles.emptyIcon}><UserRound size={26} /></div>
        <h2>Você ainda não entrou</h2>
        <p>Faça login ou crie uma conta gratuita para acessar todos os recursos da sua área.</p>
        <div className={styles.heroActions}>
          <Link className={styles.primary} href="/login">Entrar</Link>
          <Link className={styles.secondary} href="/cadastro">Criar conta</Link>
        </div>
      </section>
    </main>;
  }

  return <main className={styles.page}>
    <section className={styles.accountHero}>
      <div className={styles.heroIdentity}>
        <Avatar className={styles.heroAvatar} name={account.name} size="large" />
        <div>
          <p className={styles.eyebrow}>Minha conta</p>
          <h1>Olá, {account.name.split(" ")[0]}.</h1>
          <p>Que bom ter você por aqui.</p>
        </div>
      </div>
      <div className={styles.heroActions}>
        <Link className={styles.secondary} href="/"><ShoppingBag size={16} />Ver cardápio</Link>
        <button className={styles.secondary} type="button" onClick={logout}><LogOut size={16} />Sair</button>
      </div>
    </section>

    <div className={styles.sectionHeader}>
      <div>
        <h2>Atalhos da sua conta</h2>
        <p>Tudo o que você precisa, em um só lugar.</p>
      </div>
    </div>
    <section className={styles.grid} aria-label="Atalhos da conta">
      {accountLinks.map(({ href, title, description, icon: Icon }) => (
        <Link className={styles.card} href={href} key={href}>
          <span className={styles.cardIcon}><Icon size={21} /></span>
          <div className={styles.cardTitle}><h2>{title}</h2><span className={styles.cardArrow}><ArrowRight size={18} /></span></div>
          <p>{description}</p>
        </Link>
      ))}
    </section>

    <section className={styles.featureBanner}>
      <div>
        <strong>Já sabe o que quer?</strong>
        <p>Explore o cardápio e monte sua pizza do seu jeito.</p>
      </div>
      <Link className={styles.textLink} href="/">Pedir agora <ArrowRight size={16} /></Link>
    </section>

    <section className={styles.deleteZone} aria-labelledby="delete-account-title">
      <div className={styles.deleteZoneIcon}><Trash2 size={19} /></div>
      <div><strong id="delete-account-title">Excluir minha conta</strong><p>Encerrar seu acesso à Pizza Express.</p></div>
      <button className={styles.deleteZoneAction} type="button" onClick={() => { setDeleteText(""); setDeleteError(""); setDeleteOpen(true); }}>Excluir conta</button>
    </section>

    <Modal open={deleteOpen} onClose={() => !deleting && setDeleteOpen(false)} title="Excluir sua conta">
      <div className={styles.deleteModal}>
        <div className={styles.deleteModalIcon}><AlertTriangle size={22} /></div>
        <h2>Tem certeza que deseja continuar?</h2>
        <p>Sua conta será desativada e você perderá o acesso ao perfil. Seus pedidos históricos serão preservados.</p>
        <label>Digite <strong>EXCLUIR</strong> para confirmar<input value={deleteText} onChange={(event) => setDeleteText(event.target.value)} placeholder="EXCLUIR" disabled={deleting} autoComplete="off" /></label>
        {deleteError && <p className={styles.error} role="alert">{deleteError}</p>}
        <div className={styles.deleteModalActions}>
          <button className={styles.secondary} type="button" onClick={() => setDeleteOpen(false)} disabled={deleting}>Cancelar</button>
          <button className={styles.deleteConfirm} type="button" onClick={confirmDelete} disabled={deleteText.trim().toUpperCase() !== "EXCLUIR" || deleting}>{deleting ? "Excluindo..." : "Excluir minha conta"}</button>
        </div>
      </div>
    </Modal>
  </main>;
}
