"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GripVertical, ImagePlus, Pencil, Search, Trash2 } from "lucide-react";
import { reaisToCents, centsToInput, formatCurrency } from "@/lib/currency";
import { categoryImage } from "@/repositories/catalog/catalog-mappers";
import { AdminPageHeader } from "./AdminPageHeader";
import { AdminLoader } from "./AdminLoader";
import { AdminConfirmDialog } from "./AdminConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import styles from "@/app/admin.module.css";

const PAGE_COPY = {
  Categorias: ["Organização", "Gerencie os grupos usados para organizar e filtrar o cardápio.", "categoria"],
  Tamanhos: ["Personalização", "Configure os tamanhos globais disponíveis para pizzas.", "tamanho"],
  Bordas: ["Personalização", "Gerencie as opções globais de borda do cardápio.", "borda"],
  Adicionais: ["Personalização", "Gerencie os complementos globais oferecidos aos clientes.", "adicional"],
};

export function ResourceManager({ title, api, fields, priceField, imageField }) {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [query, setQuery] = useState("");
  const [itemToRemove, setItemToRemove] = useState(null);
  const [draggedId, setDraggedId] = useState(null);
  const editorPanelRef = useRef(null);
  const { notify } = useToast();
  const [eyebrow, description, singular] = PAGE_COPY[title] || ["Catálogo", `Gerencie ${title.toLowerCase()}.`, "item"];

  const load = useCallback(() => {
    setLoading(true);
    return api.list().then(setItems).catch((error) => setMessage(error.message)).finally(() => setLoading(false));
  }, [api]);

  useEffect(() => {
    let active = true;
    api.list().then((records) => { if (active) setItems(records); })
      .catch((error) => { if (active) setMessage(error.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [api]);

  const filtered = useMemo(() => items.filter((item) => item.name.toLowerCase().includes(query.toLowerCase())), [items, query]);

  async function submit(event) {
    event.preventDefault();
    if (saving) return;
    const formElement = event.currentTarget;
    setSaving(true);
    setMessage("");
    const form = new FormData(formElement);
    try {
      const body = {};
    fields.forEach((field) => {
      let value = form.get(field.name);
      if (field.type === "money") value = reaisToCents(value);
      if (field.type === "file" && !value?.size) value = undefined;
      if (value === "") value = null;
      body[field.name] = value;
    });
      if (editing) await api.update(editing.id, body);
      else await api.create(body);
      setEditing(null);
      formElement.reset();
      setMessage("");
      notify(editing ? "Alterações salvas com sucesso." : `${singular} salvo com sucesso.`);
      await load();
    } catch (error) { setMessage(error.message); }
    finally { setSaving(false); }
  }

  async function remove(item) {
    const target = item?.id ? item : itemToRemove;
    if (!target) return;
    try { await api.remove(target.id); setMessage(""); notify("Item excluído com sucesso."); await load(); }
    catch (error) { setMessage(error.message); }
    finally { setItemToRemove(null); }
  }

  function startEditing(item) {
    setEditing(item);
    requestAnimationFrame(() => {
      editorPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  async function reorder(sourceId, targetId) {
    if (sourceId === targetId || query) return;
    const sourceIndex = items.findIndex((item) => item.id === sourceId);
    const targetIndex = items.findIndex((item) => item.id === targetId);
    if (sourceIndex < 0 || targetIndex < 0) return;
    const next = [...items];
    const [moved] = next.splice(sourceIndex, 1);
    next.splice(targetIndex, 0, moved);
    setItems(next);
    setDraggedId(null);
    try {
      await Promise.all(next.map((item, index) => api.update(item.id, { display_order: index })));
      notify("Ordem das categorias atualizada.");
    } catch (error) { setMessage(error.message); await load(); }
  }

  return <>
    <AdminPageHeader eyebrow={eyebrow} title={title} description={description} />
    {message && <p className={styles.message} role="status">{message}</p>}
    <div className={styles.resourceLayout}>
      <section ref={editorPanelRef} className={`${styles.panel} ${styles.resourceEditorPanel}`}>
        <header className={styles.panelHeader}><div><h2>{editing ? `Editar ${singular}` : `Novo ${singular}`}</h2><p>Preencha os dados abaixo e salve as alterações.</p></div></header>
        <div className={`${styles.panelBody} ${styles.resourceFormBody}`}>
          <form className={styles.form} onSubmit={submit}>
            {fields.map((field) => <label className={styles.field} key={`${editing?.id || "new"}-${field.name}`}>
              {field.label}
              {field.type === "file"
                ? <span className={styles.upload}><ImagePlus size={24} /><span><strong>Selecionar imagem</strong><small>PNG, JPG, JPEG ou WEBP — até 5 MB.</small></span><input name={field.name} type="file" accept={field.accept || "image/*"} /></span>
                : field.multiline
                ? <textarea name={field.name} defaultValue={editing?.[field.name] || ""} />
                : <input name={field.name} type={field.type === "money" ? "text" : field.type || "text"} required={field.required} defaultValue={field.type === "money" ? centsToInput(editing?.[field.name] || 0) : editing?.[field.name] || ""} />}
            </label>)}
            <div className={styles.formActions}>
              <button type="button" className={`${styles.button} ${styles.secondary}`} onClick={() => setEditing(null)}>Cancelar</button>
              <button className={styles.button} disabled={saving}>{saving ? "Salvando…" : `Salvar ${singular}`}</button>
            </div>
          </form>
        </div>
      </section>

      <section className={styles.panel}>
        <header className={styles.panelHeader}><div><h2>{title} cadastrados</h2><p>{items.length} {items.length === 1 ? "registro" : "registros"} no catálogo.</p></div></header>
        <div className={`${styles.panelBody} ${styles.resourceListBody}`}>
          <div className={styles.resourceSearch}><label className={styles.filterControl}><span>Buscar</span><Search size={18} /><input aria-label={`Buscar ${title.toLowerCase()}`} placeholder={`Buscar ${singular}…`} value={query} onChange={(event) => setQuery(event.target.value)} /></label>{title === "Categorias" && <small>Arraste as categorias para definir a ordem exibida no cardápio.</small>}</div>
          {loading ? <AdminLoader fullScreen label="Carregando itens..." /> : filtered.length === 0 ? <p className={styles.empty}>Nenhum item encontrado.</p> :
            <div className={styles.tableWrap}><table className={styles.table}><thead><tr><th>Nome</th>{priceField && <th>Preço</th>}<th>Ações</th></tr></thead>
              <tbody>{filtered.map((item) => {
                const image = imageField ? categoryImage(item) : null;
                const imageUrl = typeof image === "string" ? image : image?.src;
                return <tr key={item.id} draggable={title === "Categorias" && !query} onDragStart={() => setDraggedId(item.id)} onDragOver={(event) => { if (title === "Categorias" && !query) event.preventDefault(); }} onDrop={() => reorder(draggedId, item.id)} onDragEnd={() => setDraggedId(null)} className={draggedId === item.id ? styles.resourceRowDragging : undefined}><td data-label="Nome"><div className={styles.productCell}>{title === "Categorias" && <GripVertical className={styles.dragHandle} size={18} aria-label="Arrastar para reordenar" />}{imageField && <span className={styles.resourceImage} style={{ backgroundImage: `url("${imageUrl}")` }} />}<strong className={imageField ? styles.resourceName : undefined}>{item.name}</strong></div></td>{priceField && <td data-label="Preço">{formatCurrency(item[priceField])}</td>}<td className={styles.resourceActionsCell} data-label="Ações"><div className={styles.actions}>
                <button className={styles.iconButton} onClick={() => startEditing(item)} aria-label={`Editar ${item.name}`}><Pencil size={17} /></button>
                <button className={`${styles.iconButton} ${styles.danger}`} onClick={() => setItemToRemove(item)} aria-label={`Excluir ${item.name}`}><Trash2 size={17} /></button>
              </div></td></tr>;
              })}</tbody></table></div>}
        </div>
      </section>
    </div>
    <AdminConfirmDialog open={Boolean(itemToRemove)} title={`Excluir ${singular}?`} description={itemToRemove ? `“${itemToRemove.name}” será removido permanentemente.` : ""} onCancel={() => setItemToRemove(null)} onConfirm={remove} />
  </>;
}
