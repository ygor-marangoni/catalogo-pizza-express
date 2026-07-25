const express = require("express");
const router = express.Router();

const ProductController = require('../controllers/ProductController');
const ProductSearchService = require('../services/ProductSearchService');

const productSearchService = new ProductSearchService();

router.get("/search", async (req, res, next) => {
	try {
		const query = typeof req.query.q === "string" ? req.query.q : "";
		const categoryId = typeof req.query.category_id === "string" ? Number(req.query.category_id) : undefined;
		const available = typeof req.query.available === "string" ? req.query.available === "true" : undefined;
		const products = await productSearchService.search(query, { category_id: categoryId, available });

		res.json({
			success: true,
			data: {
				items: products,
				_links: {
					self: { href: `/api/v1/products/search?q=${encodeURIComponent(query)}` },
					collection: { href: "/api/v1/products" },
				},
			},
			error: null,
		});
	} catch (error) {
		const serviceError = error as Error & { code?: string; statusCode?: number };
		serviceError.code = "PRODUCT_SEARCH_UNAVAILABLE";
		serviceError.statusCode = 503;
		next(serviceError);
	}
});

router.get("/", (req, res, next) => {
	// TODO: Implementar
	res.json({ message: "Listar produtos" });
});

router.get("/:id", (req, res, next) => {
	// TODO: Implementar
	res.json({ message: "Buscar produto" });
});

router.post("/", (req, res, next) => {
	// TODO: Implementar
	res.json({ message: "Criar produto" });
});

router.put("/:id", (req, res, next) => {
	// TODO: Implementar
	res.json({ message: "Atualizar produto" });
});

router.delete("/:id", (req, res, next) => {
	// TODO: Implementar
	res.json({ message: "Deletar produto" });
});

module.exports = router;
