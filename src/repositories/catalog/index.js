import { LocalCatalogRepository } from "./LocalCatalogRepository";

const repositories = {
  local: new LocalCatalogRepository(),
};

/**
 * Troca a origem por configuração sem expor a implementação à interface.
 * Somente `local` é permitido na Entrega 1.
 */
export function getCatalogRepository() {
  const source = process.env.CATALOG_SOURCE || "local";
  if (!repositories[source]) throw new Error(`Fonte de catálogo não suportada: ${source}`);
  return repositories[source];
}
