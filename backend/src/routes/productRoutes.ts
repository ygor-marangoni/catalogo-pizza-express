import express from "express";
const AuthMiddleware = require("../middlewares/AuthMiddleware");
import { services } from "../config/containerConfig";
import { createCrudController } from "../controllers/CrudController";
const ProductSearchController = require("../controllers/ProductSearchController");
import ProductSearchService = require("../services/ProductSearchService");
import ImageService = require("../services/ImageService");
import { normalizeProductMultipart, productImageUpload } from "../middlewares/ProductUploadMiddleware";
import { validate } from "../middlewares/ZodValidationMiddleware";
import { productCreateSchema, productUpdateSchema } from "../validations/schemas";

const router = express.Router();
const prepareProductData = async (req) => {
	const data = { ...req.body };
	if (req.file) data.image_url = await ImageService.upload(req.file.buffer, req.file.mimetype);
	return data;
};
const controller = createCrudController(services.product, "Products", {
	prepareCreate: prepareProductData,
	prepareUpdate: prepareProductData,
});
const searchController = new ProductSearchController(new ProductSearchService());
const protect = AuthMiddleware.verifyToken.bind(AuthMiddleware);
const adminOnly = AuthMiddleware.requireRole("ADMIN");

router.get("/search", searchController.search.bind(searchController));
router.get("/", controller.findAll);
router.get("/:id", controller.findById);
router.post(
	"/",
	protect,
	adminOnly,
	productImageUpload,
	normalizeProductMultipart,
	validate(productCreateSchema),
	controller.create,
);
router.put(
	"/:id",
	protect,
	adminOnly,
	productImageUpload,
	normalizeProductMultipart,
	validate(productUpdateSchema),
	controller.update,
);
router.delete("/:id", protect, adminOnly, controller.delete);

module.exports = router;
