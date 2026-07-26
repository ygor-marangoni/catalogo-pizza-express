"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Bike, Equal, MapPin, TicketPercent } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import shoppingBagIcon from "../../../assets/icons/shopping-bag.webp";
import userIcon from "../../../assets/icons/user.webp";
import { useCart } from "@/contexts/CartContext";
import { FloatingCartBar } from "@/components/cart/FloatingCartBar";
import { IconButton } from "@/components/ui/IconButton";
import { SearchInput } from "@/components/ui/SearchInput";
import { Tooltip } from "@/components/ui/Tooltip";
import { Container } from "@/components/ui/Container";
import { formatCurrency } from "@/lib/currency";
import { getPublicCoupons } from "@/features/promotions/public-coupons-api";
import styles from "./layout.module.css";

const CartDrawer = dynamic(() => import("@/components/cart/CartDrawer").then((module) => module.CartDrawer), { ssr: false });
const Modal = dynamic(() => import("@/components/ui/Modal").then((module) => module.Modal), { ssr: false });
const MobileMenu = dynamic(() => import("./MobileMenu").then((module) => module.MobileMenu), { ssr: false });

export function Header({ store, suggestions, categories }) {
  const mountedRef = useRef(false);
  const couponRequestRef = useRef(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [futureInfo, setFutureInfo] = useState(null);
  const [infoModal, setInfoModal] = useState(null);
  const [coupons, setCoupons] = useState([]);
  const [couponsLoading, setCouponsLoading] = useState(false);
  const [couponsError, setCouponsError] = useState("");
  const { itemCount, hydrated, cartOpen, openCart, closeCart } = useCart();
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      couponRequestRef.current += 1;
    };
  }, []);
  const openMenu = useCallback(() => setMenuOpen(true), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const closeFutureInfo = useCallback(() => setFutureInfo(null), []);
  const closeInfoModal = useCallback(() => setInfoModal(null), []);
  const showDeliveryInfo = useCallback(() => {
    setMenuOpen(false);
    setInfoModal("delivery");
  }, []);
  const showCouponInfo = useCallback(async () => {
    if (!mountedRef.current) return;
    const requestId = couponRequestRef.current + 1;
    couponRequestRef.current = requestId;
    setInfoModal("coupons");
    setCouponsLoading(true);
    setCouponsError("");
    try {
      const items = await getPublicCoupons();
      if (mountedRef.current && couponRequestRef.current === requestId) setCoupons(items);
    } catch {
      if (mountedRef.current && couponRequestRef.current === requestId)
        setCouponsError("Não foi possível carregar os cupons agora. Tente novamente em instantes.");
    } finally {
      if (mountedRef.current && couponRequestRef.current === requestId) setCouponsLoading(false);
    }
  }, []);
  const showAccountInfo = useCallback(() => setFutureInfo("A conta do cliente será disponibilizada em uma próxima entrega."), []);
  return <>
    <header className={styles.header}>
      <Container className={styles.headerInner}>
        <IconButton className={styles.mobileMenuButton} label="Abrir menu" onClick={openMenu}><Equal size={29} strokeWidth={2.25} /></IconButton>
        <nav className={styles.nav} aria-label="Ações rápidas">
          <button className={styles.utility} type="button" onClick={showDeliveryInfo}><MapPin size={18} />Entrega</button>
          <button className={`${styles.utility} ${styles.coupon}`} type="button" onClick={showCouponInfo}><TicketPercent size={18} />Cupons</button>
        </nav>
        <Link href="/" className={styles.brand} aria-label={`${store.name} | início`}><Image src={store.logo} alt="Logo oficial da Pizza Express" width={104} height={104} loading="eager" /></Link>
        <div className={styles.rightGroup}>
          <div className={styles.search}><SearchInput compact suggestions={suggestions} /></div>
          <div className={styles.actions}>
            <span className={styles.desktopAccount}><Tooltip content="Conta disponível em uma próxima etapa"><IconButton className={`${styles.actionButton} ${styles.accountButton}`} label="Conta | disponível em breve" disabled><Image className={styles.headerAssetIcon} src={userIcon} alt="" width={22} height={22} preload unoptimized /></IconButton></Tooltip></span>
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
    {infoModal === "delivery" && <Modal open onClose={closeInfoModal} title="Entrega em Monte Carmelo">
      <div className={styles.deliveryModalContent}>
        <span className={styles.infoModalIcon}><Bike size={25} /></span>
        <div className={styles.infoModalIntro}>
          <h3>Entregamos em toda a cidade</h3>
          <p>Receba seu pedido em qualquer bairro de Monte Carmelo–MG.</p>
        </div>
        <div className={styles.deliveryDetails}>
          <div><span>Taxa de entrega</span><strong>{formatCurrency(store.deliveryFeeInCents ?? 700)}</strong></div>
          <div><span>Área atendida</span><strong>Todo o município</strong></div>
        </div>
        <p className={styles.infoModalNote}><MapPin size={16} />Informe o endereço completo durante a finalização do pedido.</p>
      </div>
    </Modal>}
    {infoModal === "coupons" && <Modal open onClose={closeInfoModal} title="Cupons disponíveis">
      <div className={styles.couponsModalContent}>
        <div className={styles.infoModalIntro}>
          <h3>Economize no seu próximo pedido</h3>
          <p>Use um dos códigos abaixo na finalização da compra.</p>
        </div>
        {couponsLoading && <div className={styles.couponModalState}>Carregando cupons…</div>}
        {!couponsLoading && couponsError && <div className={`${styles.couponModalState} ${styles.couponModalError}`}>{couponsError}</div>}
        {!couponsLoading && !couponsError && coupons.length === 0 && <div className={styles.couponModalState}>Nenhum cupom disponível no momento.</div>}
        {!couponsLoading && !couponsError && coupons.length > 0 && <div className={styles.publicCouponList}>
          {coupons.map((coupon) => <article className={styles.publicCoupon} key={coupon.code}>
            <span className={styles.publicCouponIcon}><TicketPercent size={20} /></span>
            <div className={styles.publicCouponInfo}>
              <strong>{coupon.code}</strong>
              {coupon.description && <small>{coupon.description}</small>}
              {coupon.min_order_value > 0 && <small>Pedido mínimo de {formatCurrency(coupon.min_order_value)}</small>}
            </div>
            <div className={styles.publicCouponValue}>
              <strong>{coupon.discount_type === "PERCENTAGE" ? `${coupon.discount_value}%` : formatCurrency(coupon.discount_value)}</strong>
              <span>de desconto</span>
            </div>
          </article>)}
        </div>}
      </div>
    </Modal>}
    {futureInfo && <Modal open onClose={closeFutureInfo} title="Disponível em breve"><p>{futureInfo}</p></Modal>}
  </>;
}
