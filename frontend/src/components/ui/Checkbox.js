import styles from "./ui.module.css";

export function Checkbox({ label, description, as: Tag = "label", ...props }) {
  return <Tag className={styles.choice}>
    <input type="checkbox" {...props} />
    <span><strong>{label}</strong>{description && <><br /><small>{description}</small></>}</span>
  </Tag>;
}
