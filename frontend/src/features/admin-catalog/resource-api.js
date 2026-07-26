import { apiRequest } from "@/lib/api/api-client";
import { unwrapItems } from "@/lib/api/api-response";

export function createResourceApi(path) {
  return {
    list: async () => unwrapItems(await apiRequest(`${path}?limit=100`)),
    get: (id) => apiRequest(`${path}/${id}`),
    create: (body) => apiRequest(path, { method: "POST", body }),
    update: (id, body) => apiRequest(`${path}/${id}`, { method: "PUT", body }),
    remove: (id) => apiRequest(`${path}/${id}`, { method: "DELETE" }),
  };
}
