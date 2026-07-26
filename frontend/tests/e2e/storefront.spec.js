import { expect, test } from "@playwright/test";

test("fluxo crítico do cardápio e persistência do carrinho", async ({ page }, testInfo) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /a melhor/i })).toBeVisible();

  const categoryLink = page.locator('main a[href^="/categoria/"]').first();
  const categoryName = await categoryLink.locator("strong").innerText();
  await categoryLink.click();
  await expect(page).toHaveURL(/categoria\/\d+/);
  await expect(page.getByRole("heading", { name: categoryName })).toBeVisible();
  await expect(page.getByLabel("Informações da loja")).toHaveCount(0);

  if (testInfo.project.name === "mobile") {
    await page.getByRole("button", { name: "Abrir menu" }).click();
    const mobileSearch = page.getByRole("dialog", { name: "Menu principal" }).getByRole("searchbox");
    await mobileSearch.fill("Margherita");
    await mobileSearch.press("Enter");
  } else {
    const desktopSearch = page.getByRole("search").first().getByRole("searchbox");
    await desktopSearch.fill("Margherita");
    await desktopSearch.press("Enter");
  }
  await expect(page).toHaveURL(/busca\?q=Margherita/, { timeout: 5000 });
  await expect(page.getByRole("heading", { level: 1, name: "Busca" })).toBeVisible();
  await expect(page.getByAltText(/banner oficial da pizza express/i)).toBeVisible();
  await expect(page.getByText("1 resultado encontrado", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Informações da loja")).toHaveCount(0);
  const searchViewport = await page.evaluate(() => ({
    contentWidth: document.documentElement.scrollWidth,
    viewportWidth: document.documentElement.clientWidth,
  }));
  expect(searchViewport.contentWidth).toBeLessThanOrEqual(searchViewport.viewportWidth);
  await page.getByRole("button", { name: /personalizar margherita/i }).click();
  await expect(page).toHaveURL(/produto=1/);
  const productDialog = page.getByRole("dialog", { name: /escolha do seu jeito/i });
  await expect(productDialog).toBeVisible();
  await expect(productDialog.getByRole("heading", { level: 3, name: "Margherita", exact: true })).toBeVisible();

  await productDialog.getByRole("radio").nth(1).check();
  await productDialog.getByRole("radio").nth(2).check();
  const addon = productDialog.getByRole("checkbox").first();
  if (await addon.count()) await addon.check();
  await page.getByRole("button", { name: /adicionar/i }).click();
  await expect(page.getByText(/foi adicionado ao carrinho/i)).toBeVisible();
  await expect(page).not.toHaveURL(/produto=/);
  await expect(productDialog).not.toBeVisible();
  await expect(page.getByRole("dialog", { name: "Seu carrinho" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Abrir carrinho com 1 item", exact: true })).toBeVisible();

  await page.goto("/carrinho");
  await expect(page.getByRole("heading", { name: "Margherita" })).toBeVisible();
  await page.getByRole("button", { name: /editar escolhas/i }).click();
  const editDialog = page.getByRole("dialog", { name: /escolha do seu jeito/i });
  await editDialog.getByLabel("Alguma observação?").fill("bem assada");
  await editDialog.getByRole("button", { name: /salvar alterações/i }).click();
  await expect(editDialog).not.toBeVisible();
  await expect(page.getByText("bem assada", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Margherita" })).toHaveCount(1);
  await page.getByRole("button", { name: /aumentar quantidade/i }).click();
  await expect(page.getByRole("status")).toHaveText("2");
  await page.reload();
  await expect(page.getByRole("status")).toHaveText("2");
  await expect(page.getByRole("button", { name: /aumentar quantidade/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /duplicar margherita/i })).toHaveCount(0);
  await page.getByRole("button", { name: /remover margherita/i }).click();
  await expect(page.getByRole("heading", { name: /carrinho está vazio/i })).toBeVisible();
});

test("sugestão da busca abre os resultados, não o painel do produto", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "O menu mobile usa o campo de busca próprio, sem lista de sugestões.");
  await page.goto("/");
  const search = page.getByRole("search").first().getByRole("searchbox");
  await search.fill("Margh");
  await expect(page.getByRole("button", { name: "Margherita", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Margherita", exact: true }).click();
  await expect(page).toHaveURL(/busca\?q=Margherita/);
  await expect(page.getByText("1 resultado encontrado", { exact: true })).toBeVisible();
  await expect(page.getByRole("dialog")).toHaveCount(0);
});
