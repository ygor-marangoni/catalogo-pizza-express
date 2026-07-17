import styles from "./ui.module.css";

export function Badge({ children, tone = "default" }) {
  return <span className={`${styles.badge} ${styles[tone] || ""}`}>{children}</span>;
}
