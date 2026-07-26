"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowLeft, Bike, Store } from "lucide-react";
import whatsappIcon from "../../../assets/icons/whatsapp.svg";
import { Price } from "@/components/ui/Price";
import { buildWhatsAppOrderUrl, calculateOrderTotal } from "@/features/cart/whatsapp-order";
import { couponsApi } from "@/features/admin-catalog/coupons-api";
import styles from "./cart.module.css";

function formatPhoneInput(value) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function CheckoutForm({ items, subtotalInCents, store, page, onBack, onComplete }) {
  const [fulfillment, setFulfillment] = useState("delivery");
  const [payment, setPayment] = useState("Pix");
  const [error, setError] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [coupon, setCoupon] = useState(null);
  const [couponMessage, setCouponMessage] = useState("");
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const deliveryFee = store?.deliveryFeeInCents || 0;
  const total = calculateOrderTotal(subtotalInCents, fulfillment, deliveryFee, coupon?.discount_in_cents || 0);

  async function applyCoupon() {
    if (!couponCode.trim() || validatingCoupon) return;
    setValidatingCoupon(true);
    setCouponMessage("");
    try {
      const validated = await couponsApi.validate(couponCode.trim(), subtotalInCents);
      setCoupon(validated);
      setCouponCode(validated.code);
      setCouponMessage("Cupom aplicado com sucesso.");
    } catch (couponError) {
      setCoupon(null);
      setCouponMessage(couponError.message);
    } finally { setValidatingCoupon(false); }
  }

  function submit(event) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const customer = {
      name: String(form.get("name") || "").trim(),
      phone: String(form.get("phone") || "").trim(),
      fulfillment,
      address: String(form.get("address") || "").trim(),
      payment,
      change: payment === "Dinheiro" ? String(form.get("change") || "").trim() : "",
      notes: String(form.get("notes") || "").trim(),
    };
    if (fulfillment === "delivery" && !customer.address) {
      setError("Informe o endereço completo para entrega.");
      return;
    }
    try {
      const url = buildWhatsAppOrderUrl(store?.contact?.whatsapp, {
        storeName: store?.name, customer, items, subtotalInCents, deliveryFeeInCents: deliveryFee, coupon,
      });
      window.open(url, "_blank", "noopener,noreferrer");
      onComplete?.();
    } catch (submitError) {
      setError(submitError.message);
    }
  }

  return <div className={`${styles.checkout} ${page ? styles.checkoutPage : ""}`}>
    <header className={styles.checkoutHeader}>
      <button type="button" onClick={onBack}><ArrowLeft size={18} /><span>Voltar ao carrinho</span></button>
      <h2>Como você deseja receber?</h2>
      <p>Preencha seus dados para enviar o pedido à loja pelo WhatsApp.</p>
    </header>
    <form className={styles.checkoutForm} onSubmit={submit}>
      <fieldset className={styles.deliveryOptions}>
        <label className={fulfillment === "delivery" ? styles.optionSelected : ""}><input type="radio" name="fulfillment" value="delivery" checked={fulfillment === "delivery"} onChange={() => setFulfillment("delivery")} /><Bike size={16} strokeWidth={1.8} aria-hidden="true" /><strong>Entrega</strong><small>Receber no endereço informado</small></label>
        <label className={fulfillment === "pickup" ? styles.optionSelected : ""}><input type="radio" name="fulfillment" value="pickup" checked={fulfillment === "pickup"} onChange={() => setFulfillment("pickup")} /><Store size={16} strokeWidth={1.8} aria-hidden="true" /><strong>Retirada</strong><small>Buscar diretamente na loja</small></label>
      </fieldset>
      <section className={styles.checkoutSection}>
        <h3>Seus dados</h3>
        <label className={styles.checkoutField}>Nome completo<input name="name" autoComplete="name" required placeholder="Como podemos chamar você?" /></label>
        <label className={styles.checkoutField}>Telefone<input name="phone" type="tel" autoComplete="tel" inputMode="numeric" required minLength={15} placeholder="(00) 00000-0000" onChange={(event) => { event.target.value = formatPhoneInput(event.target.value); }} /></label>
        {fulfillment === "delivery" && <label className={`${styles.checkoutField} ${styles.checkoutDynamic}`}>Endereço completo<textarea name="address" required placeholder="Rua, número, bairro e complemento" /></label>}
      </section>
      <section className={styles.checkoutSection}>
        <h3>Pagamento</h3>
        <div className={styles.paymentOptions}>
          {["Pix", "Cartão", "Dinheiro"].map((method) => <label className={payment === method ? styles.paymentSelected : ""} key={method}><input type="radio" name="payment" value={method} checked={payment === method} onChange={() => setPayment(method)} /><span>{method}</span></label>)}
        </div>
        {payment === "Dinheiro" && <label className={`${styles.checkoutField} ${styles.checkoutDynamic}`}>Troco para<input name="change" inputMode="decimal" placeholder="Ex: R$ 100,00" /></label>}
        <label className={styles.checkoutField}>Observações gerais<textarea name="notes" maxLength={300} placeholder="Alguma orientação para a loja?" /></label>
      </section>
      <section className={styles.checkoutSection}>
        <h3>Cupom de desconto</h3>
        <div className={styles.couponInput}>
          <input aria-label="Código do cupom" value={couponCode} onChange={(event) => { setCouponCode(event.target.value.toUpperCase()); setCoupon(null); setCouponMessage(""); }} placeholder="Digite o código" />
          <button type="button" onClick={applyCoupon} disabled={!couponCode.trim() || validatingCoupon}>{validatingCoupon ? "Validando…" : "Aplicar"}</button>
        </div>
        {couponMessage && <p className={`${coupon ? styles.couponSuccess : styles.couponError} ${styles.checkoutDynamic}`} role="status">{couponMessage}</p>}
      </section>
      {error && <p className={styles.checkoutError} role="alert">{error}</p>}
      <footer className={styles.checkoutSummary}>
        <div><span>Subtotal</span><Price value={subtotalInCents} /></div>
        {fulfillment === "delivery" && <div className={styles.checkoutDynamic}><span>Taxa de entrega</span><Price value={deliveryFee} /></div>}
        {coupon && <div className={`${styles.couponDiscount} ${styles.checkoutDynamic}`}><span>Cupom {coupon.code}</span><span>- <Price value={coupon.discount_in_cents} /></span></div>}
        <div className={styles.checkoutTotal}><strong>Total estimado</strong><Price value={total} /></div>
        <button type="submit"><Image src={whatsappIcon} alt="" width={19} height={19} /><span>Enviar pedido pelo WhatsApp</span></button>
      </footer>
    </form>
  </div>;
}
