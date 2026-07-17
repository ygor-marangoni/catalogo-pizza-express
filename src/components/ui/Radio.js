import styles from "./ui.module.css";

export function Radio({ label, description, as: Tag = "label", ...props }) {
  return <Tag className={styles.choice}>
    <input type="radio" {...props} />
    <span><strong>{label}</strong>{description && <><br /><small>{description}</small></>}</span>
  </Tag>;
}
