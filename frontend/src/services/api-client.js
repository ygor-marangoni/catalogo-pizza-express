import { API_BASE_URL } from "@/config/api";

let accessToken = null;
let refreshRequest = null;

export class ApiError extends Error {
  constructor(message, status, code, field) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.field = field;
  }
}

export function setAccessToken(token) { accessToken = token || null; }
export function getAccessToken() { return accessToken; }

async function parseResponse(response) {
  const body = await response.json().catch(() => null);
  if (!response.ok || body?.success === false) {
    throw new ApiError(body?.error?.message || "Não foi possível concluir a operação.", response.status, body?.error?.code, body?.error?.field);
  }
  return body?.data ?? body;
}

async function refresh() {
  if (!refreshRequest) {
    refreshRequest = fetch(`${API_BASE_URL}/auth/refresh`, { method: "POST", credentials: "include" })
      .then(parseResponse)
      .then((data) => { setAccessToken(data.token); return data.token; })
      .finally(() => { refreshRequest = null; });
  }
  return refreshRequest;
}

export async function apiRequest(path, options = {}, canRefresh = true) {
  const headers = new Headers(options.headers || {});
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);
  if (!(options.body instanceof FormData) && options.body !== undefined) headers.set("Content-Type", "application/json");
  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers, credentials: "include" });
  if (response.status === 401 && canRefresh && !path.includes("/auth/")) {
    try { await refresh(); return apiRequest(path, options, false); } catch { setAccessToken(null); }
  }
  return parseResponse(response);
}

export const get = (path, options) => apiRequest(path, { ...options, method: "GET" });
export const post = (path, body, options) => apiRequest(path, { ...options, method: "POST", body: body instanceof FormData ? body : JSON.stringify(body) });
export const put = (path, body, options) => apiRequest(path, { ...options, method: "PUT", body: body instanceof FormData ? body : JSON.stringify(body) });
export const patch = (path, body, options) => apiRequest(path, { ...options, method: "PATCH", body: JSON.stringify(body) });
export const del = (path, options) => apiRequest(path, { ...options, method: "DELETE" });

