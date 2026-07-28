import { apiRequest, setAccessToken } from "@/lib/api/api-client";
import { ApiError } from "@/lib/api/api-error";
import { adminAuthStorage } from "./admin-auth-storage";

export async function loginAdmin(email, password) {
  const data = await apiRequest("/auth/login", { method: "POST", body: { email, password }, skipAuth: true, skipRefresh: true });
  if (data.role !== "ADMIN") {
    await logoutAdmin();
    throw new ApiError("Esta conta não possui acesso administrativo.", { status: 403, code: "FORBIDDEN" });
  }
  setAccessToken(data.token);
  adminAuthStorage.set(data.token);
  return getCurrentAdmin();
}
export async function getCurrentAdmin() { return apiRequest("/auth/me"); }
export async function restoreAdminSession() {
  const storedToken = adminAuthStorage.get();
  if (storedToken) {
    setAccessToken(storedToken);
    try { return await getCurrentAdmin(); }
    catch { adminAuthStorage.clear(); setAccessToken(null); }
  }
  const data = await apiRequest("/auth/refresh", { method: "POST", skipAuth: true, skipRefresh: true });
  if (data.role !== "ADMIN") throw new ApiError("Acesso restrito a administradores.", { status: 403 });
  setAccessToken(data.token);
  adminAuthStorage.set(data.token);
  return getCurrentAdmin();
}
export async function logoutAdmin() {
  try { await apiRequest("/auth/logout", { method: "POST", skipAuth: true, skipRefresh: true }); }
  finally { adminAuthStorage.clear(); setAccessToken(null); }
}
