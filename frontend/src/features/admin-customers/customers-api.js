import { apiRequest } from "@/lib/api/api-client";

export const customersApi = {
  list: (search = "") => apiRequest(`/admin/customers${search ? `?search=${encodeURIComponent(search)}` : ""}`),
  get: (id) => apiRequest(`/admin/customers/${id}`),
  create: (body) => apiRequest("/admin/customers", { method: "POST", body }),
  update: (id, body) => apiRequest(`/admin/customers/${id}`, { method: "PUT", body }),
  remove: (id) => apiRequest(`/admin/customers/${id}`, { method: "DELETE" }),
};
