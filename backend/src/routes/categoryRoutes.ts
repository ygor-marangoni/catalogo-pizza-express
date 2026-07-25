const express = require("express");
const router = express.Router();

const CategoryController = require('../controllers/CategoryController');

router.get("/", (req, res, next) => {
	// TODO: Implementar
	res.json({ message: "Listar categorias" });
});

router.get("/:id", (req, res, next) => {
	// TODO: Implementar
	res.json({ message: "Buscar categoria" });
});

router.post("/", (req, res, next) => {
	// TODO: Implementar
	res.json({ message: "Criar categoria" });
});

router.put("/:id", (req, res, next) => {
	// TODO: Implementar
	res.json({ message: "Atualizar categoria" });
});

router.delete("/:id", (req, res, next) => {
	// TODO: Implementar
	res.json({ message: "Deletar categoria" });
});

module.exports = router;