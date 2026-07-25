const express = require("express");
const router = express.Router();

const ProductController = require('../controllers/ProductController');

router.get("/", (req, res, next) => {
	// TODO: Implementar
	res.json({ message: "Listar produtos" });
});

router.get("/:id", (req, res, next) => {
	// TODO: Implementar
	res.json({ message: "Buscar produto" });
});

router.post("/", (req, res, next) => {
	// TODO: Implementar
	res.json({ message: "Criar produto" });
});

router.put("/:id", (req, res, next) => {
	// TODO: Implementar
	res.json({ message: "Atualizar produto" });
});

router.delete("/:id", (req, res, next) => {
	// TODO: Implementar
	res.json({ message: "Deletar produto" });
});

module.exports = router;