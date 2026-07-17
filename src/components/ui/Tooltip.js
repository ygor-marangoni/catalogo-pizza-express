import styles from "./ui.module.css";

export function Tooltip({ content, children }) {
  return <span className={styles.tooltip}>{children}<span role="tooltip" className={styles.tooltipText}>{content}</span></span>;
}
