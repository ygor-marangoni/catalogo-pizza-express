import { ErrorCode } from "../entities/enums";
import type { CreateProductReqDTO, UpdateProductReqDTO } from "../dtos/req";
import type { ProductResDTO, Repository } from "../dtos/res";

class ProductService {
	private readonly productRepository: Repository<ProductResDTO, CreateProductReqDTO, UpdateProductReqDTO>;
	private readonly categoryRepository: any;
	private readonly sizeRepository: any;
	private readonly edgeRepository: any;
	private readonly additionalRepository: any;
	private readonly associationRepository: any;

	constructor(productRepository: Repository<ProductResDTO, CreateProductReqDTO, UpdateProductReqDTO>, categoryRepository?: any, sizeRepository?: any, edgeRepository?: any, additionalRepository?: any, associationRepository?: any) {
		this.productRepository = productRepository;
		this.categoryRepository = categoryRepository;
		this.sizeRepository = sizeRepository;
		this.edgeRepository = edgeRepository;
		this.additionalRepository = additionalRepository;
		this.associationRepository = associationRepository;
	}

	async getAllProducts(filters: Record<string, unknown> = {}): Promise<ProductResDTO[]> {
		try {
			const products = await this.productRepository.findAll(filters);
			return this.enrichProducts(products);
		} catch (error) {
			throw new Error(`Erro ao buscar produtos: ${error.message}`);
		}
	}

	async getProductById(id: number): Promise<ProductResDTO> {
		try {
			const product = await this.productRepository.findById(id);
			if (!product) {
				throw new Error(ErrorCode.PRODUCT_NOT_FOUND);
			}
			return this.enrichProduct(product);
		} catch (error) {
			throw error;
		}
	}

	async createProduct(productData: CreateProductReqDTO): Promise<ProductResDTO> {
		try {
			await this.ensureCategory(productData.category_id);
			const product = await this.productRepository.create(this.catalogData(productData));
			await this.updateAssociations(product.id, productData);
			return this.enrichProduct(product);
		} catch (error) {
			throw new Error(`Erro ao criar produto: ${error.message}`);
		}
	}

	async updateProduct(id: number, productData: UpdateProductReqDTO): Promise<ProductResDTO> {
		try {
			if (productData.category_id !== undefined) await this.ensureCategory(productData.category_id);
			const product = await this.productRepository.update(id, this.catalogData(productData));
			if (this.hasAssociations(productData)) await this.updateAssociations(id, productData);
			return this.enrichProduct(product);
		} catch (error) {
			throw new Error(`Erro ao atualizar produto: ${error.message}`);
		}
	}

	async deleteProduct(id: number): Promise<{ success: true }> {
		try {
			await this.productRepository.delete(id);
			return { success: true };
		} catch (error) {
			throw new Error(`Erro ao deletar produto: ${error.message}`);
		}
	}

	private async ensureCategory(categoryId: number): Promise<void> {
		if (this.categoryRepository && !(await this.categoryRepository.findById(categoryId)))
			throw new Error(ErrorCode.CATEGORY_NOT_FOUND);
	}

	async enrichProducts(products: ProductResDTO[]): Promise<ProductResDTO[]> {
		return Promise.all(products.map((product) => this.enrichProduct(product)));
	}

	private async enrichProduct(product: ProductResDTO): Promise<ProductResDTO> {
		if (!this.associationRepository) return product;
		const associations = await this.associationRepository.get(product.id);
		const [sizes, edges, additionals] = await Promise.all([
			this.findOptions(this.sizeRepository, associations.size_ids),
			this.findOptions(this.edgeRepository, associations.edge_ids),
			this.findOptions(this.additionalRepository, associations.additional_ids),
		]);
		return { ...product, sizes, edges, additionals };
	}

	private async findOptions(repository: any, ids: number[] = []): Promise<any[]> {
		if (!repository) return [];
		return (await Promise.all(ids.map((id) => repository.findById(id)))).filter(Boolean);
	}

	private catalogData(data: any): any {
		const { size_ids, edge_ids, additional_ids, ...catalogData } = data;
		return catalogData;
	}

	private hasAssociations(data: any): boolean {
		return ["size_ids", "edge_ids", "additional_ids"].some((field) => data[field] !== undefined);
	}

	private async updateAssociations(productId: number, data: any): Promise<void> {
		if (!this.associationRepository) return;
		const current = await this.associationRepository.get(productId);
		const associations = {
			size_ids: data.size_ids === undefined ? current.size_ids : this.normalizeIds(data.size_ids),
			edge_ids: data.edge_ids === undefined ? current.edge_ids : this.normalizeIds(data.edge_ids),
			additional_ids: data.additional_ids === undefined ? current.additional_ids : this.normalizeIds(data.additional_ids),
		};
		await this.validateOptions(this.sizeRepository, associations.size_ids, "tamanho");
		await this.validateOptions(this.edgeRepository, associations.edge_ids, "borda");
		await this.validateOptions(this.additionalRepository, associations.additional_ids, "adicional");
		await this.associationRepository.replace(productId, associations);
	}

	private normalizeIds(ids: unknown): number[] {
		if (!Array.isArray(ids)) throw Object.assign(new Error("As associações devem ser listas de IDs."), { code: "VALIDATION_ERROR", statusCode: 400 });
		const normalized = ids.map(Number);
		if (normalized.some((id) => !Number.isInteger(id) || id <= 0)) throw Object.assign(new Error("As associações devem conter IDs válidos."), { code: "VALIDATION_ERROR", statusCode: 400 });
		return [...new Set(normalized)];
	}

	private async validateOptions(repository: any, ids: number[], label: string): Promise<void> {
		for (const id of ids) if (!(await repository.findById(id))) throw Object.assign(new Error(`${label} ${id} não encontrado.`), { code: "OPTION_NOT_FOUND", statusCode: 404 });
	}
}

export = ProductService;
