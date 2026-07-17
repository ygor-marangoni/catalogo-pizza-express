"use client";

import { Drawer } from "@/components/ui/Drawer";
import { CartContents } from "./CartContents";

export function CartDrawer({ open, onClose }) {
  return <Drawer open={open} onClose={onClose} title="Seu carrinho"><CartContents onNavigate={onClose} /></Drawer>;
}
