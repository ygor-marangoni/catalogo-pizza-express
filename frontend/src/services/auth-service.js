import { get, post, put, setAccessToken } from "@/services/api-client";

export const authService = {
  async login(credentials) { const data = await post("/auth/login", credentials); setAccessToken(data.token); return data; },
  async register(data) { return post("/auth/user/register", data); },
  async refresh() { const data = await post("/auth/refresh"); setAccessToken(data.token); return data; },
  async me() { return get("/users/me"); },
  async updateMe(body) { return put("/users/me", body); },
};
