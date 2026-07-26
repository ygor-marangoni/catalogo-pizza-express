import express from "express";
const AuthMiddleware = require("../middlewares/AuthMiddleware");
import { services } from "../config/containerConfig";
import { createCrudController } from "../controllers/CrudController";
import { validate } from "../middlewares/ZodValidationMiddleware";
import { categoryCreateSchema, categoryUpdateSchema } from "../validations/schemas";
import ImageService = require("../services/ImageService");
import { normalizeProductMultipart, productImageUpload } from "../middlewares/ProductUploadMiddleware";

const router = express.Router();
const prepareCategoryData = async (req) => {
	const data = { ...req.body };
	if (req.file) data.icon_url = await ImageService.upload(req.file.buffer, req.file.mimetype, "categories");
	return data;
};
const controller = createCrudController(services.category, "Categories", {
	prepareCreate: prepareCategoryData,
	prepareUpdate: prepareCategoryData,
});
const protect = AuthMiddleware.verifyToken.bind(AuthMiddleware);
const adminOnly = AuthMiddleware.requireRole("ADMIN");
router.get("/", controller.findAll);
router.get("/:id", controller.findById);
router.post("/", protect, adminOnly, productImageUpload, normalizeProductMultipart, validate(categoryCreateSchema), controller.create);
router.put("/:id", protect, adminOnly, productImageUpload, normalizeProductMultipart, validate(categoryUpdateSchema), controller.update);
router.delete("/:id", protect, adminOnly, controller.delete);
module.exports = router;
