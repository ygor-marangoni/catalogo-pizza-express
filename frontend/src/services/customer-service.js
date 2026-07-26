import { del, get, post } from "@/services/api-client";

export const customerService = {
  getFavorites: () => get("/users/me/favorites"),
  addFavorite: (product_id) => post("/users/me/favorites", { product_id }),
  removeFavorite: (id) => del(`/users/me/favorites/${id}`),
  getOrders: () => get("/users/me/orders"),
  getOrder: (id) => get(`/users/me/orders/${id}`),
  createOrder: (payload) => post("/users/me/orders", payload),
};

