import express from "express";
const AuthMiddleware = require("../middlewares/AuthMiddleware");
const UserController = require("../controllers/UserController").UserController;
import { services } from "../config/containerConfig";
import { validate } from "../middlewares/ZodValidationMiddleware";
import { favoriteSchema, orderSchema, updateUserSchema } from "../validations/schemas";

const router = express.Router();
const protect = AuthMiddleware.verifyToken.bind(AuthMiddleware);
const customerOnly = AuthMiddleware.requireRole("CUSTOMER");
const controller = new UserController(services.auth, services.product, services.order, services.favorite);

// Todas as rotas abaixo operam somente sobre o cliente autenticado.
router.use(protect, customerOnly);
router.get("/me", controller.getProfile.bind(controller));
router.put("/me", validate(updateUserSchema), controller.updateProfile.bind(controller));
router.get("/me/favorites", controller.listFavorites.bind(controller));
router.post("/me/favorites", validate(favoriteSchema), controller.addFavorite.bind(controller));
router.delete("/me/favorites/:id", controller.removeFavorite.bind(controller));
router.get("/me/orders", controller.listOrders.bind(controller));
router.post("/me/orders", validate(orderSchema), controller.createOrder.bind(controller));
router.get("/me/orders/:id", controller.getOrder.bind(controller));

module.exports = router;
