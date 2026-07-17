"use client";

import { useEffect, useRef } from "react";

export function useOverlay(open, onClose) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const previousFocus = document.activeElement;
    const previousLock = document.body.dataset.scrollLock;
    const previousDocumentStyles = {
      overflow: document.documentElement.style.overflow,
      overscrollBehavior: document.documentElement.style.overscrollBehavior,
    };
    const previousBodyStyles = {
      overflow: document.body.style.overflow,
      overscrollBehavior: document.body.style.overscrollBehavior,
    };
    document.body.dataset.scrollLock = "true";
    Object.assign(document.documentElement.style, {
      overflow: "hidden",
      overscrollBehavior: "none",
    });
    Object.assign(document.body.style, {
      overflow: "hidden",
      overscrollBehavior: "none",
    });
    panelRef.current?.focus();

    function onKeyDown(event) {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = [...panelRef.current.querySelectorAll("a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])")];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      Object.assign(document.documentElement.style, previousDocumentStyles);
      Object.assign(document.body.style, previousBodyStyles);
      if (previousLock) document.body.dataset.scrollLock = previousLock;
      else delete document.body.dataset.scrollLock;
      previousFocus?.focus?.({ preventScroll: true });
    };
  }, [open, onClose]);

  return panelRef;
}
