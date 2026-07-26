import express from "express";
const AuthMiddleware = require("../middlewares/AuthMiddleware");
import { AdminCustomerController } from "../controllers/AdminCustomerController";
import { services } from "../config/containerConfig";
import { validate } from "../middlewares/ZodValidationMiddleware";
import { registerUserSchema, updateUserSchema } from "../validations/schemas";

const router = express.Router();
const controller = new AdminCustomerController(services.auth);

router.use(
	AuthMiddleware.verifyToken.bind(AuthMiddleware),
	AuthMiddleware.requireRole("ADMIN"),
);
router.get("/", controller.list.bind(controller));
router.get("/:id", controller.get.bind(controller));
router.post("/", validate(registerUserSchema), controller.create.bind(controller));
router.put("/:id", validate(updateUserSchema), controller.update.bind(controller));
router.delete("/:id", controller.delete.bind(controller));

module.exports = router;
