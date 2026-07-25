import express from "express";
const AuthMiddleware = require("../middlewares/AuthMiddleware");
import { services } from "../config/containerConfig";
import { createCrudController } from "../controllers/CrudController";
import { validate } from "../middlewares/ZodValidationMiddleware";
import { z } from "zod";

const router = express.Router();
const controller = createCrudController(services.edge, "Edges");
const adminOnly = AuthMiddleware.requireRole("ADMIN");
const protect = AuthMiddleware.verifyToken.bind(AuthMiddleware);
router.get("/", controller.findAll);
router.get("/:id", controller.findById);
const edgeSchema = z
	.object({
		name: z.string().trim().min(1).max(120),
		description: z.string().nullable().optional(),
		additional_price: z.number().int().nonnegative(),
	})
	.strict();
router.post("/", protect, adminOnly, validate(edgeSchema), controller.create);
router.put("/:id", protect, adminOnly, validate(edgeSchema.partial()), controller.update);
router.delete("/:id", protect, adminOnly, controller.delete);
module.exports = router;
