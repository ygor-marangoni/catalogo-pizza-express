import { LocalCatalogRepository } from "./LocalCatalogRepository";
import { ApiCatalogRepository } from "./ApiCatalogRepository";

const repositories = {
  local: new LocalCatalogRepository(),
  api: new ApiCatalogRepository(),
};

/**
 * Troca a origem por configuração sem expor a implementação à interface.
 * A fonte é explícita: não há fallback silencioso entre API e fixtures.
 */
export function getCatalogRepository() {
  const source = process.env.CATALOG_SOURCE || "local";
  if (!repositories[source]) throw new Error(`Fonte de catálogo não suportada: ${source}`);
  return repositories[source];
}
