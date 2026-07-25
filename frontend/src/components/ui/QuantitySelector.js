"use client";

import { Minus, Plus } from "lucide-react";
import styles from "./ui.module.css";

export function QuantitySelector({ value, onChange, min = 1, max = 99, label = "Quantidade" }) {
  return <div className={styles.quantity} aria-label={label}>
    <button type="button" onClick={() => onChange(value - 1)} disabled={value <= min} aria-label="Diminuir quantidade"><Minus size={17} /></button>
    <output aria-live="polite">{value}</output>
    <button type="button" onClick={() => onChange(value + 1)} disabled={value >= max} aria-label="Aumentar quantidade"><Plus size={17} /></button>
  </div>;
}
