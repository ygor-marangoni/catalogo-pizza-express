import { formatCurrency } from "@/lib/currency";
import styles from "./ui.module.css";

export function Price({ value, compareAt, prefix, className = "" }) {
  return <span className={`${styles.price} ${className}`.trim()}>
    {prefix && <small>{prefix}</small>}
    <span className={styles.priceCurrent}>{formatCurrency(value)}</span>
    {compareAt > value && <span className={styles.priceOld}>{formatCurrency(compareAt)}</span>}
  </span>;
}
