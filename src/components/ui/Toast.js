"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import styles from "./ui.module.css";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const notify = useCallback((message) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((items) => [...items, { id, message }]);
    window.setTimeout(() => setToasts((items) => items.filter((item) => item.id !== id)), 2600);
  }, []);
  const value = useMemo(() => ({ notify }), [notify]);
  return <ToastContext.Provider value={value}>
    {children}
    <div className={styles.toastRegion} aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => <div className={styles.toast} key={toast.id}>
        <span className={styles.toastIcon} aria-hidden="true"><CheckCircle2 size={19} strokeWidth={2.2} /></span>
        <span className={styles.toastMessage}>{toast.message}</span>
      </div>)}
    </div>
  </ToastContext.Provider>;
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast deve ser usado dentro de ToastProvider");
  return context;
}
