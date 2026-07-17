import { expect, test } from "@playwright/test";

test("fluxo crítico do cardápio e persistência do carrinho", async ({ page }, testInfo) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /a melhor/i })).toBeVisible();

  await page.locator('main a[href="/categoria/salgadas"]').click();
  await expect(page).toHaveURL(/categoria\/salgadas/);
  await expect(page.getByRole("heading", { name: "Salgadas" })).toBeVisible();

  if (testInfo.project.name === "mobile") {
    await page.getByRole("button", { name: "Abrir menu" }).click();
    const mobileSearch = page.getByRole("dialog", { name: "Menu principal" }).getByRole("searchbox");
    await mobileSearch.fill("Serra Dourada");
    await mobileSearch.press("Enter");
  } else {
    const desktopSearch = page.getByRole("search").first().getByRole("searchbox");
    await desktopSearch.fill("Serra Dourada");
    await desktopSearch.press("Enter");
  }
  await expect(page).toHaveURL(/busca\?q=Serra%20Dourada/, { timeout: 5000 });
  await page.getByRole("button", { name: /personalizar serra dourada/i }).click();
  await expect(page).toHaveURL(/produto=serra-dourada/);
  const productDialog = page.getByRole("dialog", { name: /escolha do seu jeito/i });
  await expect(productDialog).toBeVisible();
  await expect(productDialog.getByRole("heading", { level: 3, name: "Serra Dourada", exact: true })).toBeVisible();

  await page.getByText("Média · 6 fatias", { exact: true }).click();
  await page.getByText("Tradicional", { exact: true }).click();
  await page.getByText("Manjericão fresco", { exact: true }).click();
  await page.getByRole("button", { name: /adicionar/i }).click();
  await expect(page.getByText(/foi adicionado ao carrinho/i)).toBeVisible();
  await page.getByRole("button", { name: /fechar personalização/i }).click();
  await expect(page).not.toHaveURL(/produto=/);
  await expect(productDialog).not.toBeVisible();
  await expect(page.getByRole("button", { name: "Abrir carrinho com 1 item", exact: true })).toBeVisible();

  await page.goto("/carrinho");
  await expect(page.getByRole("heading", { name: "Serra Dourada" })).toBeVisible();
  await expect(page.getByText("Média · 6 fatias", { exact: true })).toBeVisible();
  await expect(page.getByText("Tradicional", { exact: true })).toHaveCount(0);
  await page.getByRole("button", { name: /aumentar quantidade/i }).click();
  await expect(page.getByRole("status")).toHaveText("2");
  await page.reload();
  await expect(page.getByRole("status")).toHaveText("2");
  await page.getByRole("button", { name: /remover serra dourada/i }).click();
  await expect(page.getByRole("heading", { name: /carrinho está vazio/i })).toBeVisible();
});
