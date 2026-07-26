import { AppDataSource } from "../config/ormConfig";
import { ProductAdditional } from "../entities/ProductAdditional";
import { ProductEdge } from "../entities/ProductEdge";
import { ProductSize } from "../entities/ProductSize";

type AssociationInput = { size_ids?: number[]; edge_ids?: number[]; additional_ids?: number[] };

export class ProductAssociationRepository {
	private readonly memory = new Map<number, AssociationInput>();

	async get(productId: number): Promise<AssociationInput> {
		if (!AppDataSource.isInitialized) return this.memory.get(productId) || { size_ids: [], edge_ids: [], additional_ids: [] };
		const [sizes, edges, additionals] = await Promise.all([
			AppDataSource.getRepository(ProductSize).find({ where: { product_id: productId } }),
			AppDataSource.getRepository(ProductEdge).find({ where: { product_id: productId } }),
			AppDataSource.getRepository(ProductAdditional).find({ where: { product_id: productId } }),
		]);
		return {
			size_ids: sizes.map((item) => item.size_id),
			edge_ids: edges.map((item) => item.edge_id),
			additional_ids: additionals.map((item) => item.additional_id),
		};
	}

	async replace(productId: number, input: AssociationInput): Promise<void> {
		const normalized = {
			size_ids: [...new Set(input.size_ids || [])],
			edge_ids: [...new Set(input.edge_ids || [])],
			additional_ids: [...new Set(input.additional_ids || [])],
		};
		if (!AppDataSource.isInitialized) {
			this.memory.set(productId, normalized);
			return;
		}
		const manager = AppDataSource.manager;
		await manager.transaction(async (transaction) => {
			await transaction.delete(ProductSize, { product_id: productId });
			await transaction.delete(ProductEdge, { product_id: productId });
			await transaction.delete(ProductAdditional, { product_id: productId });
			if (normalized.size_ids.length) await transaction.insert(ProductSize, normalized.size_ids.map((size_id) => ({ product_id: productId, size_id })));
			if (normalized.edge_ids.length) await transaction.insert(ProductEdge, normalized.edge_ids.map((edge_id) => ({ product_id: productId, edge_id })));
			if (normalized.additional_ids.length) await transaction.insert(ProductAdditional, normalized.additional_ids.map((additional_id) => ({ product_id: productId, additional_id })));
		});
	}
}
