const { Client } = require("@elastic/elasticsearch");
import type { ProductResource } from "../types/domain";

interface ProductSearchFilters {
	category_id?: number;
	available?: boolean;
}

interface ProductDocument extends ProductResource {
	name: string;
	description: string | null;
}

interface SearchHit<T> {
	_source?: T;
}

class ProductSearchService {
	private readonly client: any;
	private readonly index: string;

	constructor(
		url = process.env.ELASTICSEARCH_URL ?? "http://localhost:9200",
		index = process.env.ELASTICSEARCH_PRODUCTS_INDEX ?? "pizza-products",
	) {
		this.client = new Client({ node: url });
		this.index = index;
	}

	async ensureIndex(): Promise<void> {
		const exists = await this.client.indices.exists({ index: this.index });

		if (!exists) {
			await this.client.indices.create({
				index: this.index,
				mappings: {
					properties: {
						id: { type: "integer" },
						name: { type: "text", fields: { keyword: { type: "keyword" } } },
						description: { type: "text" },
						category_id: { type: "integer" },
						base_price: { type: "integer" },
						available: { type: "boolean" },
						highlighted: { type: "boolean" },
					},
				},
			});
		}
	}

	async search(query: string, filters: ProductSearchFilters = {}): Promise<ProductResource[]> {
		const must = query.trim()
			? [{ multi_match: { query: query.trim(), fields: ["name^3", "description"] } }]
			: [{ match_all: {} }];
		const filter: Array<Record<string, unknown>> = [];

		if (filters.category_id !== undefined) {
			filter.push({ term: { category_id: filters.category_id } });
		}

		if (filters.available !== undefined) {
			filter.push({ term: { available: filters.available } });
		}

		const response = await this.client.search({
			index: this.index,
			query: { bool: { must, filter } },
		}) as { hits: { hits: Array<SearchHit<ProductDocument>> } };

		return response.hits.hits
			.map((hit) => hit._source)
			.filter((product): product is ProductResource => product !== undefined);
	}

	async indexProduct(product: ProductResource): Promise<void> {
		await this.client.index({ index: this.index, id: String(product.id), document: product, refresh: "wait_for" });
	}

	async deleteProduct(id: number): Promise<void> {
		await this.client.delete({ index: this.index, id: String(id), refresh: "wait_for" });
	}
}

export = ProductSearchService;
