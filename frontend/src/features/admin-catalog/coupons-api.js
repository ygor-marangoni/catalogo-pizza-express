import { apiRequest } from "@/lib/api/api-client";
import { unwrapItems } from "@/lib/api/api-response";

export const couponsApi = {
  list: async () => unwrapItems(await apiRequest("/coupons?limit=100")),
  create: (body) => apiRequest("/coupons", { method: "POST", body }),
  update: (id, body) => apiRequest(`/coupons/${id}`, { method: "PUT", body }),
  remove: (id) => apiRequest(`/coupons/${id}`, { method: "DELETE" }),
  validate: (code, subtotal) => apiRequest("/coupons/validate", {
    method: "POST",
    skipAuth: true,
    skipRefresh: true,
    body: { code, subtotal },
  }),
};
