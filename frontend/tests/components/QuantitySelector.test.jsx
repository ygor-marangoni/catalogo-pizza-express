import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { QuantitySelector } from "@/components/ui/QuantitySelector";

describe("QuantitySelector", () => {
  it("solicita aumento e respeita o mínimo", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<QuantitySelector value={1} onChange={onChange} />);
    expect(screen.getByRole("button", { name: /diminuir/i })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: /aumentar/i }));
    expect(onChange).toHaveBeenCalledWith(2);
  });
});
