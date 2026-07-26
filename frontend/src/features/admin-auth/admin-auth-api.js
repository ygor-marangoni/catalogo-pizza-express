import { apiRequest, setAccessToken } from "@/lib/api/api-client";
import { ApiError } from "@/lib/api/api-error";

export async function loginAdmin(email, password) {
  const data = await apiRequest("/auth/login", { method: "POST", body: { email, password }, skipAuth: true, skipRefresh: true });
  if (data.role !== "ADMIN") {
    await logoutAdmin();
    throw new ApiError("Esta conta não possui acesso administrativo.", { status: 403, code: "FORBIDDEN" });
  }
  setAccessToken(data.token);
  return getCurrentAdmin();
}
export async function getCurrentAdmin() { return apiRequest("/auth/me"); }
export async function restoreAdminSession() {
  const data = await apiRequest("/auth/refresh", { method: "POST", skipAuth: true, skipRefresh: true });
  if (data.role !== "ADMIN") throw new ApiError("Acesso restrito a administradores.", { status: 403 });
  setAccessToken(data.token);
  return getCurrentAdmin();
}
export async function logoutAdmin() {
  try { await apiRequest("/auth/logout", { method: "POST", skipAuth: true, skipRefresh: true }); }
  finally { setAccessToken(null); }
}
