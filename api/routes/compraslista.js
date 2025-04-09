const express = require("express");
const router = express.Router();
const { getCompraLista, getCompraById } = require("../controllers/compraslistaController");

router.get("/", getCompraLista);
router.get("/:id", getCompraById); // 👉 NOVA ROTA

module.exports = router;

