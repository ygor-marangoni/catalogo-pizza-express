import { expect, test } from "@playwright/test";

const viewports = [320, 375, 768, 1024, 1280, 1440];

test("home e produto não criam rolagem horizontal nos breakpoints de aceite", async ({ page }, testInfo) => {
  test.setTimeout(90000);
  test.skip(testInfo.project.name !== "chromium", "Matriz responsiva executada uma vez no Chromium.");
  for (const width of viewports) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: /a melhor/i })).toBeVisible();
    const homeMetrics = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      offenders: [...document.querySelectorAll("body *")].filter((element) => {
        const rect = element.getBoundingClientRect();
        return rect.right > document.documentElement.clientWidth + 1 || rect.left < -1;
      }).slice(0, 5).map((element) => ({ tag: element.tagName, className: element.className, right: Math.round(element.getBoundingClientRect().right) })),
    }));
    expect(homeMetrics.scrollWidth, `Home em ${width}px: largura total ${homeMetrics.scrollWidth}px; ${JSON.stringify(homeMetrics.offenders)}`).toBeLessThanOrEqual(homeMetrics.clientWidth);
    await page.goto("/?produto=serra-dourada", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("dialog", { name: /escolha do seu jeito/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /adicionar/i })).toBeVisible();
    const productMetrics = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      offenders: [...document.querySelectorAll("body *")].filter((element) => {
        const rect = element.getBoundingClientRect();
        return rect.right > document.documentElement.clientWidth + 1 || rect.left < -1;
      }).slice(0, 5).map((element) => ({ tag: element.tagName, className: element.className, right: Math.round(element.getBoundingClientRect().right) })),
    }));
    expect(productMetrics.scrollWidth, `Produto em ${width}px: largura total ${productMetrics.scrollWidth}px; ${JSON.stringify(productMetrics.offenders)}`).toBeLessThanOrEqual(productMetrics.clientWidth);
  }
});

test("drawer e modal fecham com Escape", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /abrir carrinho/i }).click();
  await expect(page.getByRole("dialog", { name: "Seu carrinho" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "Seu carrinho" })).toBeHidden();

  if (test.info().project.name === "chromium") {
    await page.getByRole("button", { name: "Cupons" }).click();
    await expect(page.getByRole("dialog", { name: "Disponível em breve" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog", { name: "Disponível em breve" })).toBeHidden();
  }
});

test("carrinho mobile ocupa toda a viewport desde o primeiro pixel", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "Comportamento exclusivo do carrinho mobile.");
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  const scrollBefore = await page.evaluate(() => {
    const previousBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo(0, 500);
    document.documentElement.style.scrollBehavior = previousBehavior;
    return window.scrollY;
  });
  await page.getByRole("button", { name: /abrir carrinho/i }).click();

  const drawer = page.getByRole("dialog", { name: "Seu carrinho" });
  await expect(drawer).toBeVisible();
  await expect.poll(async () => Math.round((await drawer.boundingBox()).x)).toBe(0);
  const bounds = await drawer.boundingBox();

  expect(bounds).not.toBeNull();
  expect(Math.abs(bounds.x)).toBeLessThan(0.5);
  expect(bounds.y).toBe(0);
  expect(bounds.width).toBe(375);
  expect(bounds.height).toBe(812);

  const scrollLock = await page.evaluate(() => ({
    documentOverflow: getComputedStyle(document.documentElement).overflow,
    bodyOverflow: getComputedStyle(document.body).overflow,
    scrollY: window.scrollY,
    drawerOverflow: getComputedStyle(document.querySelector('[role="dialog"][aria-label="Seu carrinho"]')).overflowY,
  }));
  expect(scrollLock.documentOverflow).toBe("hidden");
  expect(scrollLock.bodyOverflow).toBe("hidden");
  expect(scrollLock.scrollY).toBe(scrollBefore);
  expect(scrollLock.drawerOverflow).toBe("auto");

  await drawer.getByRole("button", { name: "Fechar carrinho" }).click();
  expect(await page.evaluate(() => window.scrollY)).toBe(scrollBefore);
});

test("header mobile oferece menu, busca, categorias e carrinho", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "Comportamento exclusivo do header mobile.");
  await page.goto("/");

  await expect(page.getByRole("button", { name: /abrir carrinho/i })).toBeVisible();
  await page.getByRole("button", { name: "Abrir menu" }).click();

  const menu = page.getByRole("dialog", { name: "Menu principal" });
  await expect(menu).toBeVisible();
  await expect(menu.getByText("Pizza Express", { exact: true })).toBeVisible();
  await expect(menu.getByRole("button", { name: /entrega/i })).toBeVisible();
  await expect(menu.getByRole("link", { name: "Salgadas" })).toBeVisible();
  await expect(menu.getByRole("button", { name: /minha conta/i })).toBeVisible();
  await expect(menu.getByText("Rua Avenida Paranaíba, 407 - Boa Vista - Monte Carmelo/MG")).toBeVisible();
  await expect(menu.getByRole("link", { name: /Rua Avenida/i })).toHaveCount(0);

  await menu.getByRole("searchbox").fill("Serra Dourada");
  await menu.getByRole("searchbox").press("Enter");
  await expect(page).toHaveURL(/busca\?q=Serra%20Dourada/);
  await expect(menu).toBeHidden();
});

test("somente o header utiliza sombra", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /a melhor/i })).toBeVisible();

  const offenders = await page.evaluate(() => [...document.querySelectorAll("body *")]
    .filter((element) => !element.closest("header") && getComputedStyle(element).boxShadow !== "none")
    .map((element) => ({ tag: element.tagName, className: element.className })));

  expect(offenders).toEqual([]);
});

test("home hidrata sem erros no console ou exceções de página", async ({ page }) => {
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
    if (message.type() === "warning" && /has "fill" and parent element with invalid "position"/i.test(message.text())) errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto("/");
  await expect(page.getByRole("heading", { name: /a melhor/i })).toBeVisible();
  const storeInfo = page.getByLabel("Informações da loja");
  await expect(storeInfo.getByText(/Hoje: \d{2}:\d{2} - \d{2}:\d{2}/)).toBeVisible();
  await expect(storeInfo.getByText(/^(Aberto|Fechado)$/)).toBeVisible();
  await expect(storeInfo.getByText("Entrega", { exact: true })).toBeVisible();
  await expect(storeInfo.getByText("Retirada", { exact: true })).toBeVisible();
  await expect(storeInfo.getByText(/Estimativa: 60–70 min/)).toBeVisible();
  const titleBox = await page.getByRole("heading", { name: /a melhor/i }).boundingBox();
  const servicesBox = await storeInfo.getByLabel("Modalidades e tempo estimado").boundingBox();
  expect(servicesBox.y).toBeGreaterThan(titleBox.y + titleBox.height);
  await page.waitForTimeout(500);

  expect(errors).toEqual([]);
});

test("categorias exibem o próximo card parcialmente no mobile", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "Comportamento exclusivo do carrossel mobile.");
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");

  const rail = page.getByLabel("Categorias do cardápio");
  await expect(rail).toBeVisible();
  const cards = rail.locator(":scope > *");
  const first = await cards.nth(0).boundingBox();
  const second = await cards.nth(1).boundingBox();

  expect(first).not.toBeNull();
  expect(second).not.toBeNull();
  expect(second.x).toBeLessThan(375);
  expect(second.x).toBeGreaterThan(first.x + first.width);
});

test("carrosséis usam cards uniformes e controles coerentes no desktop", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Validação visual exclusiva do desktop.");
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  const labels = ["Destaques", "Adicionais", "Combos"];
  const firstCardWidths = [];
  for (const label of labels) {
    const rail = page.getByLabel(`${label}: produtos`);
    await expect(rail).toBeVisible();
    const cards = rail.locator(":scope > article");
    const widths = await cards.evaluateAll((elements) => elements.map((element) => Math.round(element.getBoundingClientRect().width)));
    expect(new Set(widths).size).toBe(1);
    firstCardWidths.push(widths[0]);
  }
  expect(new Set(firstCardWidths).size).toBe(1);

  const highlightsControls = page.getByLabel("Controles de Destaques");
  await expect(highlightsControls.getByRole("button", { name: "Produtos anteriores" })).toBeDisabled();
  await expect(highlightsControls.getByRole("button", { name: "Próximos produtos" })).toBeEnabled();

  const additionsControls = page.getByLabel("Controles de Adicionais");
  await expect(additionsControls.getByRole("button", { name: "Produtos anteriores" })).toBeDisabled();
  await expect(additionsControls.getByRole("button", { name: "Próximos produtos" })).toBeDisabled();

  const comboControls = page.getByLabel("Controles de Combos");
  await expect(comboControls.getByRole("button", { name: "Produtos anteriores" })).toBeDisabled();
  await expect(comboControls.getByRole("button", { name: "Próximos produtos" })).toBeDisabled();
});

test("slider da promoção de aniversário alterna os registros de clientes", async ({ page }) => {
  await page.goto("/");

  const promotion = page.locator("section").filter({ has: page.getByRole("heading", { name: "Aniversário é com a Pizza Express" }) });
  await expect(promotion).toBeVisible();
  await expect(promotion.getByAltText(/registro 1 de 8/i)).toBeVisible();
  await promotion.getByRole("button", { name: "Mostrar depoimento 2" }).click();
  await expect(promotion.getByAltText(/registro 2 de 8/i)).toBeVisible();
  await page.mouse.move(0, 0);
  await expect(promotion.getByAltText(/registro 3 de 8/i)).toBeVisible({ timeout: 5000 });
});

test("tolera atributos inseridos no html por extensões do navegador", async ({ page }) => {
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));

  await page.route("http://127.0.0.1:3000/", async (route) => {
    const response = await route.fetch();
    const html = (await response.text()).replace(
      "<html",
      '<html data-lt-installed="true" suppresshydrationwarning="true"',
    );
    await route.fulfill({ response, body: html });
  });

  await page.goto("/");
  await expect(page.getByRole("heading", { name: /a melhor/i })).toBeVisible();
  await page.waitForTimeout(500);

  const hydrationErrors = errors.filter((message) => !(
    message.includes("webpack-hmr") && message.includes("ERR_BLOCKED_BY_LOCAL_NETWORK_ACCESS_CHECKS")
  ));
  expect(hydrationErrors).toEqual([]);
});
