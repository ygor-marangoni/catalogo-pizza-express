const Hateoas = require("../utils/Hateoas");
import type { NextFunction, Request, Response } from "express";
import type { ProductInput } from "../types/domain";
import ProductService = require("../services/ProductService");

class ProductController {
	private readonly productService: InstanceType<typeof ProductService>;

	constructor(productService: InstanceType<typeof ProductService>) {
		this.productService = productService;
	}

	async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const filters = req.query;
			const products = await this.productService.getAllProducts(filters);

			res.json({
				success: true,
				data: Hateoas.list(products, "products"),
				error: null,
			});
		} catch (error) {
			next(error);
		}
	}

	async findById(req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> {
		try {
			const id = Number(req.params.id);
			const product = await this.productService.getProductById(id);

			res.json({
				success: true,
				data: Hateoas.item(product, "products", product.id),
				error: null,
			});
		} catch (error) {
			next(error);
		}
	}

	async create(req: Request<Record<string, never>, unknown, ProductInput>, res: Response, next: NextFunction): Promise<void> {
		try {
			const productData = req.body;
			const product =
				await this.productService.createProduct(productData);

			res.status(201).json({
				success: true,
				data: Hateoas.item(product, "products", product.id),
				error: null,
			});
		} catch (error) {
			next(error);
		}
	}

	async update(req: Request<{ id: string }, unknown, Partial<ProductInput>>, res: Response, next: NextFunction): Promise<void> {
		try {
			const id = Number(req.params.id);
			const productData = req.body;
			const product = await this.productService.updateProduct(
				id,
				productData,
			);

			res.json({
				success: true,
				data: Hateoas.item(product, "products", product.id),
				error: null,
			});
		} catch (error) {
			next(error);
		}
	}

	async delete(req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> {
		try {
			const id = Number(req.params.id);
			await this.productService.deleteProduct(id);

			res.json({
				success: true,
				data: null,
				error: null,
			});
		} catch (error) {
			next(error);
		}
	}
}

module.exports = ProductController;
