import { apiRequest } from "@/lib/api/api-client";
import { unwrapItems } from "@/lib/api/api-response";

export async function getPublicCoupons() {
  return unwrapItems(await apiRequest("/coupons/public", {
    skipAuth: true,
    skipRefresh: true,
  }));
}
