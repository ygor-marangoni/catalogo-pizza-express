"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Equal, MapPin, TicketPercent } from "lucide-react";
import { useCallback, useState } from "react";
import shoppingBagIcon from "../../../assets/icons/shopping-bag.webp";
import userIcon from "../../../assets/icons/user.webp";
import { useCart } from "@/contexts/CartContext";
import { useCustomerAuth } from "@/contexts/CustomerAuthContext";
import { FloatingCartBar } from "@/components/cart/FloatingCartBar";
import { IconButton } from "@/components/ui/IconButton";
import { Avatar } from "@/components/ui/Avatar";
import { SearchInput } from "@/components/ui/SearchInput";
import { Container } from "@/components/ui/Container";
import styles from "./layout.module.css";

const CartDrawer = dynamic(() => import("@/components/cart/CartDrawer").then((module) => module.CartDrawer), { ssr: false });
const Modal = dynamic(() => import("@/components/ui/Modal").then((module) => module.Modal), { ssr: false });
const MobileMenu = dynamic(() => import("./MobileMenu").then((module) => module.MobileMenu), { ssr: false });

export function Header({ store, suggestions, categories }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [futureInfo, setFutureInfo] = useState(null);
  const { itemCount, hydrated, cartOpen, openCart, closeCart } = useCart();
  const { account, loading: authLoading } = useCustomerAuth();
  const openMenu = useCallback(() => setMenuOpen(true), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const closeFutureInfo = useCallback(() => setFutureInfo(null), []);
  const showDeliveryInfo = useCallback(() => setFutureInfo("A escolha do local de entrega será habilitada no fluxo de pedidos da Entrega 3."), []);
  const showCouponInfo = useCallback(() => setFutureInfo("Cupons reais dependem do CMS e do fluxo de pedidos. Esta função ainda não aplica descontos."), []);
  const showAccountInfo = useCallback(() => window.location.assign(account ? "/conta" : "/login"), [account]);
  return <>
    <header className={styles.header}>
      <Container className={styles.headerInner}>
        <IconButton className={styles.mobileMenuButton} label="Abrir menu" onClick={openMenu}><Equal size={29} strokeWidth={2.25} /></IconButton>
        <nav className={styles.nav} aria-label="Ações rápidas">
          <button className={styles.utility} type="button" onClick={showDeliveryInfo}><MapPin size={18} />Entrega</button>
          <button className={`${styles.utility} ${styles.coupon}`} type="button" onClick={showCouponInfo}><TicketPercent size={18} />Cupons</button>
        </nav>
        <Link href="/" className={styles.brand} aria-label={`${store.name} | início`}><Image src={store.logo} alt="Logo oficial da Pizza Express" width={104} height={104} priority loading="eager" /></Link>
        <div className={styles.rightGroup}>
          <div className={styles.search}><SearchInput compact suggestions={suggestions} /></div>
          <div className={styles.actions}>
            {!authLoading && (account ? <Link className={styles.accountAvatarLink} href="/conta" aria-label={`Abrir minha conta, ${account.name}`}><Avatar name={account.name} size="small" /></Link> : <span className={styles.desktopAccount}><Link href="/login" aria-label="Abrir conta"><IconButton className={`${styles.actionButton} ${styles.accountButton}`} label="Abrir conta"><Image className={styles.headerAssetIcon} src={userIcon} alt="" width={22} height={22} preload unoptimized /></IconButton></Link></span>)}
            <span className={styles.cartButton}><IconButton className={styles.actionButton} label={`Abrir carrinho${hydrated ? ` com ${itemCount} item(ns)` : ""}`} onClick={openCart}><Image className={styles.headerAssetIcon} src={shoppingBagIcon} alt="" width={22} height={22} preload unoptimized /></IconButton>{hydrated && itemCount > 0 && <span className={styles.count} aria-hidden="true">{itemCount}</span>}</span>
          </div>
        </div>
      </Container>
    </header>
    <FloatingCartBar onOpen={openCart} />
    {menuOpen && <MobileMenu
      open={menuOpen}
      onClose={closeMenu}
      onAccount={showAccountInfo}
      onDelivery={showDeliveryInfo}
      categories={categories}
      store={store}
    />}
    {cartOpen && <CartDrawer open={cartOpen} onClose={closeCart} />}
    {futureInfo && <Modal open onClose={closeFutureInfo} title="Disponível em breve"><p>{futureInfo}</p></Modal>}
  </>;
}
