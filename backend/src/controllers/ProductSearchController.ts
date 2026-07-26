import { ErrorCode } from "../entities/enums";
const AppError = require("../exceptions/AppError");
import { services } from "../config/containerConfig";

class ProductSearchController {
  constructor(private readonly searchService: any) {}

  private async databaseSearch(req, query: string) {
    const candidates = await services.product.getAllProducts({
      category_id: req.query.category_id ? Number(req.query.category_id) : undefined,
      available: req.query.available === undefined ? undefined : req.query.available === "true",
    });
    if (!query.trim()) return candidates;
    const term = query.trim().toLocaleLowerCase("pt-BR");
    return candidates.filter((product) =>
      `${product.name} ${product.description || ""}`.toLocaleLowerCase("pt-BR").includes(term),
    );
  }

  async search(req, res, next) {
    const query = typeof req.query.q === "string" ? req.query.q : "";
    try {
      let products = await this.searchService.search(query, {
        category_id: req.query.category_id ? Number(req.query.category_id) : undefined,
        available: req.query.available === undefined ? undefined : req.query.available === "true",
      });
      // Elasticsearch can be stale after a restart or failed indexing operation.
      if (products.length === 0 && query.trim()) products = await this.databaseSearch(req, query);
      const enriched = await services.product.enrichProducts(products);
      res.json({ success: true, data: { items: enriched }, error: null });
    } catch {
      try {
        const products = await this.databaseSearch(req, query);
        const enriched = await services.product.enrichProducts(products);
        res.json({ success: true, data: { items: enriched }, error: null });
      } catch {
        next(new AppError("Servico de busca temporariamente indisponivel", ErrorCode.PRODUCT_SEARCH_UNAVAILABLE, 503));
      }
    }
  }
}

module.exports = ProductSearchController;
