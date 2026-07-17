import { categories } from "@/fixtures/catalog/categories";
import { products } from "@/fixtures/catalog/products";
import { store } from "@/fixtures/catalog/store";
import { productMatchesSearch, sortProducts } from "@/features/catalog/catalog-domain";

export class LocalCatalogRepository {
  async getStore() {
    return structuredClone(store);
  }

  async getCategories() {
    return structuredClone(categories.filter((category) => category.active).sort((a, b) => a.sortOrder - b.sortOrder));
  }

  /** @param {string} slug */
  async getCategoryBySlug(slug) {
    const category = categories.find((item) => item.active && item.slug === slug);
    return category ? structuredClone(category) : null;
  }

  async getFeaturedProducts() {
    return structuredClone(products.filter((product) => product.active && product.featured));
  }

  async getPopularProducts() {
    return structuredClone(products.filter((product) => product.active && product.popular));
  }

  /** @param {{categoryId?: string, filter?: string, order?: string}} options */
  async getProducts(options = {}) {
    let result = products.filter((product) => product.active);
    if (options.categoryId) result = result.filter((product) => product.categoryId === options.categoryId);
    if (options.filter === "available") result = result.filter((product) => product.available);
    if (options.filter === "promotions") result = result.filter((product) => product.compareAtPriceInCents > product.basePriceInCents);
    return structuredClone(sortProducts(result, options.order));
  }

  /** @param {string} slug */
  async getProductBySlug(slug) {
    const product = products.find((item) => item.active && item.slug === slug);
    return product ? structuredClone(product) : null;
  }

  /** @param {string} term */
  async searchProducts(term) {
    return structuredClone(products.filter((product) => product.active && productMatchesSearch(product, term, categories)));
  }
}
