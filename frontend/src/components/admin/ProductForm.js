"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ImagePlus, Save, Tags, X } from "lucide-react";
import { productsApi } from "@/features/admin-catalog/products-api";
import { categoriesApi } from "@/features/admin-catalog/categories-api";
import { sizesApi } from "@/features/admin-catalog/sizes-api";
import { edgesApi } from "@/features/admin-catalog/edges-api";
import { additionalsApi } from "@/features/admin-catalog/additionals-api";
import { reaisToCents, centsToInput, formatCurrency } from "@/lib/currency";
import { AdminPageHeader } from "./AdminPageHeader";
import { AdminSelect } from "./AdminSelect";
import { AdminLoader } from "./AdminLoader";
import fallbackProduct from "../../../assets/images/produto-exemplo.webp";
import styles from "@/app/admin.module.css";

export function ProductForm({ id }) {
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [basePrice, setBasePrice] = useState("0,00");
  const [catalogOptions, setCatalogOptions] = useState({ sizes: [], edges: [], additionals: [] });
  const [configuration, setConfiguration] = useState({ sizes: [], edges: [], additionals: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState(id ? null : fallbackProduct);
  const [previewOpen, setPreviewOpen] = useState(false);
  const previewUrlRef = useRef(null);

  useEffect(() => {
    let active = true;
    Promise.all([
      categoriesApi.list(), sizesApi.list(), edgesApi.list(), additionalsApi.list(),
      id ? productsApi.get(id) : Promise.resolve(null),
      id ? productsApi.getConfiguration(id) : Promise.resolve({ sizes: [], edges: [], additionals: [] }),
    ]).then(([loadedCategories, sizes, edges, additionals, loadedProduct, loadedConfiguration]) => {
      if (!active) return;
      setCategories(loadedCategories);
      setCatalogOptions({ sizes, edges, additionals });
      setConfiguration({
        sizes: (loadedConfiguration.sizes || []).map((item) => ({ ...item, priceInput: centsToInput(item.price) })),
        edges: (loadedConfiguration.edges || []).map((item) => ({ ...item, overrideInput: item.price_override === null ? "" : centsToInput(item.price_override) })),
        additionals: (loadedConfiguration.additionals || []).map((item) => ({ ...item, overrideInput: item.price_override === null ? "" : centsToInput(item.price_override) })),
      });
      if (loadedProduct) {
        setProduct(loadedProduct);
        setCategoryId(String(loadedProduct.category_id || ""));
        setBasePrice(centsToInput(loadedProduct.base_price || 0));
        setImagePreview(loadedProduct.image_url || fallbackProduct);
      }
    }).catch((loadError) => {
      if (active) setError(loadError.message);
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [id]);

  useEffect(() => () => {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
  }, []);

  useEffect(() => {
    if (!previewOpen) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setPreviewOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [previewOpen]);

  function previewImage(event) {
    const [file] = event.target.files;
    if (!file) return;
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    previewUrlRef.current = URL.createObjectURL(file);
    setImagePreview(previewUrlRef.current);
  }

  function toggleSize(size) {
    setConfiguration((current) => {
      const exists = current.sizes.some((item) => item.size_id === size.id);
      if (exists) {
        const sizes = current.sizes.filter((item) => item.size_id !== size.id);
        if (sizes.length && !sizes.some((item) => item.is_default)) sizes[0] = { ...sizes[0], is_default: true };
        return { ...current, sizes };
      }
      let suggestedPrice = 0;
      try { suggestedPrice = reaisToCents(basePrice) + Number(size.additional_price || 0); } catch {}
      return {
        ...current,
        sizes: [...current.sizes, {
          size_id: size.id,
          name: size.name,
          priceInput: centsToInput(suggestedPrice),
          is_default: current.sizes.length === 0,
          available: true,
        }],
      };
    });
  }

  function selectAllSizes() {
    setConfiguration((current) => {
      const allSelected = catalogOptions.sizes.length > 0
        && catalogOptions.sizes.every((size) => current.sizes.some((item) => item.size_id === size.id));
      if (allSelected) return { ...current, sizes: [] };

      const selectedById = new Map(current.sizes.map((item) => [item.size_id, item]));
      let basePriceInCents = 0;
      try { basePriceInCents = reaisToCents(basePrice); } catch {}
      const sizes = catalogOptions.sizes.map((size) => selectedById.get(size.id) || {
        size_id: size.id,
        name: size.name,
        priceInput: centsToInput(basePriceInCents + Number(size.additional_price || 0)),
        is_default: false,
        available: true,
      });
      if (sizes.length && !sizes.some((item) => item.is_default)) sizes[0] = { ...sizes[0], is_default: true };
      return { ...current, sizes };
    });
  }

  function updateSize(sizeId, changes) {
    setConfiguration((current) => ({
      ...current,
      sizes: current.sizes.map((item) => {
        if (changes.is_default) return { ...item, is_default: item.size_id === sizeId };
        return item.size_id === sizeId ? { ...item, ...changes } : item;
      }),
    }));
  }

  function toggleOption(group, option, idField) {
    setConfiguration((current) => {
      const exists = current[group].some((item) => item[idField] === option.id);
      const items = exists
        ? current[group].filter((item) => item[idField] !== option.id)
        : [...current[group], { [idField]: option.id, name: option.name, overrideInput: "", available: true }];
      return { ...current, [group]: items };
    });
  }

  function selectAllOptions(group, idField, options) {
    setConfiguration((current) => {
      const allSelected = options.length > 0
        && options.every((option) => current[group].some((item) => item[idField] === option.id));
      if (allSelected) return { ...current, [group]: [] };
      const selectedById = new Map(current[group].map((item) => [item[idField], item]));
      return {
        ...current,
        [group]: options.map((option) => selectedById.get(option.id) || {
          [idField]: option.id,
          name: option.name,
          overrideInput: "",
          available: true,
        }),
      };
    });
  }

  function updateOption(group, idField, idValue, changes) {
    setConfiguration((current) => ({
      ...current,
      [group]: current[group].map((item) => item[idField] === idValue ? { ...item, ...changes } : item),
    }));
  }

  function configurationPayload() {
    return {
      sizes: configuration.sizes.map((item) => ({
        size_id: Number(item.size_id),
        price: reaisToCents(item.priceInput),
        is_default: Boolean(item.is_default),
        available: Boolean(item.available),
      })),
      edges: configuration.edges.map((item) => ({
        edge_id: Number(item.edge_id),
        price_override: item.overrideInput.trim() ? reaisToCents(item.overrideInput) : null,
        available: Boolean(item.available),
      })),
      additionals: configuration.additionals.map((item) => ({
        additional_id: Number(item.additional_id),
        price_override: item.overrideInput.trim() ? reaisToCents(item.overrideInput) : null,
        available: Boolean(item.available),
      })),
    };
  }

  async function saveConfiguration(productId, payload) {
    try {
      return await productsApi.updateConfiguration(productId, payload);
    } catch (requestError) {
      if (requestError?.code !== "API_OFFLINE" && requestError?.status < 500) throw requestError;
      return productsApi.updateConfiguration(productId, payload);
    }
  }

  async function submit(event) {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const image = form.get("image");
    const values = {
      name: form.get("name"),
      description: form.get("description"),
      category_id: form.get("category_id"),
      base_price: reaisToCents(basePrice),
      available: String(form.get("available") === "on"),
      highlighted: String(form.get("highlighted") === "on"),
      image: image?.size ? image : undefined,
    };
    try {
      const savedProduct = id ? await productsApi.update(id, values) : await productsApi.create(values);
      await saveConfiguration(id || savedProduct.id, configurationPayload());
      router.push("/admin/produtos");
      router.refresh();
    } catch (saveError) { setError(saveError?.message || "Não foi possível salvar a configuração do produto."); }
    finally { setSaving(false); }
  }

  if (loading || (id && !product && !error)) return <AdminLoader fullScreen label="Carregando produto..." />;

  return <>
    <AdminPageHeader
      eyebrow="Catálogo"
      title={id ? "Editar produto" : "Cadastrar produto"}
      description={id ? "Atualize as informações exibidas no cardápio." : "Preencha os dados comerciais do novo item."}
      action={<Link className={`${styles.button} ${styles.secondary}`} href="/admin/produtos">Ver produtos</Link>}
    />
    {error && <p className={styles.error} role="alert">{error}</p>}
    <form className={`${styles.form} ${styles.formPanel} ${styles.productForm}`} onSubmit={submit}>
      <section className={styles.formSection}>
        <div className={styles.formSectionTitle}><h2>Dados principais</h2><p>Informações usadas para apresentar e vender o produto.</p></div>
        <div className={styles.formGrid}>
          <label className={styles.field}>Nome<input name="name" required defaultValue={product?.name || ""} placeholder="Ex: Pizza Margherita" /></label>
          <div className={styles.field}>
            <span>Categoria</span>
            <AdminSelect label="Categoria" value={categoryId} onChange={setCategoryId} icon={Tags} options={[{ value: "", label: "Selecione..." }, ...categories.map((category) => ({ value: String(category.id), label: category.name }))]} />
            <input className={styles.srOnly} name="category_id" value={categoryId} readOnly required />
          </div>
          <label className={styles.field}>Preço base (R$)<input name="base_price" inputMode="decimal" required value={basePrice} onChange={(event) => setBasePrice(event.target.value)} placeholder="0,00" /></label>
          <label className={`${styles.field} ${styles.wide}`}>Descrição<textarea name="description" defaultValue={product?.description || ""} placeholder="Descreva ingredientes e características do produto." /></label>
        </div>
      </section>

      <section className={styles.formSection}>
        <div className={styles.formSectionTitle}><h2>Imagem do produto</h2><p>{id ? "Envie uma nova imagem apenas se quiser substituir a atual." : "A imagem é opcional; o cardápio possui um fallback visual."}</p></div>
        <div className={styles.productImageEditor}>
          <button className={styles.productImagePreviewButton} type="button" onClick={() => setPreviewOpen(true)} aria-label="Ampliar prévia da imagem">
            <Image className={styles.productImagePreview} src={imagePreview || fallbackProduct} alt="Prévia da imagem do produto" fill loading="eager" sizes="(max-width: 760px) 90vw, 340px" unoptimized={typeof imagePreview === "string"} />
            <span>Visualizar imagem</span>
          </button>
          <label className={styles.productImageUploadAction}>
            <ImagePlus size={27} />
            <span><strong>{imagePreview ? "Trocar imagem" : "Adicionar imagem"}</strong><small>PNG, JPG, JPEG ou WEBP.</small></span>
            <input name="image" type="file" accept="image/png,image/jpeg,image/webp" onChange={previewImage} />
          </label>
        </div>
      </section>

      <section className={styles.formSection}>
        <div className={styles.configurationHeading}>
          <div className={styles.formSectionTitle}><h2>Tamanhos e preços</h2><p>Selecione os tamanhos vendidos, informe o preço final e escolha exatamente um padrão.</p></div>
          {catalogOptions.sizes.length > 0 && <button className={styles.selectAllButton} type="button" onClick={selectAllSizes}>
            {catalogOptions.sizes.every((size) => configuration.sizes.some((item) => item.size_id === size.id)) ? "Limpar seleção" : "Selecionar todos"}
          </button>}
        </div>
        <div className={styles.configurationList}>
          {catalogOptions.sizes.map((size) => {
            const selected = configuration.sizes.find((item) => item.size_id === size.id);
            return <article className={`${styles.configurationRow} ${selected ? styles.configurationSelected : ""}`} key={size.id}>
              <label className={styles.configurationToggle}><input type="checkbox" checked={Boolean(selected)} onChange={() => toggleSize(size)} /><span><strong>{size.name}</strong><small>{size.code}</small></span></label>
              {selected && <div className={styles.configurationControls}>
                <label className={styles.compactField}>Preço final (R$)<input inputMode="decimal" value={selected.priceInput} onChange={(event) => updateSize(size.id, { priceInput: event.target.value })} /></label>
                <label className={styles.inlineChoice}><input type="radio" name="default_size" checked={selected.is_default} onChange={() => updateSize(size.id, { is_default: true })} /><span>Padrão</span></label>
                <label className={styles.inlineChoice}><input type="checkbox" checked={selected.available} onChange={(event) => updateSize(size.id, { available: event.target.checked })} /><span>Disponível</span></label>
              </div>}
            </article>;
          })}
          {catalogOptions.sizes.length === 0 && <p className={styles.empty}>Cadastre tamanhos antes de configurar este produto.</p>}
        </div>
      </section>

      <section className={styles.formSection}>
        <div className={styles.configurationHeading}>
          <div className={styles.formSectionTitle}><h2>Bordas permitidas</h2><p>O preço cadastrado é usado por padrão. Preencha a exceção somente quando este produto tiver outro valor.</p></div>
          {catalogOptions.edges.length > 0 && <button className={styles.selectAllButton} type="button" onClick={() => selectAllOptions("edges", "edge_id", catalogOptions.edges)}>
            {catalogOptions.edges.every((edge) => configuration.edges.some((item) => item.edge_id === edge.id)) ? "Limpar seleção" : "Selecionar todas"}
          </button>}
        </div>
        <div className={styles.configurationList}>
          {catalogOptions.edges.map((edge) => {
            const selected = configuration.edges.find((item) => item.edge_id === edge.id);
            return <article className={`${styles.configurationRow} ${selected ? styles.configurationSelected : ""}`} key={edge.id}>
              <label className={styles.configurationToggle}><input type="checkbox" checked={Boolean(selected)} onChange={() => toggleOption("edges", edge, "edge_id")} /><span><strong>{edge.name}</strong><small>Preço: + {formatCurrency(edge.additional_price)}</small></span></label>
              {selected && <div className={styles.configurationControls}>
                <label className={styles.compactField}>Exceção de preço (R$)<input inputMode="decimal" value={selected.overrideInput} onChange={(event) => updateOption("edges", "edge_id", edge.id, { overrideInput: event.target.value })} placeholder="Usar preço global" /></label>
                <label className={styles.inlineChoice}><input type="checkbox" checked={selected.available} onChange={(event) => updateOption("edges", "edge_id", edge.id, { available: event.target.checked })} /><span>Disponível</span></label>
              </div>}
            </article>;
          })}
        </div>
      </section>

      <section className={styles.formSection}>
        <div className={styles.configurationHeading}>
          <div className={styles.formSectionTitle}><h2>Adicionais permitidos</h2><p>Escolha somente os complementos compatíveis com o produto; exceções não alteram o preço cadastrado.</p></div>
          {catalogOptions.additionals.length > 0 && <button className={styles.selectAllButton} type="button" onClick={() => selectAllOptions("additionals", "additional_id", catalogOptions.additionals)}>
            {catalogOptions.additionals.every((additional) => configuration.additionals.some((item) => item.additional_id === additional.id)) ? "Limpar seleção" : "Selecionar todos"}
          </button>}
        </div>
        <div className={styles.configurationList}>
          {catalogOptions.additionals.map((additional) => {
            const selected = configuration.additionals.find((item) => item.additional_id === additional.id);
            return <article className={`${styles.configurationRow} ${selected ? styles.configurationSelected : ""}`} key={additional.id}>
              <label className={styles.configurationToggle}><input type="checkbox" checked={Boolean(selected)} onChange={() => toggleOption("additionals", additional, "additional_id")} /><span><strong>{additional.name}</strong><small>Preço: + {formatCurrency(additional.price)}</small></span></label>
              {selected && <div className={styles.configurationControls}>
                <label className={styles.compactField}>Exceção de preço (R$)<input inputMode="decimal" value={selected.overrideInput} onChange={(event) => updateOption("additionals", "additional_id", additional.id, { overrideInput: event.target.value })} placeholder="Usar preço global" /></label>
                <label className={styles.inlineChoice}><input type="checkbox" checked={selected.available} onChange={(event) => updateOption("additionals", "additional_id", additional.id, { available: event.target.checked })} /><span>Disponível</span></label>
              </div>}
            </article>;
          })}
        </div>
      </section>

      <section className={styles.formSection}>
        <div className={styles.formSectionTitle}><h2>Publicação</h2><p>Defina como o produto aparece no cardápio.</p></div>
        <div className={styles.checkboxGroup}>
          <label className={styles.checkbox}><input name="available" type="checkbox" defaultChecked={product?.available ?? true} /><span><strong>Disponível</strong></span></label>
          <label className={styles.checkbox}><input name="highlighted" type="checkbox" defaultChecked={product?.highlighted ?? false} /><span><strong>Destaque</strong></span></label>
        </div>
      </section>

      <div className={styles.formActions}>
        <Link className={`${styles.button} ${styles.secondary}`} href="/admin/produtos">Cancelar</Link>
        <button className={styles.button} disabled={saving}><Save size={17} />{saving ? "Salvando..." : "Salvar produto"}</button>
      </div>
    </form>
    {previewOpen && <div className={styles.imageLightbox} role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setPreviewOpen(false)}>
      <section className={styles.imageLightboxDialog} role="dialog" aria-modal="true" aria-label="Prévia ampliada da imagem do produto">
        <button type="button" onClick={() => setPreviewOpen(false)} aria-label="Fechar prévia"><X size={22} /></button>
        <div><Image src={imagePreview || fallbackProduct} alt="Imagem ampliada do produto" fill sizes="90vw" unoptimized={typeof imagePreview === "string"} /></div>
      </section>
    </div>}
  </>;
}
