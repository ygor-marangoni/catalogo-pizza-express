import { formatCurrency } from "@/lib/currency";
import styles from "./ui.module.css";

export function Price({ value, compareAt, prefix, className = "", currentColor }) {
  return <span className={`${styles.price} ${className}`.trim()}>
    {prefix && <small>{prefix}</small>}
    <span className={styles.priceCurrent} style={currentColor ? { color: currentColor } : undefined}>{formatCurrency(value)}</span>
    {compareAt > value && <span className={styles.priceOld}>{formatCurrency(compareAt)}</span>}
  </span>;
}
