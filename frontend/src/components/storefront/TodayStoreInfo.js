"use client";

import { Clock3 } from "lucide-react";
import styles from "@/app/(storefront)/storefront.module.css";

export function TodayStoreInfo({ isOpen, openingHours }) {
  const visibleStatus = isOpen ? "Aberto" : "Fechado";
  const statusLabel = isOpen ? "Loja aberta" : "Loja fechada";
  const hours = openingHours || "Horário não informado";
  return <div className={styles.heroInfo} aria-label="Informações da loja">
    <p className={styles.heroHours}>
      <Clock3 size={15} strokeWidth={1.8} aria-hidden="true" />
      <span className="sr-only">{statusLabel}. </span>
      <span>{hours}</span>
      <strong className={`${styles.heroStatus} ${isOpen ? styles.open : styles.closed}`}>{visibleStatus}</strong>
    </p>
  </div>;
}
