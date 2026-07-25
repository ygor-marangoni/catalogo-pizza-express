/**
 * Contrato documental da fonte de catálogo.
 * @interface
 */
export class CatalogRepository {
  async getStore() { throw new Error("Not implemented"); }
  async getCategories() { throw new Error("Not implemented"); }
  async getCategoryBySlug(_slug) { throw new Error("Not implemented"); }
  async getFeaturedProducts() { throw new Error("Not implemented"); }
  async getPopularProducts() { throw new Error("Not implemented"); }
  async getProducts(_options) { throw new Error("Not implemented"); }
  async getProductBySlug(_slug) { throw new Error("Not implemented"); }
  async searchProducts(_term) { throw new Error("Not implemented"); }
}
