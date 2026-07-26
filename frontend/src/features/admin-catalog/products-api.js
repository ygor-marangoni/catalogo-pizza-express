import { createResourceApi } from "./resource-api";
import { apiRequest } from "@/lib/api/api-client";
const base = createResourceApi("/products");
function toFormData(values) {
  const form = new FormData();
  Object.entries(values).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") form.append(key, value);
  });
  return form;
}
export const productsApi = {
  ...base,
  create: (values) => base.create(toFormData(values)),
  update: (id, values) => base.update(id, toFormData(values)),
  getConfiguration: (id) => apiRequest(`/products/${id}/configuration`),
  updateConfiguration: (id, configuration) => apiRequest(`/products/${id}/configuration`, { method: "PUT", body: configuration }),
};
