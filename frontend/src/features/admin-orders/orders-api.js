import { apiRequest } from "@/lib/api/api-client";

export const ordersApi = {
  list: (status = "") => apiRequest(`/admin/orders${status ? `?status=${encodeURIComponent(status)}` : ""}`),
  get: (id) => apiRequest(`/admin/orders/${id}`),
  updateStatus: (id, status) => apiRequest(`/admin/orders/${id}/status`, {
    method: "PATCH",
    body: { status },
  }),
};
