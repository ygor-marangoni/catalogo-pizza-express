import fallbackProduct from "../../../assets/images/produto-exemplo.webp";
import additionsBackground from "../../../assets/images/bg-adicionais.webp";
import drinksBackground from "../../../assets/images/bg-bebidas.webp";
import sweetsBackground from "../../../assets/images/bg-doces.webp";
import promotionsBackground from "../../../assets/images/bg-promocoes.webp";
import savoryBackground from "../../../assets/images/bg-salgadas.webp";
import logoImage from "../../../assets/images/logo.webp";
import bannerImage from "../../../assets/images/banner-2.webp";
import bannerMobileImage from "../../../assets/images/banner-mobile.webp";
import pizzaBadgeImage from "../../../assets/images/pizza banner.png";
import brazilFlagImage from "../../../assets/images/brasil-bandeira.svg";
import { assignUniqueSlugs, slugify } from "./slugify";

const categoryFallbacks = {
  bebida: drinksBackground, doce: sweetsBackground, sobremesa: sweetsBackground,
  promocao: promotionsBackground, adicional: additionsBackground, pizza: savoryBackground,
};

export function categoryImage(category) {
  if (category.icon_url) return category.icon_url;
  const normalized = slugify(category.name);
  return Object.entries(categoryFallbacks).find(([term]) => normalized.includes(term))?.[1] || savoryBackground;
}

export function mapCategories(records) {
  return assignUniqueSlugs(records).filter((category) => !slugify(category.name).includes("adicion")).map((category, index) => ({
    id: String(category.id), name: category.name, slug: category.slug,
    description: category.description || "", image: categoryImage(category),
    accent: category.slug.includes("promoc"), active: true, sortOrder: index + 1,
  }));
}

export function mapSize(size, basePrice = 0) {
  return { id: String(size.id), name: size.name, code: size.code, description: size.description || "", priceInCents: basePrice + size.additional_price, additionalPriceInCents: size.additional_price, available: true };
}
export function mapEdge(edge) {
  return { id: String(edge.id), name: edge.name, description: edge.description || "", priceInCents: edge.additional_price, available: true };
}
export function mapAdditional(item) {
  return { id: String(item.id), name: item.name, description: item.description || "", priceInCents: item.price, available: true };
}

export function buildProductConfiguration(product, category, sizes, edges, additionals) {
  if (sizes && !Array.isArray(sizes) && "sizes" in sizes) {
    const configuration = sizes;
    const variants = (configuration.sizes || []).map((size) => ({
      id: String(size.size_id), name: size.name, code: size.code, description: size.description || "",
      priceInCents: size.price, available: size.available, isDefault: size.is_default,
    }));
    const addonGroups = [];
    if (configuration.edges?.length) addonGroups.push({
      id: "edges", name: "Escolha a borda", required: false, min: 0, max: 1,
      options: configuration.edges.map((edge) => ({
        id: String(edge.edge_id), name: edge.name, description: edge.description || "",
        priceInCents: edge.price, globalPriceInCents: edge.global_price,
        hasPriceOverride: edge.price_override !== null, available: edge.available,
      })),
    });
    if (configuration.additionals?.length) addonGroups.push({
      id: "additionals", name: "Adicionais", required: false, min: 0, max: 3,
      options: configuration.additionals.map((additional) => ({
        id: String(additional.additional_id), name: additional.name, description: additional.description || "",
        priceInCents: additional.price, globalPriceInCents: additional.global_price,
        hasPriceOverride: additional.price_override !== null, available: additional.available,
      })),
    });
    return {
      variants,
      defaultVariantId: String(configuration.sizes?.find((size) => size.is_default)?.size_id || ""),
      addonGroups,
    };
  }
  const isPizza = slugify(category?.name).includes("pizza");
  if (!isPizza) return { variants: [], defaultVariantId: "", addonGroups: [] };
  const variants = sizes.map((size) => mapSize(size, product.base_price));
  const addonGroups = [];
  if (edges.length) addonGroups.push({ id: "edges", name: "Escolha a borda", description: "Opções globais disponíveis.", required: false, min: 0, max: 1, options: edges.map(mapEdge) });
  if (additionals.length) addonGroups.push({ id: "additionals", name: "Adicionais", description: "Opções globais disponíveis.", required: false, min: 0, max: 3, options: additionals.map(mapAdditional) });
  return { variants, defaultVariantId: variants[0]?.id || "", addonGroups };
}

export function mapProducts(records, categories, options = {}) {
  const withSlugs = assignUniqueSlugs(records);
  return withSlugs.map((product) => {
    const category = categories.find((item) => String(item.id) === String(product.category_id));
    const storedConfiguration = options.configurations?.get(String(product.id));
    const configuration = storedConfiguration
      ? buildProductConfiguration(product, category, storedConfiguration)
      : buildProductConfiguration(product, category, options.sizes || [], options.edges || [], options.additionals || []);
    return {
      id: String(product.id), name: product.name, slug: product.slug,
      shortDescription: product.description || "", description: product.description || "",
      categoryId: String(product.category_id), tags: [], images: [product.image_url || fallbackProduct],
      basePriceInCents: product.base_price,
      available: product.available, featured: product.highlighted,
      addonOnly: slugify(category?.name).includes("adicion"), ...configuration,
    };
  });
}

export function mapStore(store, status = store) {
  const phone = store.phone || "";
  return {
    id: String(store.id), name: store.name, description: store.description || "",
    logo: logoImage, banner: bannerImage, bannerMobile: bannerMobileImage,
    heroPizzaBadge: pizzaBadgeImage, heroBrazilFlag: brazilFlagImage,
    address: store.address || null,
    openingHoursText: typeof store.opening_hours === "string" ? store.opening_hours : null,
    estimatedTime: store.estimated_time || null,
    minimumOrderInCents: store.min_order_value ?? 0, deliveryFeeInCents: store.delivery_fee ?? 0,
    status: status.is_open ?? store.is_open, isOpen: status.is_open ?? store.is_open,
    contact: { phone, phoneDisplay: phone || "Telefone nÃ£o informado", phoneHref: phone.replace(/\D/g, ""), whatsapp: phone.replace(/\D/g, "") },
  };
}
