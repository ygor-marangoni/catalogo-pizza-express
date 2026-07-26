"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Mail, Pencil, Search, Trash2, UserPlus, Users } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { useToast } from "@/components/ui/Toast";
import { customersApi } from "@/features/admin-customers/customers-api";
import styles from "@/app/admin.module.css";

const PAGE_SIZE = 10;
const emptyForm = { name: "", email: "", password: "" };

function formatDate(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(new Date(value));
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const { notify } = useToast();

  async function load() {
    const records = await customersApi.list();
    setCustomers(records);
  }

  useEffect(() => {
    let active = true;
    customersApi.list()
      .then((records) => { if (active) setCustomers(records); })
      .catch((error) => { if (active) setMessage(error.message); });
    return () => { active = false; };
  }, []);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return customers.filter((customer) =>
      !term || customer.name.toLowerCase().includes(term) || customer.email.toLowerCase().includes(term));
  }, [customers, query]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function openEditor(customer = null) {
    setEditing(customer);
    setForm(customer ? { name: customer.name, email: customer.email, password: "" } : emptyForm);
    setMessage("");
  }

  async function submit(event) {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    setMessage("");
    try {
      const payload = { name: form.name.trim(), email: form.email.trim() };
      if (form.password) payload.password = form.password;
      if (editing) await customersApi.update(editing.id, payload);
      else await customersApi.create({ ...payload, password: form.password });
      await load();
      setEditing(null);
      setForm(emptyForm);
      notify(editing ? "Cliente atualizado com sucesso." : "Cliente criado com sucesso.");
      document.getElementById("customer-dialog")?.close();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function remove(customer) {
    if (!confirm(`Excluir a conta de “${customer.name}”? O histórico de pedidos será preservado.`)) return;
    try {
      await customersApi.remove(customer.id);
      await load();
      notify("Conta do cliente excluída com sucesso.");
    } catch (error) {
      setMessage(error.message);
    }
  }

  function showEditor(customer = null) {
    openEditor(customer);
    document.getElementById("customer-dialog")?.showModal();
  }

  return <>
    <AdminPageHeader
      eyebrow="Relacionamento"
      title="Clientes"
      description="Gerencie as contas cadastradas e mantenha os dados de contato atualizados."
      action={<button className={styles.button} type="button" onClick={() => showEditor()}><UserPlus size={17} />Novo cliente</button>}
    />
    {message && <p className={styles.message} role="status">{message}</p>}
    <section className={styles.panel}>
      <header className={styles.panelHeader}>
        <div><h2>Clientes cadastrados</h2><p>Somente pessoas que criaram uma conta aparecem nesta lista.</p></div>
        <div className={styles.catalogSummary}><span><Users size={17} /><strong>{customers.length}</strong> contas ativas</span></div>
      </header>
      <div className={styles.customersPanelBody}>
        <div className={styles.customerSearch}>
          <label className={styles.filterControl}>
            <span>Pesquisar cliente</span><Search size={18} />
            <input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Buscar por nome ou e-mail…" />
          </label>
        </div>
        {filtered.length === 0 ? <div className={styles.emptyState}><Users size={28} /><strong>Nenhum cliente encontrado</strong><p>Ajuste a pesquisa ou cadastre uma nova conta.</p></div> :
          <div className={styles.tableWrap}><table className={styles.table}>
            <thead><tr><th>Cliente</th><th>E-mail</th><th>Cadastro</th><th>Atualização</th><th>Ações</th></tr></thead>
            <tbody>{visible.map((customer) => <tr key={customer.id}>
              <td data-label="Cliente"><div className={styles.customerIdentity}><span>{customer.name.slice(0, 2).toUpperCase()}</span><div><strong>{customer.name}</strong><small>Cliente #{customer.id}</small></div></div></td>
              <td data-label="E-mail"><span className={styles.customerMeta}><Mail size={15} />{customer.email}</span></td>
              <td data-label="Cadastro"><span className={styles.customerMeta}><CalendarDays size={15} />{formatDate(customer.created_at)}</span></td>
              <td data-label="Atualização">{formatDate(customer.updated_at)}</td>
              <td data-label="Ações"><div className={styles.actions}>
                <button className={styles.iconButton} type="button" onClick={() => showEditor(customer)} aria-label={`Editar ${customer.name}`}><Pencil size={17} /></button>
                <button className={`${styles.iconButton} ${styles.danger}`} type="button" onClick={() => remove(customer)} aria-label={`Excluir ${customer.name}`}><Trash2 size={17} /></button>
              </div></td>
            </tr>)}</tbody>
          </table></div>}
        <AdminPagination page={currentPage} pageSize={PAGE_SIZE} total={filtered.length} onPageChange={setPage} itemLabel="cliente" itemLabelPlural="clientes" />
      </div>
    </section>

    <dialog id="customer-dialog" className={styles.adminDialog} onClose={() => { setEditing(null); setForm(emptyForm); }}>
      <form onSubmit={submit}>
        <header className={styles.dialogHeader}>
          <div><span className={styles.eyebrow}>{editing ? "Edição" : "Cadastro"}</span><h2>{editing ? "Editar cliente" : "Novo cliente"}</h2><p>{editing ? "Atualize somente os dados necessários." : "Crie uma conta para o cliente acessar o cardápio."}</p></div>
          <button type="button" className={styles.dialogClose} onClick={() => document.getElementById("customer-dialog")?.close()} aria-label="Fechar">×</button>
        </header>
        <div className={styles.dialogBody}>
          <label className={styles.field}>Nome completo<input required minLength={2} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
          <label className={styles.field}>E-mail<input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label>
          <label className={styles.field}>{editing ? "Nova senha (opcional)" : "Senha provisória"}<input required={!editing} minLength={8} type="password" autoComplete="new-password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="Mínimo de 8 caracteres" /></label>
        </div>
        <footer className={styles.dialogActions}>
          <button className={`${styles.button} ${styles.secondary}`} type="button" onClick={() => document.getElementById("customer-dialog")?.close()}>Cancelar</button>
          <button className={styles.button} disabled={saving}>{saving ? "Salvando…" : editing ? "Salvar alterações" : "Criar cliente"}</button>
        </footer>
      </form>
    </dialog>
  </>;
}
