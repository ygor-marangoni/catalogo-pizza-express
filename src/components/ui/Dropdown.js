"use client";

import { useState } from "react";
import styles from "./ui.module.css";

export function Dropdown({ trigger, label, children }) {
  const [open, setOpen] = useState(false);
  return <div className={styles.dropdown} onBlur={(event) => !event.currentTarget.contains(event.relatedTarget) && setOpen(false)}>
    <span onClick={() => setOpen((value) => !value)}>{trigger}</span>
    {open && <div className={styles.dropdownPanel} role="menu" aria-label={label}>{children}</div>}
  </div>;
}
