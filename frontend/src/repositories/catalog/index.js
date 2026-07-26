import { ApiCatalogRepository } from "./ApiCatalogRepository";

const repository = new ApiCatalogRepository();

export function getCatalogRepository() {
  return repository;
}
