import { getCatalogRepository } from "@/repositories/catalog";
import { SITE_URL } from "@/constants/site";

export default async function sitemap() {
  const repository = getCatalogRepository();
  const categories = await repository.getCategories();
  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/busca`, changeFrequency: "monthly", priority: 0.5 },
    ...categories.map((category) => ({ url: `${SITE_URL}/categoria/${category.slug}`, changeFrequency: "weekly", priority: 0.8 })),
  ];
}
