const express = require("express");
const router = express.Router();
const { getFichas, getFichaById } = require("../controllers/fichasController");

// Lista de todas as fichas
router.get("/", getFichas);

// Detalhes de uma ficha específica
router.get("/:id", getFichaById);

module.exports = router;
