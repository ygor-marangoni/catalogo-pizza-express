const express = require("express");
const router = express.Router();

const AuthController = require('../controllers/AuthController');

router.post("/admin/login", (req, res, next) => {
	// TODO: Implementar
	res.json({ message: "Login administrador" });
});

router.post("/admin/refresh", (req, res, next) => {
	// TODO: Implementar
	res.json({ message: "Refresh token" });
});

router.post("/admin/logout", (req, res, next) => {
	// TODO: Implementar
	res.json({ message: "Logout administrador" });
});

module.exports = router;