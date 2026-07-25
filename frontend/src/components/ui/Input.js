import styles from "./ui.module.css";

export function Input({ label, id, error, className = "", ...props }) {
  return <label className={`${styles.field} ${className}`.trim()} htmlFor={id}>
    {label && <span className={styles.label}>{label}</span>}
    <input id={id} className={styles.input} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} {...props} />
    {error && <span id={`${id}-error`} role="alert">{error}</span>}
  </label>;
}
