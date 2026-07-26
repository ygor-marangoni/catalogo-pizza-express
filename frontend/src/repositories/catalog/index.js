import banner from "../../../assets/images/banner-2.webp";
import bannerMobile from "../../../assets/images/banner-mobile.webp";
import logo from "../../../assets/images/logo.webp";
import heroPizzaBadge from "../../../assets/images/pizza.png";
import heroBrazilFlag from "../../../assets/images/brasil-bandeira.svg";
import { catalogService } from "@/services/catalog-service";

function mapStore(store) {
  const hoursMatch = typeof store.opening_hours === "string"
    ? store.opening_hours.match(/(\d{1,2}:\d{2})\s*(?:às|-|a)\s*(\d{1,2}:\d{2})/i)
    : null;
  const businessHours = hoursMatch
    ? ["sun", "mon", "tue", "wed", "thu", "fri", "sat"].map((day) => ({ day, open: hoursMatch[1], close: hoursMatch[2] }))
    : [];
  return {
    ...store,
    id: String(store.id || "pizza-express"),
    banner: banner.src,
    bannerMobile,
    logo: logo.src,
    heroPizzaBadge: heroPizzaBadge.src,
    heroBrazilFlag: heroBrazilFlag.src,
    businessHours,
    timeZone: "America/Sao_Paulo",
    deliveryEnabled: true,
    pickupEnabled: true,
    estimatedTime: null,
    contact: { whatsapp: store.phone || "" },
  };
}

export const apiCatalogRepository = {
  async getStore() { return mapStore(await catalogService.getStore()); },
  async getCategories() { return catalogService.getCategories(); },
  async getCategoryBySlug(slug) { return (await catalogService.getCategories()).find((category) => category.slug === slug) || null; },
  async getFeaturedProducts() { return (await catalogService.getProducts({ active: true })).filter((product) => product.featured); },
  async getPopularProducts() { return catalogService.getProducts({ active: true }); },
  async getProducts(options = {}) {
    const categoryId = options.categoryId === undefined ? undefined : Number(options.categoryId);
    const products = await catalogService.getProducts({ category_id: categoryId, active: true, available: options.filter === "available" ? true : undefined });
    return categoryId === undefined ? products : products.filter((product) => product.category_id === categoryId);
  },
  async getProductBySlug(slug) { const products = await catalogService.getProducts({ active: true }); return products.find((product) => product.slug === slug) || null; },
  async searchProducts(term) { return catalogService.searchProducts({ q: term }); },
};

export function getCatalogRepository() { return apiCatalogRepository; }
