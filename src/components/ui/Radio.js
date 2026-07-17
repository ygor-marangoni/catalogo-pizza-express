import styles from "./ui.module.css";

export function Radio({ label, description, ...props }) {
  return <label className={styles.choice}>
    <input type="radio" {...props} />
    <span><strong>{label}</strong>{description && <><br /><small>{description}</small></>}</span>
  </label>;
}
