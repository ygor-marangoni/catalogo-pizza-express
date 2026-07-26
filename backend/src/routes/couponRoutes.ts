import express from "express";
const AuthMiddleware = require("../middlewares/AuthMiddleware");
const CouponController = require("../controllers/CouponController");
import { services } from "../config/containerConfig";
import { validate } from "../middlewares/ZodValidationMiddleware";
import { couponSchema, couponUpdateSchema, couponValidationSchema } from "../validations/schemas";

const router = express.Router();
const controller = new CouponController(services.coupon);
const protect = AuthMiddleware.verifyToken.bind(AuthMiddleware);
const adminOnly = AuthMiddleware.requireRole("ADMIN");
const customerOnly = AuthMiddleware.requireRole("CUSTOMER");

router.post("/validate", protect, customerOnly, validate(couponValidationSchema), controller.validate);
router.get("/public", protect, customerOnly, controller.publicList);
router.get("/", protect, adminOnly, controller.list);
router.post("/", protect, adminOnly, validate(couponSchema), controller.create);
router.put("/:id", protect, adminOnly, validate(couponUpdateSchema), controller.update);
router.delete("/:id", protect, adminOnly, controller.remove);

module.exports = router;
