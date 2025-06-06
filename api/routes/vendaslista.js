const express = require("express");
const router = express.Router();
const { listarVendas, detalhesVenda, atualizarEstadoVenda, listarVendasPorCliente } = require("../controllers/vendaslistaController");

// Rota para listar todas as vendas
router.get("/", listarVendas);

// Rota para listar vendas por cliente
router.get("/cliente/:clienteId", listarVendasPorCliente);

// Rota para detalhes de uma venda específica
router.get("/:numerovenda", detalhesVenda);

// Rota para atualizar o estado da venda via POST
router.post("/:numerovenda/estado", atualizarEstadoVenda);

module.exports = router;


