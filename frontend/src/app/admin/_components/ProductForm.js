"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { catalogService } from "@/services/catalog-service";
import styles from "../admin.module.css";

const empty = { name: "", description: "", category_id: "", base_price: "", available: true, highlighted: false, size_ids: [], edge_ids: [], additional_ids: [] };

function selectedIds(items = []) {
  return items.map((item) => Number(item.id));
}

export function ProductForm({ product = null }) {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [options, setOptions] = useState({ sizes: [], edges: [], additionals: [] });
  const [form, setForm] = useState(product ? { ...empty, name: product.name, description: product.description || "", category_id: product.category_id, base_price: product.base_price, available: product.available, highlighted: product.highlighted, size_ids: selectedIds(product.sizes), edge_ids: selectedIds(product.edges), additional_ids: selectedIds(product.additionals) } : empty);
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([catalogService.getCategories(), catalogService.getSizes(), catalogService.getEdges(), catalogService.getAdditionals()])
      .then(([categoriesResult, sizes, edges, additionals]) => { setCategories(categoriesResult); setOptions({ sizes, edges, additionals }); })
      .catch((exception) => setError(exception.message));
  }, []);

  function field(event) {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  }

  function toggleOption(fieldName, id) {
    setForm((current) => ({ ...current, [fieldName]: current[fieldName].includes(id) ? current[fieldName].filter((value) => value !== id) : [...current[fieldName], id] }));
  }

  async function save(event) {
    event.preventDefault(); setSaving(true); setError("");
    const body = new FormData();
    Object.entries({ ...form, category_id: Number(form.category_id), base_price: Number(form.base_price), size_ids: JSON.stringify(form.size_ids), edge_ids: JSON.stringify(form.edge_ids), additional_ids: JSON.stringify(form.additional_ids) }).forEach(([key, value]) => body.append(key, String(value)));
    if (image) body.append("image", image);
    try { if (product) await catalogService.updateProduct(product.id, body); else await catalogService.createProduct(body); router.push("/admin/products"); }
    catch (exception) { setError(exception.message); setSaving(false); }
  }

  const optionGroup = (fieldName, title, items, description) => <fieldset className={styles.optionFieldset}>
    <legend>{title}</legend><p className={styles.muted}>{description}</p>
    <div className={styles.optionList}>{items.map((item) => <label className={styles.checkLabel} key={item.id}><input type="checkbox" checked={form[fieldName].includes(Number(item.id))} onChange={() => toggleOption(fieldName, Number(item.id))} /><span>{item.name}</span><small>{item.additional_price !== undefined ? `+ R$ ${(item.additional_price / 100).toFixed(2).replace(".", ",")}` : item.price !== undefined ? `+ R$ ${(item.price / 100).toFixed(2).replace(".", ",")}` : ""}</small></label>)}</div>
  </fieldset>;

  return <section className={styles.panel}><div className={styles.formHeader}><div><span className={styles.eyebrow}>Catálogo</span><h1>{product ? "Editar produto" : "Novo produto"}</h1><p>{product ? "Atualize dados e opções permitidas para este produto." : "Cadastre o produto e defina suas opções de personalização."}</p></div></div><form className={styles.form} onSubmit={save}>
    <label>Nome<input name="name" required maxLength="160" value={form.name} onChange={field} /></label>
    <label>Descrição<textarea name="description" value={form.description} onChange={field} /></label>
    <label>Categoria<select name="category_id" required value={form.category_id} onChange={field}><option value="">Selecione</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
    <label>Preço base (centavos)<input name="base_price" type="number" min="0" step="1" required value={form.base_price} onChange={field} /></label>
    <label>Imagem do produto<input type="file" accept="image/*" onChange={(event) => setImage(event.target.files?.[0] || null)} /></label>
    <div className={styles.optionSections}>{optionGroup("size_ids", "Tamanhos permitidos", options.sizes, "Selecione os tamanhos disponíveis. Produtos com tamanhos exigirão uma escolha no catálogo.")}{optionGroup("edge_ids", "Bordas permitidas", options.edges, "Deixe vazio para produtos que não possuem borda, como bebidas e porções.")}{optionGroup("additional_ids", "Adicionais permitidos", options.additionals, "Somente os adicionais selecionados serão oferecidos ao cliente.")}</div>
    <label className={styles.checkLabel}><input name="available" type="checkbox" checked={form.available} onChange={field} /> Disponível</label><label className={styles.checkLabel}><input name="highlighted" type="checkbox" checked={form.highlighted} onChange={field} /> Produto em destaque</label>
    {error && <p className={styles.error} role="alert">{error}</p>}<div className={styles.actions}><button className={styles.primary} disabled={saving}>{saving ? "Salvando..." : product ? "Salvar alterações" : "Criar produto"}</button><button type="button" onClick={() => router.push("/admin/products")}>Cancelar</button></div>
  </form></section>;
}
