import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CustomerAuthProvider, useCustomerAuth } from "@/contexts/CustomerAuthContext";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ replace: vi.fn() }),
}));

vi.mock("@/services/auth-service", () => ({
  authService: { refresh: vi.fn(() => new Promise(() => {})) },
}));

describe("CustomerAuthContext", () => {
  it("mantém o SSR estável enquanto o provider é atualizado pelo Fast Refresh", () => {
    const { result } = renderHook(() => useCustomerAuth(), { wrapper: CustomerAuthProvider });

    expect(result.current.account).toBeNull();
    expect(result.current.loading).toBe(true);
  });
});
