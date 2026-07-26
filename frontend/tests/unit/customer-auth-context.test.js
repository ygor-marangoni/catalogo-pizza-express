import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useCustomerAuth } from "@/contexts/CustomerAuthContext";

describe("CustomerAuthContext", () => {
  it("mantém o SSR estável enquanto o provider é atualizado pelo Fast Refresh", () => {
    const { result } = renderHook(() => useCustomerAuth());

    expect(result.current.account).toBeNull();
    expect(result.current.loading).toBe(true);
  });
});
