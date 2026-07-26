import { ApiError } from "./api-error";

export function parseApiEnvelope(payload, status = 200) {
  if (!payload || typeof payload !== "object" || typeof payload.success !== "boolean") {
    throw new ApiError("Resposta inválida da API.", { status, code: "INVALID_RESPONSE" });
  }
  if (!payload.success) {
    throw new ApiError(payload.error?.message || "Não foi possível concluir a operação.", {
      status,
      code: payload.error?.code,
      field: payload.error?.field,
    });
  }
  return payload.data;
}

export function unwrapItems(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  return [];
}
