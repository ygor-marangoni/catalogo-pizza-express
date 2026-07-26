"use client";

import { useEffect, useState } from "react";
import { catalogService } from "@/services/catalog-service";
import styles from "../admin.module.css";

const formatCents = (value) => (Number(value || 0) / 100).toFixed(2).replace(".", ",");

const moneyToCents = (value) => {
  const normalized = String(value ?? "")
    .trim()
    .replace(/\./g, "")
    .replace(",", ".");
  const amount = Number(normalized);

  if (!Number.isFinite(amount) || amount < 0) {
    throw new Error("Informe valores monetários válidos e não negativos.");
  }

  return Math.round(amount * 100);
};

const fields = [
  { name: "name", label: "Nome da loja", required: true },
  { name: "phone", label: "Telefone", placeholder: "(00) 00000-0000" },
  { name: "email", label: "E-mail", type: "email" },
  { name: "address", label: "Endereço", placeholder: "Rua, número, bairro e cidade" },
  { name: "opening_hours", label: "Horário de funcionamento", placeholder: "Ex.: segunda a domingo, das 18h às 23h" },
];

export default function SettingsPage() {
  const [form, setForm] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadStore() {
      try {
        const store = await catalogService.getStore();
        setForm({
          ...store,
          delivery_fee: formatCents(store.delivery_fee),
          min_order_value: formatCents(store.min_order_value),
        });
      } catch (requestError) {
        setError(requestError.message);
      }
    }

    loadStore();
  }, []);

  if (!form) return <p className={styles.loading}>{error || "Carregando..."}</p>;

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setError("");
    setMessage("");
  };

  async function save(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      await catalogService.updateStore({
        name: form.name.trim(),
        description: form.description?.trim() || null,
        phone: form.phone?.trim() || null,
        email: form.email?.trim() || null,
        address: form.address?.trim() || null,
        opening_hours: form.opening_hours?.trim() || null,
        delivery_fee: moneyToCents(form.delivery_fee),
        min_order_value: moneyToCents(form.min_order_value),
      });
      setMessage("Dados da loja atualizados com sucesso.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  }

  async function changeStatus(is_open) {
    setError("");
    setMessage("");

    try {
      const updated = await catalogService.updateStoreStatus(is_open);
      setForm((current) => ({ ...current, ...updated }));
      setMessage(is_open ? "Loja aberta para novos pedidos." : "Loja fechada para novos pedidos.");
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return (
    <section className={styles.panel}>
      <div className={styles.formHeader}>
        <div>
          <p className={styles.eyebrow}>Operação da loja</p>
          <h1>Configurações da loja</h1>
          <p className={styles.muted}>Atualize as informações exibidas no catálogo e as regras básicas do pedido.</p>
        </div>
        <span className={`${styles.status} ${form.is_open ? "" : styles.statusUnavailable}`}>
          {form.is_open ? "Aberta" : "Fechada"}
        </span>
      </div>

      <form className={styles.form} onSubmit={save}>
        <div className={styles.formSection}>
          <h2>Informações públicas</h2>
          <div className={styles.formGrid}>
            {fields.map(({ name, label, ...options }) => (
              <label key={name}>
                {label}
                <input
                  {...options}
                  name={name}
                  value={form[name] || ""}
                  onChange={updateField}
                  required={name === "name"}
                />
              </label>
            ))}
            <label className={styles.gridFull}>
              Descrição
              <textarea name="description" rows="4" value={form.description || ""} onChange={updateField} />
            </label>
          </div>
        </div>

        <div className={styles.formSection}>
          <h2>Regras de pedido</h2>
          <p className={styles.muted}>Os valores são exibidos em reais, mas enviados à API em centavos.</p>
          <div className={styles.formGrid}>
            <label>
              Taxa de entrega (R$)
              <input name="delivery_fee" inputMode="decimal" placeholder="0,00" value={form.delivery_fee} onChange={updateField} required />
            </label>
            <label>
              Pedido mínimo (R$)
              <input name="min_order_value" inputMode="decimal" placeholder="0,00" value={form.min_order_value} onChange={updateField} required />
            </label>
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.primary} disabled={saving}>
            {saving ? "Salvando..." : "Salvar alterações"}
          </button>
          <button type="button" onClick={() => changeStatus(true)} disabled={form.is_open}>Abrir loja</button>
          <button type="button" onClick={() => changeStatus(false)} disabled={!form.is_open}>Fechar loja</button>
        </div>
      </form>

      {message && <p className={styles.success} role="status">{message}</p>}
      {error && <p className={styles.error} role="alert">{error}</p>}
    </section>
  );
}
