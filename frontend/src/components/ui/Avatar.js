import styles from "./ui.module.css";

function getInitials(name = "Cliente") {
  const initials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");

  return initials.toUpperCase() || "C";
}

export function Avatar({ name, size = "medium", className = "" }) {
  const sizeClass = `avatar${size[0].toUpperCase()}${size.slice(1)}`;
  return <span className={`${styles.avatar} ${styles[sizeClass]} ${className}`.trim()} aria-hidden="true">{getInitials(name)}</span>;
}
