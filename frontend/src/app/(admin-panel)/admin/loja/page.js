"use client";

import { useEffect, useState } from "react";
import { Save, Store, TicketPercent } from "lucide-react";
import { storeApi } from "@/features/admin-catalog/store-api";
import { centsToInput, reaisToCents, formatCurrency } from "@/lib/currency";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminLoader } from "@/components/admin/AdminLoader";
import { useToast } from "@/components/ui/Toast";
import { CouponManagerModal } from "@/components/admin/CouponManagerModal";
import styles from "@/app/admin.module.css";

function formatPhone(value) {
  const digits = String(value || "").replace(/\D/g, "").slice(0, 11);
  if (!digits) return "";
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export default function StorePage() {
  const [store, setStore] = useState(null);
  const [status, setStatus] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const { notify } = useToast();
  const [couponModalOpen, setCouponModalOpen] = useState(false);

  async function load() {
    try {
      const [storeData, statusData] = await Promise.all([storeApi.get(), storeApi.getStatus()]);
      setStore(storeData); setStatus(statusData);
    } catch (error) { setMessage(error.message); }
  }
  useEffect(() => {
    let active = true;
    Promise.all([storeApi.get(), storeApi.getStatus()])
      .then(([storeData, statusData]) => {
        if (active) { setStore(storeData); setStatus(statusData); }
      }).catch((error) => { if (active) setMessage(error.message); });
    return () => { active = false; };
  }, []);

  async function submit(event) {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    const form = new FormData(event.currentTarget);
    const body = {
      name: form.get("name"), description: form.get("description") || null,
      phone: form.get("phone") || null, email: form.get("email") || null,
      address: form.get("address") || null, opening_hours: form.get("opening_hours") || null,
      estimated_time: form.get("estimated_time") || null,
      delivery_fee: reaisToCents(form.get("delivery_fee")),
      min_order_value: reaisToCents(form.get("min_order_value")),
    };
    try { await storeApi.update(body); setMessage(""); notify("Configurações salvas com sucesso."); await load(); }
    catch (error) { setMessage(error.message); }
    finally { setSaving(false); }
  }

  async function toggleStatus() {
    try { await storeApi.updateStatus(!status.is_open); setMessage(""); notify(`Loja ${status.is_open ? "fechada" : "aberta"} com sucesso.`); await load(); }
    catch (error) { setMessage(error.message); }
  }

  if (!store) return message ? <p role="status">{message}</p> : <AdminLoader fullScreen label="Carregando loja..." />;

  return <>
    <AdminPageHeader eyebrow="Configurações" title="Loja" description="Gerencie informações públicas, operação e valores do estabelecimento." />
    {message && <p className={styles.message} role="status">{message}</p>}
    <div className={styles.storeLayout}>
      <form className={`${styles.form} ${styles.formPanel}`} onSubmit={submit}>
        <section className={styles.formSection}>
          <div className={styles.formSectionTitle}><h2>Identidade e contato</h2><p>Dados apresentados aos clientes no cardápio.</p></div>
          <div className={styles.formGrid}>
            <label className={styles.field}>Nome<input name="name" required defaultValue={store.name || ""} /></label>
            <label className={styles.field}>Telefone<input name="phone" type="tel" inputMode="tel" placeholder="(00) 00000-0000" defaultValue={formatPhone(store.phone)} onInput={(event) => { event.currentTarget.value = formatPhone(event.currentTarget.value); }} /></label>
            <label className={styles.field}>E-mail<input name="email" type="email" defaultValue={store.email || ""} /></label>
            <label className={styles.field}>Endereço<input name="address" defaultValue={store.address || ""} /></label>
            <label className={`${styles.field} ${styles.wide}`}>Descrição<textarea name="description" defaultValue={store.description || ""} /></label>
          </div>
        </section>
        <section className={styles.formSection}>
          <div className={styles.formSectionTitle}><h2>Operação</h2><p>Horários e condições comerciais atuais.</p></div>
          <div className={styles.formGrid}>
            <label className={styles.field}>Horário de funcionamento<input name="opening_hours" defaultValue={typeof store.opening_hours === "string" ? store.opening_hours : JSON.stringify(store.opening_hours || "")} /></label>
            <label className={styles.field}>Tempo de espera<input name="estimated_time" defaultValue={store.estimated_time || "60–70 min"} placeholder="Ex: 60–70 min" /></label>
            <label className={styles.field}>Taxa de entrega (R$)<input name="delivery_fee" inputMode="decimal" defaultValue={centsToInput(store.delivery_fee)} /></label>
            <label className={styles.field}>Pedido mínimo (R$)<input name="min_order_value" inputMode="decimal" defaultValue={centsToInput(store.min_order_value)} /></label>
          </div>
        </section>
        <div className={styles.formActions}><button className={styles.button} disabled={saving}><Save size={17} />{saving ? "Salvando…" : "Salvar configurações"}</button></div>
      </form>

      <aside className={styles.storeSidebar}>
        <section className={styles.panel}>
          <header className={styles.panelHeader}><div><h2>Status da loja</h2><p>Visível em tempo real no cardápio.</p></div></header>
          <div className={styles.panelBody}>
            <div className={styles.statusHeroMain}><span className={`${styles.statusHeroIcon} ${!status?.is_open ? styles.closed : ""}`}><Store size={22} /></span><div><span className={styles.metricLabel}>Estado atual</span><h3>{status?.is_open ? "Aberta" : "Fechada"}</h3></div></div>
            <button className={status?.is_open ? `${styles.button} ${styles.secondary}` : styles.button} onClick={toggleStatus}>{status?.is_open ? "Fechar loja" : "Abrir loja"}</button>
          </div>
        </section>
        <section className={styles.panel}>
          <header className={styles.panelHeader}><div><h2>Prévia</h2><p>Resumo dos dados atuais.</p></div></header>
          <div className={styles.panelBody}><div className={styles.previewCard}>
            <div className={styles.previewBlock}><span>Loja</span><strong>{store.name}</strong><p>{store.description || "Sem descrição cadastrada."}</p></div>
            <div className={styles.previewBlock}><span>Entrega</span><strong>{formatCurrency(store.delivery_fee || 0)}</strong></div>
            <div className={styles.previewBlock}><span>Pedido mínimo</span><strong>{formatCurrency(store.min_order_value || 0)}</strong></div>
            <button className={`${styles.button} ${styles.secondary} ${styles.couponManagerButton}`} type="button" onClick={() => setCouponModalOpen(true)}><TicketPercent size={17} />Gerenciar cupons</button>
          </div></div>
        </section>
      </aside>
    </div>
    <CouponManagerModal open={couponModalOpen} onClose={() => setCouponModalOpen(false)} />
  </>;
}
