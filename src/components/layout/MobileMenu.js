"use client";

import Image from "next/image";
import Link from "next/link";
import { BadgePercent, Bike, CakeSlice, CirclePlus, CupSoda, House, MapPin, Pizza, Search, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import userIcon from "../../../assets/icons/user.webp";
import { useOverlay } from "@/hooks/useOverlay";
import styles from "./layout.module.css";

const CATEGORY_ICONS = {
  promocoes: BadgePercent,
  salgadas: Pizza,
  doces: CakeSlice,
  bebidas: CupSoda,
  adicionais: CirclePlus,
};

export function MobileMenu({ open, onClose, onAccount, onDelivery, categories, store }) {
  const [query, setQuery] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const panelRef = useOverlay(open, onClose);

  if (!open) return null;

  function submitSearch(event) {
    event.preventDefault();
    const value = query.trim();
    router.push(value ? `/busca?q=${encodeURIComponent(value)}` : "/busca");
    onClose();
  }

  return <div className={styles.mobileMenuOverlay} role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <aside ref={panelRef} tabIndex={-1} className={styles.mobileMenuPanel} role="dialog" aria-modal="true" aria-label="Menu principal">
      <header className={styles.mobileMenuHeader}>
        <div className={styles.mobileMenuBrand}>
          <Image src={store.logo} alt="" width={62} height={62} />
          <div><p>{store.name}</p><span>{store.description}</span></div>
        </div>
        <button type="button" className={styles.mobileMenuClose} aria-label="Fechar menu" onClick={onClose}><X size={28} /></button>
      </header>

      <form className={styles.mobileMenuSearch} role="search" onSubmit={submitSearch}>
        <label className="sr-only" htmlFor="mobile-menu-search">Buscar no cardápio</label>
        <Search size={20} aria-hidden="true" />
        <input id="mobile-menu-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar pizzas..." autoComplete="off" />
      </form>

      <nav className={styles.mobileMenuNav} aria-label="Navegação mobile">
        <Link className={pathname === "/" ? styles.mobileMenuActive : undefined} href="/" onClick={onClose} aria-current={pathname === "/" ? "page" : undefined}><span className={styles.mobileNavIcon}><House size={20} aria-hidden="true" /></span><span>Início</span></Link>
        {categories.map((category) => {
          const CategoryIcon = CATEGORY_ICONS[category.slug] || CirclePlus;
          const href = `/categoria/${category.slug}`;
          const isActive = pathname === href;
          return <Link className={isActive ? styles.mobileMenuActive : undefined} key={category.id} href={href} onClick={onClose} aria-current={isActive ? "page" : undefined}><span className={styles.mobileNavIcon}><CategoryIcon size={19} aria-hidden="true" /></span><span>{category.name}</span></Link>;
        })}
      </nav>

      <div className={styles.mobileContextCard} aria-label="Entrega e conta">
        <button className={styles.mobileDelivery} type="button" onClick={() => { onClose(); onDelivery(); }}>
          <span className={styles.mobileContextIcon}><Bike size={20} strokeWidth={1.8} aria-hidden="true" /></span>
          <span><strong>Entrega</strong><small>Escolher local de entrega</small></span>
        </button>

        <button className={styles.mobileAccount} type="button" onClick={() => { onClose(); onAccount(); }}>
          <span className={styles.mobileContextIcon}><Image className={styles.mobileAccountIcon} src={userIcon} alt="" width={19} height={19} /></span>
          <strong>Minha conta</strong>
        </button>
        <address className={styles.mobileLocation}><MapPin size={17} strokeWidth={1.8} aria-hidden="true" /><span>{store.address}</span></address>
      </div>
    </aside>
  </div>;
}
