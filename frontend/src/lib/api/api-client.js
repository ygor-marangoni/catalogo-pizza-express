import { ApiError } from "./api-error";
import { parseApiEnvelope } from "./api-response";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";
let accessToken = null;
let refreshPromise = null;
let sessionExpiredHandler = null;

export function setAccessToken(token) { accessToken = token || null; }
export function getAccessToken() { return accessToken; }
export function onSessionExpired(handler) { sessionExpiredHandler = handler; }

async function readResponse(response) {
  if (response.status === 204) return null;
  const text = await response.text();
  if (!text) return null;
  try { return parseApiEnvelope(JSON.parse(text), response.status); }
  catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError("A API retornou JSON inválido.", { status: response.status, code: "INVALID_JSON", cause: error });
  }
}

export async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = apiRequest("/auth/refresh", { method: "POST", skipAuth: true, skipRefresh: true })
      .then((data) => {
        if (data?.role !== "ADMIN") throw new ApiError("Acesso restrito a administradores.", { status: 403, code: "FORBIDDEN" });
        setAccessToken(data.token);
        return data.token;
      })
      .finally(() => { refreshPromise = null; });
  }
  return refreshPromise;
}

export async function apiRequest(path, options = {}) {
  const { body, headers: customHeaders, skipAuth = false, skipRefresh = false, ...fetchOptions } = options;
  const headers = new Headers(customHeaders);
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  if (body != null && !isFormData && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  if (!skipAuth && accessToken) headers.set("Authorization", `Bearer ${accessToken}`);

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      cache: "no-store",
      credentials: "include",
      ...fetchOptions,
      headers,
      body: body == null || isFormData ? body : JSON.stringify(body),
    });
  } catch (cause) {
    throw new ApiError("API indisponível. Verifique sua conexão.", { code: "API_OFFLINE", cause });
  }

  if (response.status === 401 && !skipAuth && !skipRefresh) {
    try {
      await refreshAccessToken();
      return apiRequest(path, { ...options, skipRefresh: true });
    } catch (error) {
      setAccessToken(null);
      sessionExpiredHandler?.();
      throw error;
    }
  }
  return readResponse(response);
}
