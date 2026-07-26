import { cache } from "react";
import { apiRequest } from "@/lib/api/api-client";
import { unwrapItems } from "@/lib/api/api-response";
import { isAddonOnlyProduct, productMatchesSearch, sortProducts } from "@/features/catalog/catalog-domain";
import { mapCategories, mapProducts, mapStore } from "./catalog-mappers";

const loadCatalogRequest = cache(async () => {
  const [categoryData, productData, configurationData] = await Promise.all([
    apiRequest("/categories?limit=100", { skipAuth: true }),
    apiRequest("/products?limit=100", { skipAuth: true }),
    apiRequest("/products/configurations", { skipAuth: true }),
  ]);
  const rawCategories = unwrapItems(categoryData);
  const categories = mapCategories(rawCategories);
  const configurations = new Map(
    unwrapItems(configurationData).map((configuration) => [String(configuration.product_id), configuration]),
  );
  const products = mapProducts(unwrapItems(productData), rawCategories, { configurations });
  return { categories, products };
});

const loadStoreRequest = cache(async () => {
  const [store, status] = await Promise.all([
    apiRequest("/store", { skipAuth: true }),
    apiRequest("/store/status", { skipAuth: true }),
  ]);
  return mapStore(store, status);
});

export class ApiCatalogRepository {
  async loadCatalog() {
    return loadCatalogRequest();
  }
  async getStore() {
    return loadStoreRequest();
  }
  async getCategories() { return (await this.loadCatalog()).categories; }
  async getCategoryBySlug(slug) { return (await this.getCategories()).find((item) => item.slug === slug) || null; }
  async getFeaturedProducts() { return (await this.loadCatalog()).products.filter((item) => !isAddonOnlyProduct(item) && item.featured); }
  async getPopularProducts() { return (await this.loadCatalog()).products.filter((item) => !isAddonOnlyProduct(item) && item.featured); }
  async getProducts(options = {}) {
    let { products } = await this.loadCatalog();
    products = products.filter((item) => !isAddonOnlyProduct(item));
    if (options.categoryId) products = products.filter((item) => item.categoryId === String(options.categoryId));
    if (options.filter === "available") products = products.filter((item) => item.available);
    return sortProducts(products, options.order);
  }
  async getProductBySlug(slug) { return (await this.loadCatalog()).products.find((item) => !isAddonOnlyProduct(item) && item.slug === slug) || null; }
  async searchProducts(term) {
    try {
      const [data, catalog] = await Promise.all([apiRequest(`/products/search?q=${encodeURIComponent(term)}`, { skipAuth: true }), this.loadCatalog()]);
      const ids = new Set(unwrapItems(data).map((item) => String(item.id)));
      return catalog.products.filter((item) => !isAddonOnlyProduct(item) && ids.has(item.id));
    } catch (error) {
      if (error.status !== 503) throw error;
      const { products, categories } = await this.loadCatalog();
      return products.filter((product) => !isAddonOnlyProduct(product) && productMatchesSearch(product, term, categories));
    }
  }
}
