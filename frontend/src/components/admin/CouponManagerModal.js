"use client";

import { useEffect, useState } from "react";
import { Pencil, TicketPercent, Trash2, X } from "lucide-react";
import { couponsApi } from "@/features/admin-catalog/coupons-api";
import { AdminConfirmDialog } from "./AdminConfirmDialog";
import { centsToInput, formatCurrency, reaisToCents } from "@/lib/currency";
import styles from "@/app/admin.module.css";

export function CouponManagerModal({ open, onClose }) {
  const [coupons, setCoupons] = useState([]);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [couponToRemove, setCouponToRemove] = useState(null);

  async function load() {
    try { setCoupons(await couponsApi.list()); }
    catch (error) { setMessage(error.message); }
  }

  useEffect(() => {
    if (!open) return;
    let active = true;
    couponsApi.list().then((items) => { if (active) setCoupons(items); })
      .catch((error) => { if (active) setMessage(error.message); });
    return () => { active = false; };
  }, [open]);

  if (!open) return null;

  async function submit(event) {
    event.preventDefault();
    if (saving) return;
    const formElement = event.currentTarget;
    const form = new FormData(event.currentTarget);
    const code = String(form.get("code") || "").trim().toUpperCase();
    const type = form.get("discount_type");
    const expiration = form.get("expires_at");
    const rawDiscount = String(form.get("discount_value") || "").trim();
    const discountValue = type === "PERCENTAGE" ? Number(rawDiscount.replace(",", ".")) : reaisToCents(rawDiscount);
    const minOrderValue = reaisToCents(form.get("min_order_value") || "0");

    if (code.length < 2) {
      setMessage("Informe um código com pelo menos 2 caracteres.");
      formElement.elements.code.focus();
      return;
    }
    if (code.length > 40) {
      setMessage("O código do cupom deve ter no máximo 40 caracteres.");
      formElement.elements.code.focus();
      return;
    }
    if (!Number.isInteger(discountValue) || discountValue <= 0) {
      setMessage(type === "PERCENTAGE"
        ? "Informe um percentual de desconto inteiro e maior que zero."
        : "Informe um valor de desconto válido e maior que zero.");
      formElement.elements.discount_value.focus();
      return;
    }
    if (type === "PERCENTAGE" && discountValue > 100) {
      setMessage("O desconto percentual não pode ser maior que 100%.");
      formElement.elements.discount_value.focus();
      return;
    }
    if (!Number.isInteger(minOrderValue) || minOrderValue < 0) {
      setMessage("Informe um valor válido para o pedido mínimo.");
      formElement.elements.min_order_value.focus();
      return;
    }
    if (expiration && new Date(expiration).getTime() <= Date.now()) {
      setMessage("A validade do cupom deve ser uma data futura.");
      formElement.elements.expires_at.focus();
      return;
    }

    setSaving(true);
    setMessage("");
    const body = {
      code,
      description: form.get("description") || null,
      discount_type: type,
      discount_value: discountValue,
      min_order_value: minOrderValue,
      active: form.get("active") === "on",
      expires_at: expiration ? new Date(expiration).toISOString() : null,
    };
    try {
      if (editing) await couponsApi.update(editing.id, body);
      else await couponsApi.create(body);
      setEditing(null);
      formElement.reset();
      setMessage("Cupom salvo com sucesso.");
      await load();
    } catch (error) { setMessage(error.message); }
    finally { setSaving(false); }
  }

  async function remove(coupon = couponToRemove) {
    if (!coupon) return;
    try { await couponsApi.remove(coupon.id); setMessage("Cupom excluído."); await load(); }
    catch (error) { setMessage(error.message); }
    finally { setCouponToRemove(null); }
  }

  return <div className={styles.adminModalBackdrop} onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <section className={styles.adminModal} role="dialog" aria-modal="true" aria-labelledby="coupon-modal-title">
      <header className={styles.adminModalHeader}>
        <div><span className={styles.eyebrow}>Promoções</span><h2 id="coupon-modal-title">Gerenciar cupons</h2><p>Crie códigos de desconto para o cardápio.</p></div>
        <button type="button" className={styles.iconButton} onClick={onClose} aria-label="Fechar"><X size={19} /></button>
      </header>
      <div className={styles.couponModalBody}>
        <form className={styles.couponForm} onSubmit={submit} key={editing?.id || "new"} noValidate>
          <h3>{editing ? `Editar ${editing.code}` : "Novo cupom"}</h3>
          <div className={styles.formGrid}>
            <label className={styles.field}>Código<input name="code" required minLength={2} maxLength={40} autoCapitalize="characters" defaultValue={editing?.code || ""} placeholder="EX: PIZZA10" /></label>
            <label className={styles.field}>Tipo<select name="discount_type" defaultValue={editing?.discount_type || "PERCENTAGE"}><option value="PERCENTAGE">Percentual</option><option value="FIXED">Valor fixo</option></select></label>
            <label className={styles.field}>Valor do desconto<input name="discount_value" required inputMode="decimal" defaultValue={editing ? (editing.discount_type === "PERCENTAGE" ? editing.discount_value : centsToInput(editing.discount_value)) : ""} placeholder="10" /></label>
            <label className={styles.field}>Pedido mínimo (R$)<input name="min_order_value" inputMode="decimal" defaultValue={centsToInput(editing?.min_order_value || 0)} placeholder="0,00" /></label>
            <label className={`${styles.field} ${styles.wide}`}>Descrição<input name="description" maxLength={240} defaultValue={editing?.description || ""} placeholder="Descrição interna opcional" /></label>
            <label className={`${styles.field} ${styles.wide}`}>Validade<input name="expires_at" type="datetime-local" defaultValue={editing?.expires_at ? new Date(editing.expires_at).toISOString().slice(0, 16) : ""} /></label>
          </div>
          <label className={styles.checkbox}><input name="active" type="checkbox" defaultChecked={editing?.active ?? true} /><span>Cupom ativo</span></label>
          <div className={styles.formActions}>
            {editing && <button type="button" className={`${styles.button} ${styles.secondary}`} onClick={() => setEditing(null)}>Cancelar</button>}
            <button className={styles.button} disabled={saving}>{saving ? "Salvando…" : "Salvar cupom"}</button>
          </div>
        </form>
        <div className={styles.couponList}>
          <div className={styles.couponListHeader}><h3>Cupons cadastrados</h3><span>{coupons.length} registros</span></div>
          {coupons.length === 0 ? <p className={styles.empty}>Nenhum cupom cadastrado.</p> : coupons.map((coupon) => <article className={styles.couponRow} key={coupon.id}>
            <span className={styles.couponIcon}><TicketPercent size={19} /></span>
            <div><strong>{coupon.code}</strong><small>{coupon.discount_type === "PERCENTAGE" ? `${coupon.discount_value}% de desconto` : `${formatCurrency(coupon.discount_value)} de desconto`}</small></div>
            <span className={coupon.active ? styles.couponActive : styles.couponInactive}>{coupon.active ? "Ativo" : "Inativo"}</span>
            <div className={styles.actions}><button className={styles.iconButton} type="button" onClick={() => setEditing(coupon)} aria-label={`Editar ${coupon.code}`}><Pencil size={16} /></button><button className={`${styles.iconButton} ${styles.danger}`} type="button" onClick={() => setCouponToRemove(coupon)} aria-label={`Excluir ${coupon.code}`}><Trash2 size={16} /></button></div>
          </article>)}
        </div>
      </div>
      {message && <p
        className={`${styles.modalMessage} ${message === "Cupom salvo com sucesso." || message === "Cupom excluído." ? styles.modalMessageSuccess : ""}`}
        role="status"
      >{message}</p>}
    </section>
    <AdminConfirmDialog open={Boolean(couponToRemove)} title="Excluir cupom?" description={couponToRemove ? `O cupom “${couponToRemove.code}” deixará de poder ser utilizado.` : ""} onCancel={() => setCouponToRemove(null)} onConfirm={remove} />
  </div>;
}
