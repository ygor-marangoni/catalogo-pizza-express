import express from "express";
import { services } from "../config/containerConfig";
const AuthController = require("../controllers/AuthController");
import { validate } from "../middlewares/ZodValidationMiddleware";
import { loginSchema, registerUserSchema } from "../validations/schemas";

const router = express.Router();
const controller = new AuthController(services.auth);

// Mantém login e renovação unificados para ADMIN e CUSTOMER.
router.post("/login", validate(loginSchema), controller.login.bind(controller));
router.post("/refresh", controller.refresh.bind(controller));
router.post("/user/register", validate(registerUserSchema), controller.registerUser.bind(controller));

module.exports = router;
