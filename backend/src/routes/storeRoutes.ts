import express from "express";
const AuthMiddleware = require("../middlewares/AuthMiddleware");
const StoreController = require("../controllers/StoreController");
import { services } from "../config/containerConfig";
import { validate } from "../middlewares/ZodValidationMiddleware";
import { storeStatusSchema, storeUpdateSchema } from "../validations/schemas";

const router = express.Router();
const controller = new StoreController(services.store);
const protect = AuthMiddleware.verifyToken.bind(AuthMiddleware);
const adminOnly = AuthMiddleware.requireRole("ADMIN");
router.get("/", controller.getInfo.bind(controller));
router.put("/", protect, adminOnly, validate(storeUpdateSchema), controller.updateInfo.bind(controller));
router.get("/status", controller.getStatus.bind(controller));
router.put("/status", protect, adminOnly, validate(storeStatusSchema), controller.updateStatus.bind(controller));
module.exports = router;
