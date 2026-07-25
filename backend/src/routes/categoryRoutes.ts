import express from "express";
const AuthMiddleware = require("../middlewares/AuthMiddleware");
import { services } from "../config/containerConfig";
import { createCrudController } from "../controllers/CrudController";
import { validate } from "../middlewares/ZodValidationMiddleware";
import { categoryCreateSchema, categoryUpdateSchema } from "../validations/schemas";

const router = express.Router();
const controller = createCrudController(services.category, "Categories");
const protect = AuthMiddleware.verifyToken.bind(AuthMiddleware);
const adminOnly = AuthMiddleware.requireRole("ADMIN");
router.get("/", controller.findAll);
router.get("/:id", controller.findById);
router.post("/", protect, adminOnly, validate(categoryCreateSchema), controller.create);
router.put("/:id", protect, adminOnly, validate(categoryUpdateSchema), controller.update);
router.delete("/:id", protect, adminOnly, controller.delete);
module.exports = router;
