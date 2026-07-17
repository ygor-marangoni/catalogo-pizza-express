"use client";

import { X } from "lucide-react";
import { useOverlay } from "@/hooks/useOverlay";
import { IconButton } from "./IconButton";
import styles from "./ui.module.css";

export function Drawer({ open, onClose, title, children }) {
  const panelRef = useOverlay(open, onClose);
  if (!open) return null;
  return <div className={`${styles.overlay} ${styles.drawerOverlay}`} role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <aside ref={panelRef} tabIndex={-1} className={styles.drawer} role="dialog" aria-modal="true" aria-label={title}>
      <header className={styles.overlayHeader}><h2>{title}</h2><IconButton label="Fechar carrinho" onClick={onClose}><X size={20} /></IconButton></header>
      {children}
    </aside>
  </div>;
}
