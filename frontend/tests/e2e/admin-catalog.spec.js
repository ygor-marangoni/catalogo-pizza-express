import { expect, test } from "@playwright/test";

test("administrador gerencia catálogo, loja e encerra a sessão", async ({ page }) => {
  test.setTimeout(180000);
  const suffix = Date.now();
  const categoryName = `Pizza E2E ${suffix}`;
  const productName = `Pizza Teste ${suffix}`;

  await page.goto("/admin/login");
  await page.getByRole("button", { name: "Mostrar senha" }).click();
  await expect(page.getByLabel("Senha", { exact: true })).toHaveAttribute("type", "text");
  await page.getByRole("button", { name: "Ocultar senha" }).click();
  await page.getByLabel("E-mail").fill("admin@pizzaexpress.com");
  await page.getByLabel("Senha", { exact: true }).fill("Admin@123");
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page).toHaveURL(/\/admin$/);
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();

  await page.goto("/admin/categorias");
  await page.getByLabel("Nome").fill(categoryName);
  await page.getByRole("button", { name: "Salvar categoria", exact: true }).click();
  await expect(page.getByText(categoryName)).toBeVisible();

  await page.goto("/admin/produtos/novo");
  await page.getByLabel("Nome").fill(productName);
  await page.getByLabel("Descrição").fill("Produto criado pelo teste administrativo.");
  await page.getByRole("button", { name: "Categoria" }).click();
  await page.getByRole("option", { name: categoryName }).click();
  await page.getByLabel("Preço base").fill("49,90");
  await page.getByRole("checkbox", { name: /Individual/ }).check();
  await page.getByRole("checkbox", { name: /Catupiry/ }).first().check();
  await page.getByRole("checkbox", { name: /Bacon Extra/ }).first().check();
  await page.getByLabel("Destaque").check();
  await page.getByRole("button", { name: "Salvar produto" }).click();
  await expect(page).toHaveURL(/\/admin\/produtos$/);
  await expect(page.getByText(productName)).toBeVisible({ timeout: 15000 });

  await page.getByRole("link", { name: `Editar ${productName}` }).click();
  await page.getByLabel("Descrição").fill("Produto editado pelo teste administrativo.");
  await page.getByRole("button", { name: "Salvar produto" }).click();

  await page.goto("/");
  const categoryHref = await page.getByRole("link", { name: new RegExp(categoryName) }).first().getAttribute("href");
  await page.goto(categoryHref);
  await expect(page.getByText(productName)).toBeVisible({ timeout: 15000 });
  await page.getByRole("button", { name: `Personalizar ${productName}` }).click();
  await expect(page.getByRole("heading", { name: "Escolha o tamanho" })).toBeVisible();
  await expect(page.getByText("Individual", { exact: true })).toBeVisible();
  await expect(page.getByText("Catupiry", { exact: true })).toBeVisible();
  await expect(page.getByText("Bacon Extra", { exact: true })).toBeVisible();

  await page.goto("/admin/produtos");
  const row = page.getByRole("row").filter({ hasText: productName });
  await row.getByRole("button", { name: "Sim" }).first().click();

  await page.goto("/admin/loja");
  const statusButton = page.getByRole("button", { name: /^(Abrir|Fechar) loja$/ });
  const originalAction = await statusButton.textContent();
  await statusButton.click();
  await page.getByRole("button", { name: originalAction === "Abrir loja" ? "Fechar loja" : "Abrir loja" }).click();

  await page.goto("/admin/produtos");
  await page.getByRole("button", { name: `Excluir ${productName}` }).click();
  await page.getByRole("button", { name: "Excluir", exact: true }).click();
  await page.goto("/admin/categorias");
  const categoryRow = page.getByRole("row").filter({ hasText: categoryName });
  await categoryRow.getByRole("button", { name: `Excluir ${categoryName}` }).click();
  await page.getByRole("button", { name: "Excluir", exact: true }).click();

  await page.getByRole("button", { name: "Sair" }).click();
  await expect(page).toHaveURL(/\/admin\/login$/);
});
