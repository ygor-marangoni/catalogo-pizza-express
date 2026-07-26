import { get, post } from "@/services/api-client";

export async function getPublicCoupons() {
  const data = await get("/coupons/public");
  return data?.items || data || [];
}

export function validateCustomerCoupon(code, subtotal) {
  return post("/coupons/validate", { code, subtotal });
}
