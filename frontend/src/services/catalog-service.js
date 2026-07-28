import { del, get, patch, post, put } from "@/services/api-client";

const unwrapItems = (data) => data?.items || data || [];
const mapProduct = (item) => {
  const sizes = item.sizes || [];
  const edges = item.edges || [];
  const additionals = item.additionals || [];
  const variants = sizes.map((size) => ({ id: String(size.id), sourceId: size.id, name: size.name, description: size.description || "", priceInCents: item.base_price + Number(size.additional_price || 0) }));
  const addonGroups = [
    edges.length ? { id: "edges", name: "Escolha a borda", min: 0, max: 1, required: false, options: edges.map((edge) => ({ id: String(edge.id), sourceId: edge.id, name: edge.name, priceInCents: edge.additional_price || 0 })) } : null,
    additionals.length ? { id: "additionals", name: "Adicionais", min: 0, max: additionals.length, required: false, options: additionals.map((additional) => ({ id: String(additional.id), sourceId: additional.id, name: additional.name, priceInCents: additional.price || 0 })) } : null,
  ].filter(Boolean);
  return { ...item, categoryId: item.category_id, basePriceInCents: item.base_price, shortDescription: item.description || "", slug: String(item.id), images: item.image_url ? [item.image_url] : [], available: item.available !== false, featured: item.highlighted === true, isCombo: item.is_combo === true, variants, addonGroups };
};
const mapCategory = (item) => ({ ...item, slug: String(item.id), image: item.icon_url || null });

export const catalogService = {
  async getStore() { return get("/store"); },
  async getStoreStatus() { return get("/store/status"); },
  async getCategoriesPage(params = {}) { const query = new URLSearchParams(Object.entries({ limit: 12, ...params }).filter(([, value]) => value !== undefined && value !== "")); const data = await get(`/categories?${query}`); return { ...data, items: unwrapItems(data).map(mapCategory) }; },
  async getCategories() { return (await this.getCategoriesPage({ limit: 100 })).items; },
  async getCategoryById(id) { return mapCategory(await get(`/categories/${id}`)); },
  async getProductsPage(params = {}) { const query = new URLSearchParams(Object.entries(params).filter(([, value]) => value !== undefined && value !== "")); const data = await get(`/products?${query}`); return { ...data, items: unwrapItems(data).map(mapProduct) }; },
  async getProducts(params = {}) { return (await this.getProductsPage({ limit: 100, ...params })).items; },
  async getProductById(id) { return mapProduct(await get(`/products/${id}`)); },
  async searchProducts(params = {}) { const query = new URLSearchParams(Object.entries(params).filter(([, value]) => value !== undefined && value !== "")); return unwrapItems(await get(`/products/search?${query}`)).map(mapProduct); },
  async getAdditionals() { return unwrapItems(await get("/additionals")); },
  async getEdges() { return unwrapItems(await get("/edges")); },
  async getSizes() { return unwrapItems(await get("/sizes")); },
  createCategory: (body) => post("/categories", body),
  updateCategory: (id, body) => put(`/categories/${id}`, body),
  deleteCategory: (id) => del(`/categories/${id}`),
  createProduct: (body) => post("/products", body),
  updateProduct: (id, body) => put(`/products/${id}`, body),
  deleteProduct: (id) => del(`/products/${id}`),
  createAdditional: (body) => post("/additionals", body),
  updateAdditional: (id, body) => put(`/additionals/${id}`, body),
  deleteAdditional: (id) => del(`/additionals/${id}`),
  createEdge: (body) => post("/edges", body),
  updateEdge: (id, body) => put(`/edges/${id}`, body),
  deleteEdge: (id) => del(`/edges/${id}`),
  createSize: (body) => post("/sizes", body),
  updateSize: (id, body) => put(`/sizes/${id}`, body),
  deleteSize: (id) => del(`/sizes/${id}`),
  updateStore: (body) => put("/store", body),
  updateStoreStatus: (is_open) => put("/store/status", { is_open }),
  getAdminOrders: (status) => get(`/admin/orders${status ? `?status=${encodeURIComponent(status)}` : ""}`),
  updateAdminOrderStatus: (id, status) => patch(`/admin/orders/${id}/status`, { status }),
};
