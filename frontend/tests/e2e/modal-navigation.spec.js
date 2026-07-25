import { expect, test } from "@playwright/test";

test("modal preserva scroll e acompanha voltar, avançar e recarregar", async ({ page }) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: /personalizar marguerita da casa/i });
  await trigger.scrollIntoViewIfNeeded();
  const scrollBefore = await page.evaluate(() => window.scrollY);

  await trigger.click();
  await expect(page).toHaveURL(/produto=marguerita-da-casa/);
  await expect(page.getByRole("dialog", { name: /escolha do seu jeito/i })).toBeVisible();
  expect(Math.abs((await page.evaluate(() => window.scrollY)) - scrollBefore)).toBeLessThanOrEqual(2);

  await page.goBack();
  await expect(page.getByRole("dialog", { name: /escolha do seu jeito/i })).toBeHidden();
  await page.goForward();
  await expect(page.getByRole("dialog", { name: /escolha do seu jeito/i })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("dialog", { name: /escolha do seu jeito/i })).toBeVisible();

  await page.getByRole("button", { name: /fechar personalização/i }).click();
  await expect(page).not.toHaveURL(/produto=/);
});

test("slug inexistente não interrompe a home", async ({ page }) => {
  await page.goto("/?produto=slug-inexistente");
  await expect(page.getByRole("heading", { name: /a melhor/i })).toBeVisible();
  await expect(page.getByRole("dialog")).toHaveCount(0);
});
