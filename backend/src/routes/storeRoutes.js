const express = require("express");
const router = express.Router();

const StoreController = require('../controllers/StoreController');

router.get("/", (req, res, next) => {
	// TODO: Implementar
	res.json({ message: "Informações da loja" });
});

router.put("/", (req, res, next) => {
	// TODO: Implementar
	res.json({ message: "Atualizar informações da loja" });
});

router.get("/status", (req, res, next) => {
	// TODO: Implementar
	res.json({ message: "Status da loja" });
});

router.put("/status", (req, res, next) => {
	// TODO: Implementar
	res.json({ message: "Atualizar status da loja" });
});

module.exports = router;