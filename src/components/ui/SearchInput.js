"use client";

import { usePathname, useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import styles from "./ui.module.css";

export function SearchInput({ initialValue = "", suggestions = [], compact = false }) {
  const router = useRouter();
  const pathname = usePathname();
  const [value, setValue] = useState(initialValue);
  const [focused, setFocused] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    return () => window.clearTimeout(debounceRef.current);
  }, []);

  function updateValue(nextValue) {
    setValue(nextValue);
    window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      router.push(nextValue.trim() ? `/busca?q=${encodeURIComponent(nextValue.trim())}` : "/busca");
    }, 350);
  }

  function submit(event) {
    event.preventDefault();
    router.push(value.trim() ? `/busca?q=${encodeURIComponent(value.trim())}` : "/busca");
  }

  function openSuggestion(item) {
    window.clearTimeout(debounceRef.current);
    const params = new URLSearchParams(window.location.search);
    params.set("produto", item.slug);
    setFocused(false);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  const visibleSuggestions = value.trim().length >= 2
    ? suggestions.filter((item) => item.name.toLocaleLowerCase("pt-BR").includes(value.trim().toLocaleLowerCase("pt-BR"))).slice(0, 5)
    : [];

  return <form className={`${styles.searchWrap} ${compact ? styles.searchCompact : ""}`} role="search" onSubmit={submit} onFocus={() => setFocused(true)} onBlur={(event) => !event.currentTarget.contains(event.relatedTarget) && setFocused(false)}>
    <label className="sr-only" htmlFor={compact ? "header-search" : "page-search"}>Buscar no cardápio</label>
    <Search className={styles.searchIcon} size={19} aria-hidden="true" />
    <input
      id={compact ? "header-search" : "page-search"}
      className={`${styles.input} ${styles.searchInput}`}
      type="search"
      value={value}
      onChange={(event) => updateValue(event.target.value)}
      placeholder="Buscar pizzas..."
      autoComplete="off"
    />
    {value && <button className={styles.searchClear} type="button" aria-label="Limpar busca" onClick={() => { window.clearTimeout(debounceRef.current); setValue(""); router.push("/busca"); }}><X size={18} /></button>}
    {focused && visibleSuggestions.length > 0 && <ul className={styles.suggestions}>
      {visibleSuggestions.map((item) => <li key={item.slug}><button className={`${styles.suggestion} ${styles.suggestionButton}`} type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => openSuggestion(item)}>{item.name}</button></li>)}
    </ul>}
  </form>;
}
