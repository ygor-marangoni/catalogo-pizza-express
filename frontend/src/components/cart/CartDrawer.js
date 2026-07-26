"use client";

import { useState } from "react";
import { Drawer } from "@/components/ui/Drawer";
import { CartContents } from "./CartContents";

export function CartDrawer({ open, onClose }) {
  const [checkout, setCheckout] = useState(false);
  function close() {
    setCheckout(false);
    onClose();
  }
  return <Drawer open={open} onClose={close} title={checkout ? "Finalizando compra" : "Seu carrinho"}><CartContents onNavigate={close} onCheckoutChange={setCheckout} /></Drawer>;
}
