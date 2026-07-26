import { Clock3 } from "lucide-react";
import styles from "@/app/(storefront)/storefront.module.css";

export function TodayStoreInfo({ openingHours, storeIsOpen }) {
  const status = storeIsOpen === true ? "open" : storeIsOpen === false ? "closed" : "unknown";
  const statusLabel = status === "open" ? "Aberto" : status === "closed" ? "Fechado" : "Não informado";

  return <div className={styles.heroInfo} aria-label="Informações da loja">
    <p className={styles.heroHours}>
      <Clock3 size={15} strokeWidth={1.8} aria-hidden="true" />
      <span>{openingHours || "Horário não informado"}</span>
      <strong className={`${styles.heroStatus} ${styles[status]}`}>{statusLabel}</strong>
    </p>
  </div>;
}
