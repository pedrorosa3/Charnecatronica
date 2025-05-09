const express = require("express");
const router = express.Router();
const { listarVendas, detalhesVenda } = require("../controllers/vendaslistaController");

// Rota para listar todas as vendas
router.get("/", listarVendas);

// Rota para detalhes de uma venda específica
router.get("/:numerovenda", detalhesVenda);

module.exports = router;
