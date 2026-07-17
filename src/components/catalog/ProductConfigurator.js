"use client";

import { useMemo, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { buildCartItem, calculateProductUnitPrice, validateProductConfiguration } from "@/features/cart/cart-domain";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Price } from "@/components/ui/Price";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { Radio } from "@/components/ui/Radio";
import { Textarea } from "@/components/ui/Textarea";
import { useToast } from "@/components/ui/Toast";
import { getStartingPrice } from "@/features/catalog/catalog-domain";
import styles from "./catalog.module.css";

export function ProductConfigurator({ product, inModal = false }) {
  const [variantId, setVariantId] = useState(null);
  const [addonSelections, setAddonSelections] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { addItem } = useCart();
  const { notify } = useToast();
  const configuration = useMemo(() => ({ variantId, addonSelections, quantity, note }), [variantId, addonSelections, quantity, note]);
  const validation = validateProductConfiguration(product, configuration);
  let unitPrice = getStartingPrice(product);
  try { unitPrice = calculateProductUnitPrice(product, configuration); } catch { unitPrice = getStartingPrice(product); }

  function toggleAddon(group, optionId) {
    setAddonSelections((current) => {
      const selected = current[group.id] || [];
      const next = selected.includes(optionId) ? selected.filter((id) => id !== optionId) : [...selected, optionId];
      return { ...current, [group.id]: next };
    });
  }

  function addToCart() {
    setSubmitted(true);
    if (!validation.valid) return;
    addItem(buildCartItem(product, configuration));
    notify(`${product.name} foi adicionado ao carrinho.`);
  }

  return <div className={`${styles.configurator} ${inModal ? styles.configuratorModal : ""}`}>
    {product.variants?.length > 0 && <section className={styles.optionGroup} aria-describedby={submitted && validation.errors.variant ? "variant-error" : undefined}>
      <div className={styles.optionHeader}><div><h2>Escolha o tamanho</h2><p>Escolha 1 opção</p></div><span className={styles.requiredBadge}>Obrigatório</span></div>
      <div className={styles.choices}>{product.variants.map((variant) => <div className={styles.choiceRow} key={variant.id}><Radio name="variant" label={variant.name} checked={variantId === variant.id} disabled={!variant.available} onChange={() => setVariantId(variant.id)} /><Price className={styles.choicePrice} value={variant.priceInCents} /></div>)}</div>
      {submitted && validation.errors.variant && <p className={styles.error} id="variant-error" role="alert">{validation.errors.variant}</p>}
    </section>}
    {(product.addonGroups || []).map((group) => <section className={styles.optionGroup} key={group.id} aria-describedby={submitted && validation.errors[group.id] ? `${group.id}-error` : undefined}>
      <div className={styles.optionHeader}><div><h2>{group.name}</h2><p>{group.min > 0 ? `Escolha de ${group.min} até ${group.max}` : `Escolha até ${group.max}`} {group.max === 1 ? "opção" : "opções"}</p></div><span className={`${styles.requiredBadge} ${!group.required ? styles.optionalBadge : ""}`}>{group.required ? "Obrigatório" : "Opcional"}</span></div>
      <div className={styles.choices}>{group.options.map((option) => <div className={styles.choiceRow} key={option.id}>
        {group.max === 1 ? <Radio name={group.id} label={option.name} checked={(addonSelections[group.id] || []).includes(option.id)} disabled={!option.available} onChange={() => setAddonSelections((current) => ({ ...current, [group.id]: [option.id] }))} /> : <Checkbox label={option.name} checked={(addonSelections[group.id] || []).includes(option.id)} disabled={!option.available} onChange={() => toggleAddon(group, option.id)} />}
        {option.priceInCents > 0 && <Price className={styles.choicePrice} value={option.priceInCents} prefix="+" />}
      </div>)}</div>
      {submitted && validation.errors[group.id] && <p className={styles.error} id={`${group.id}-error`} role="alert">{validation.errors[group.id]}</p>}
    </section>)}
    <div className={styles.noteGroup}><Textarea id="product-note" label="Alguma observação?" hint="Até 300 caracteres. A confirmação de pedidos virá em outra etapa." maxLength={300} value={note} onChange={(event) => setNote(event.target.value)} placeholder="Ex.: sem cebola, por favor" /></div>
    <div className={styles.addBar}>
      <QuantitySelector value={quantity} onChange={setQuantity} />
      <Button onClick={addToCart} disabled={!product.available} aria-describedby={!product.available ? "unavailable-product" : undefined}><ShoppingBag size={19} />{product.available ? <>Adicionar · <Price value={unitPrice * quantity} /></> : "Produto indisponível"}</Button>
    </div>
    {!product.available && <p className={styles.error} id="unavailable-product">Este produto está temporariamente indisponível e não pode ser adicionado.</p>}
  </div>;
}
