"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import styles from "@/app/admin.module.css";

export function AdminSelect({ label, value, options, icon: Icon, onChange }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const listId = useId();
  const selectedIndex = Math.max(0, options.findIndex((option) => option.value === value));
  const selected = options[selectedIndex] || options[0];

  useEffect(() => {
    function close(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    }
    function escape(event) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", escape);
    };
  }, []);

  function choose(option) {
    onChange(option.value);
    setOpen(false);
  }

  function handleKeyDown(event) {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    let nextIndex = selectedIndex;
    if (event.key === "ArrowDown") nextIndex = (selectedIndex + 1) % options.length;
    if (event.key === "ArrowUp") nextIndex = (selectedIndex - 1 + options.length) % options.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = options.length - 1;
    onChange(options[nextIndex].value);
    setOpen(true);
  }

  return <div className={styles.customSelect} ref={rootRef}>
    <span className={styles.srOnly}>{label}</span>
    <button
      type="button"
      className={open ? styles.customSelectOpen : ""}
      aria-label={label}
      aria-haspopup="listbox"
      aria-expanded={open}
      aria-controls={listId}
      onClick={() => setOpen((current) => !current)}
      onKeyDown={handleKeyDown}
    >
      {Icon && <Icon size={18} />}
      <span>{selected.label}</span>
      <ChevronDown className={styles.selectChevron} size={16} />
    </button>
    {open && <div className={styles.selectMenu} id={listId} role="listbox" aria-label={label}>
      {options.map((option) => <button
        type="button"
        role="option"
        aria-selected={option.value === value}
        className={option.value === value ? styles.selectOptionActive : ""}
        key={option.value}
        onClick={() => choose(option)}
      >
        <span>{option.label}</span>
        {option.value === value && <Check size={16} />}
      </button>)}
    </div>}
  </div>;
}
