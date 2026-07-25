import styles from "./ui.module.css";

export function Select({ label, id, children, ...props }) {
  return <label className={styles.field} htmlFor={id}>
    {label && <span className={styles.label}>{label}</span>}
    <select id={id} className={styles.select} {...props}>{children}</select>
  </label>;
}
