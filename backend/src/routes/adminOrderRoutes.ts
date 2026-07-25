import express from "express";
const AuthMiddleware = require("../middlewares/AuthMiddleware");
const AdminOrderController = require("../controllers/AdminOrderController").AdminOrderController;
import { services } from "../config/containerConfig";
import { validate } from "../middlewares/ZodValidationMiddleware";
import { orderStatusSchema } from "../validations/schemas";

const router = express.Router();
const protect = AuthMiddleware.verifyToken.bind(AuthMiddleware);
const adminOnly = AuthMiddleware.requireRole("ADMIN");
const controller = new AdminOrderController(services.order);

// Permite ao administrador acompanhar e atualizar qualquer pedido.
router.use(protect, adminOnly);
router.get("/", controller.list.bind(controller));
router.patch("/:id/status", validate(orderStatusSchema), controller.updateStatus.bind(controller));

module.exports = router;
