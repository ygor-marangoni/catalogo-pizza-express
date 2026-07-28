"use client";

import { useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";
import styles from "@/app/admin.module.css";

export function AdminConfirmDialog({
  open,
  title = "Confirmar ação",
  description,
  confirmLabel = "Excluir",
  cancelLabel = "Cancelar",
  onConfirm,
  onCancel,
  loading = false,
}) {
  useEffect(() => {
    if (!open) return undefined;
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [open]);

  if (!open) return null;

  return <div className={styles.adminConfirmBackdrop} onMouseDown={(event) => event.target === event.currentTarget && !loading && onCancel?.()}>
    <section className={styles.adminConfirmDialog} role="alertdialog" aria-modal="true" aria-labelledby="admin-confirm-title" aria-describedby="admin-confirm-description">
      <button type="button" className={styles.adminConfirmClose} onClick={onCancel} disabled={loading} aria-label="Fechar"><X size={18} /></button>
      <span className={styles.adminConfirmIcon}><AlertTriangle size={22} /></span>
      <h2 id="admin-confirm-title">{title}</h2>
      {description && <p id="admin-confirm-description">{description}</p>}
      <footer className={styles.adminConfirmActions}>
        <button type="button" className={`${styles.button} ${styles.secondary}`} onClick={onCancel} disabled={loading}>{cancelLabel}</button>
        <button type="button" className={styles.adminConfirmDanger} onClick={onConfirm} disabled={loading}>{loading ? "Excluindo..." : confirmLabel}</button>
      </footer>
    </section>
  </div>;
}
