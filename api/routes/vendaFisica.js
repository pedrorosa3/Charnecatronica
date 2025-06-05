const express = require("express");
const router = express.Router();
const { criarVendaFisica } = require("../controllers/vendaFisicaController");

router.post("/", criarVendaFisica);

module.exports = router;