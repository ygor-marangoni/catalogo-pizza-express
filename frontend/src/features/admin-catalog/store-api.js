import { apiRequest } from "@/lib/api/api-client";
export const storeApi = {
  get: () => apiRequest("/store"),
  update: (body) => apiRequest("/store", { method: "PUT", body }),
  getStatus: () => apiRequest("/store/status"),
  updateStatus: (is_open) => apiRequest("/store/status", { method: "PUT", body: { is_open } }),
};
