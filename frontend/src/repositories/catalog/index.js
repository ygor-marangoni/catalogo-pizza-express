import banner from "../../../assets/images/banner-2.webp";
import bannerMobile from "../../../assets/images/banner-mobile.webp";
import logo from "../../../assets/images/logo.webp";
import heroPizzaBadge from "../../../assets/images/pizza.png";
import heroBrazilFlag from "../../../assets/images/brasil-bandeira.svg";
import { catalogService } from "@/services/catalog-service";

function mapStore(store) {
  const phone = store.phone || "";
  return {
    ...store,
    id: String(store.id || "pizza-express"),
    banner: banner.src,
    bannerMobile,
    logo: logo.src,
    heroPizzaBadge: heroPizzaBadge.src,
    heroBrazilFlag: heroBrazilFlag.src,
    contact: { phone, phoneDisplay: phone || "Telefone não informado", phoneHref: phone.replace(/\D/g, ""), whatsapp: phone.replace(/\D/g, "") },
  };
}

export const apiCatalogRepository = {
  async getStore() { return mapStore(await catalogService.getStore()); },
  async getCategories() { return catalogService.getCategories(); },
  async getCategoryBySlug(slug) { return Number.isInteger(Number(slug)) && Number(slug) > 0 ? catalogService.getCategoryById(Number(slug)).catch(() => null) : null; },
  async getFeaturedProducts() { return (await catalogService.getProducts({ active: true })).filter((product) => product.featured); },
  async getPopularProducts() { return catalogService.getProducts({ active: true }); },
  async getProducts(options = {}) {
    const categoryId = options.categoryId === undefined ? undefined : Number(options.categoryId);
    const products = await catalogService.getProducts({ category_id: categoryId, active: true, available: options.filter === "available" ? true : undefined });
    return categoryId === undefined ? products : products.filter((product) => product.category_id === categoryId);
  },
  async getProductBySlug(slug) { return Number.isInteger(Number(slug)) && Number(slug) > 0 ? catalogService.getProductById(Number(slug)).catch(() => null) : null; },
  async searchProducts(term) {
    const normalizedTerm = term.trim().toLocaleLowerCase("pt-BR");
    if (!normalizedTerm) return [];

    let indexedResults = [];
    try {
      indexedResults = await catalogService.searchProducts({ q: term });
    } catch {
      indexedResults = [];
    }
    const catalogProducts = await catalogService.getProducts({ available: true });
    const textResults = catalogProducts.filter((product) => [product.name, product.description, product.shortDescription]
      .filter(Boolean)
      .some((field) => field.toLocaleLowerCase("pt-BR").includes(normalizedTerm)));
    const productsById = new Map([...indexedResults, ...textResults].map((product) => [product.id, product]));
    return [...productsById.values()];
  },
};

export function getCatalogRepository() { return apiCatalogRepository; }
