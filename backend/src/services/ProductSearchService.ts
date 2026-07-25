const { Client } = require("@elastic/elasticsearch");
import type { ProductResDTO } from "../dtos/res";
import { CircuitBreaker, Semaphore, withRetry, withTimeout } from "../utils/Resilience";

interface ProductSearchFilters {
	category_id?: number;
	available?: boolean;
}

interface ProductDocument extends ProductResDTO {
	name: string;
	description: string | null;
}

interface SearchHit<T> {
	_source?: T;
}

class ProductSearchService {
	// Encapsula a busca e indexação de produtos no Elasticsearch.
	private readonly client: any;
	private readonly index: string;
	private readonly breaker = new CircuitBreaker(5, 30000);
	private readonly bulkhead = new Semaphore(10);

	constructor(
		url = process.env.ELASTICSEARCH_URL ?? "http://localhost:9200",
		index = process.env.ELASTICSEARCH_PRODUCTS_INDEX ?? "pizza-products",
	) {
		this.client = new Client({ node: url });
		this.index = index;
	}

	async ensureIndex(): Promise<void> {
		const exists = await withTimeout(this.client.indices.exists({ index: this.index }), 3000);

		if (!exists) {
			await withTimeout(
				this.client.indices.create({
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
				}),
				3000,
			);
		}
	}

	async search(query: string, filters: ProductSearchFilters = {}): Promise<ProductResDTO[]> {
		return this.bulkhead.run(() =>
			this.breaker.execute(() =>
				withRetry(
					async () => {
						await this.ensureIndex();
						const must = query.trim()
							? [
									{
										multi_match: {
											query: query.trim(),
											fields: ["name^3", "description"],
										},
									},
								]
							: [{ match_all: {} }];
						const filter: Array<Record<string, unknown>> = [];

						if (filters.category_id !== undefined) {
							filter.push({ term: { category_id: filters.category_id } });
						}

						if (filters.available !== undefined) {
							filter.push({ term: { available: filters.available } });
						}

						const response = (await withTimeout(
							this.client.search({
								index: this.index,
								query: { bool: { must, filter } },
							}),
							3000,
						)) as { hits: { hits: Array<SearchHit<ProductDocument>> } };

						return response.hits.hits
							.map((hit) => hit._source)
							.filter((product): product is ProductResDTO => product !== undefined);
					},
					2,
					150,
				),
			),
		);
	}

	async indexProduct(product: ProductResDTO): Promise<void> {
		await this.bulkhead.run(() =>
			this.breaker.execute(() =>
				withRetry(
					() =>
						withTimeout(
							this.client.index({
								index: this.index,
								id: String(product.id),
								document: product,
								refresh: "wait_for",
							}),
							5000,
						),
					2,
					150,
				),
			),
		);
	}

	async deleteProduct(id: number): Promise<void> {
		await this.bulkhead.run(() =>
			this.breaker.execute(() =>
				withRetry(
					() =>
						withTimeout(
							this.client.delete({
								index: this.index,
								id: String(id),
								refresh: "wait_for",
							}),
							5000,
						),
					2,
					150,
				),
			),
		);
	}
}

export = ProductSearchService;
