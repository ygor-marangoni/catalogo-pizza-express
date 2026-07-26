"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Bike, Equal, LayoutDashboard, LogIn, MapPin, TicketPercent, UserPlus } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import shoppingBagIcon from "../../../assets/icons/shopping-bag.webp";
import userIcon from "../../../assets/icons/user.webp";
import { useCart } from "@/contexts/CartContext";
import { useCustomerAuth } from "@/contexts/CustomerAuthContext";
import { FloatingCartBar } from "@/components/cart/FloatingCartBar";
import { Avatar } from "@/components/ui/Avatar";
import { IconButton } from "@/components/ui/IconButton";
import { SearchInput } from "@/components/ui/SearchInput";
import { Container } from "@/components/ui/Container";
import { formatCurrency } from "@/lib/currency";
import { getPublicCoupons } from "@/features/promotions/public-coupons-api";
import styles from "./layout.module.css";

const CartDrawer = dynamic(() => import("@/components/cart/CartDrawer").then((module) => module.CartDrawer), { ssr: false });
const Modal = dynamic(() => import("@/components/ui/Modal").then((module) => module.Modal), { ssr: false });
const MobileMenu = dynamic(() => import("./MobileMenu").then((module) => module.MobileMenu), { ssr: false });

export function Header({ store, suggestions, categories }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const mountedRef = useRef(false);
  const couponRequestRef = useRef(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [futureInfo, setFutureInfo] = useState(null);
  const [infoModal, setInfoModal] = useState(null);
  const [coupons, setCoupons] = useState([]);
  const [couponsLoading, setCouponsLoading] = useState(false);
  const [couponsError, setCouponsError] = useState("");
  const [authMounted, setAuthMounted] = useState(false);
  const { itemCount, hydrated, cartOpen, openCart, closeCart } = useCart();
  const { account, role, loading: authLoading } = useCustomerAuth();
  useEffect(() => {
    mountedRef.current = true;
    const authTimer = window.setTimeout(() => setAuthMounted(true), 0);
    return () => {
      window.clearTimeout(authTimer);
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
    if (authLoading) return;
    if (!account) {
      setInfoModal("coupon-auth");
      return;
    }
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
  }, [account, authLoading]);
  const showAccountInfo = useCallback(() => router.push(account ? "/conta" : `/login?next=${encodeURIComponent(pathname)}`), [account, pathname, router]);

  useEffect(() => {
    if (!account || searchParams.get("cupons") !== "1" || infoModal === "coupons") return;
    const timer = window.setTimeout(() => {
      showCouponInfo();
      const params = new URLSearchParams(searchParams.toString());
      params.delete("cupons");
      router.replace(`${pathname}${params.size ? `?${params}` : ""}`, { scroll: false });
    }, 0);
    return () => window.clearTimeout(timer);
  }, [account, infoModal, pathname, router, searchParams, showCouponInfo]);
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
            <span className={styles.desktopAccount}>
              {authMounted && !authLoading && (role === "ADMIN"
                ? <Link href="/admin" aria-label="Abrir dashboard administrativo"><IconButton className={styles.actionButton} label="Dashboard administrativo"><LayoutDashboard size={21} /></IconButton></Link>
                : account
                ? <Link className={styles.accountAvatarLink} href="/conta" aria-label={`Abrir minha conta, ${account.name}`}><Avatar name={account.name} size="small" /></Link>
                : <Link href={`/login?next=${encodeURIComponent(pathname)}`} aria-label="Entrar na conta"><IconButton className={`${styles.actionButton} ${styles.accountButton}`} label="Entrar na conta"><Image className={styles.headerAssetIcon} src={userIcon} alt="" width={22} height={22} preload unoptimized /></IconButton></Link>)}
            </span>
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
          <div><span>Taxa de entrega</span><strong>{formatCurrency(store.deliveryFeeInCents ?? 0)}</strong></div>
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
    {infoModal === "coupon-auth" && <Modal open onClose={closeInfoModal} title="Cupons disponíveis">
      <div className={styles.couponAuthContent}>
        <span className={styles.couponAuthIcon}><TicketPercent size={25} /></span>
        <div className={styles.couponAuthCopy}>
          <h3>Crie sua conta para ver os cupons</h3>
          <p>Cadastre-se gratuitamente e aproveite os descontos disponíveis no seu próximo pedido.</p>
        </div>
        <div className={styles.couponAuthActions}>
          <Link className={styles.couponAuthPrimary} href="/cadastro">
            <UserPlus size={17} />
            Criar minha conta
          </Link>
          <Link
            className={styles.couponAuthSecondary}
            href={`/login?next=${encodeURIComponent(`${pathname}?cupons=1`)}`}
          >
            <LogIn size={17} />
            Já tenho uma conta
          </Link>
        </div>
      </div>
    </Modal>}
    {futureInfo && <Modal open onClose={closeFutureInfo} title="Disponível em breve"><p>{futureInfo}</p></Modal>}
  </>;
}
