"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "@/app/admin.module.css";

function pageItems(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "end-gap", total];
  if (current >= total - 3) return [1, "start-gap", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "start-gap", current - 1, current, current + 1, "end-gap", total];
}

export function AdminPagination({ page, pageSize, total, onPageChange, itemLabel = "produto", itemLabelPlural = "produtos" }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const first = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const last = Math.min(currentPage * pageSize, total);

  if (total <= pageSize) {
    return <footer className={styles.pagination}><p>Mostrando <strong>{total}</strong> {total === 1 ? itemLabel : itemLabelPlural}</p></footer>;
  }

  return <footer className={styles.pagination}>
    <p>Mostrando <strong>{first}–{last}</strong> de <strong>{total}</strong> {itemLabelPlural}</p>
    <nav className={styles.paginationNav} aria-label={`Paginação de ${itemLabelPlural}`}>
      <button type="button" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} aria-label="Página anterior"><ChevronLeft size={17} /></button>
      {pageItems(currentPage, totalPages).map((item) => typeof item === "string"
        ? <span className={styles.paginationGap} key={item}>…</span>
        : <button type="button" key={item} className={item === currentPage ? styles.paginationActive : ""} aria-current={item === currentPage ? "page" : undefined} aria-label={`Página ${item}`} onClick={() => onPageChange(item)}>{item}</button>)}
      <button type="button" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} aria-label="Próxima página"><ChevronRight size={17} /></button>
    </nav>
  </footer>;
}
