import { StorefrontShell } from "@/components/layout/StorefrontShell";
import { getCatalogRepository } from "@/repositories/catalog";

export const dynamic = "force-dynamic";

export default async function StorefrontLayout({ children }) {
  const repository = getCatalogRepository();
  const [store, suggestions, categories] = await Promise.all([
    repository.getStore(),
    repository.getProducts(),
    repository.getCategories(),
  ]);
  const headerStore = {
    name: store.name,
    logo: store.logo,
    description: store.description,
    address: store.address,
    deliveryFeeInCents: store.deliveryFeeInCents,
  };
  const searchSuggestions = suggestions
    .filter((product) => product.available)
    .map(({ id, name, slug }) => ({ id, name, slug }));
  const productIndex = suggestions.map(({ id, slug }) => ({ id, slug }));
  const localProducts = (process.env.CATALOG_SOURCE || "local") === "local" ? suggestions : null;

  return <StorefrontShell
    store={store}
    headerStore={headerStore}
    productIndex={productIndex}
    localProducts={localProducts}
    searchSuggestions={searchSuggestions}
    categories={categories}
  >
    {children}
  </StorefrontShell>;
}
