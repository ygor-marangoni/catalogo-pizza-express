import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ProductConfigurator } from "@/components/catalog/ProductConfigurator";
import { CartProvider } from "@/contexts/CartContext";
import { ToastProvider } from "@/components/ui/Toast";
import { products } from "@/fixtures/catalog/products";

describe("ProductConfigurator", () => {
  it("exibe validações e adiciona depois das escolhas obrigatórias", async () => {
    const user = userEvent.setup();
    const product = products.find((item) => item.slug === "serra-dourada");
    render(<ToastProvider><CartProvider><ProductConfigurator product={product} /></CartProvider></ToastProvider>);
    const add = screen.getByRole("button", { name: /adicionar/i });
    await user.click(add);
    expect(screen.getByText(/selecione uma variação/i)).toBeInTheDocument();
    expect(screen.getByText(/escolha pelo menos 1/i)).toBeInTheDocument();
    const largeVariant = screen.getByRole("radio", { name: /grande/i });
    await user.click(screen.getByText("R$ 64,90"));
    expect(largeVariant).toBeChecked();
    await user.click(screen.getByRole("radio", { name: /média/i }));
    await user.click(screen.getByRole("radio", { name: /tradicional/i }));
    await user.click(add);
    expect(await screen.findByText(/foi adicionado ao carrinho/i)).toBeInTheDocument();
  });

  it("conclui o fluxo depois de adicionar um produto válido", async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();
    const product = products.find((item) => item.slug === "marguerita-da-casa");
    render(<ToastProvider><CartProvider storeId="product-complete-test"><ProductConfigurator product={product} onComplete={onComplete} /></CartProvider></ToastProvider>);

    await user.click(screen.getByRole("button", { name: /adicionar/i }));

    expect(onComplete).toHaveBeenCalledOnce();
    expect(onComplete).toHaveBeenCalledWith({ mode: "add" });
  });
});
