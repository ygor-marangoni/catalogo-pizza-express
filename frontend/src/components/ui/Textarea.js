import styles from "./ui.module.css";

export function Textarea({ label, id, hint, ...props }) {
  return <label className={styles.field} htmlFor={id}>
    <span className={styles.label}>{label}</span>
    <textarea id={id} className={styles.textarea} aria-describedby={hint ? `${id}-hint` : undefined} {...props} />
    {hint && <small id={`${id}-hint`}>{hint}</small>}
  </label>;
}
