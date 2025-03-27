const express = require("express");
const router = express.Router();
const { getCompraLista } = require("../controllers/compraslistaController");

router.get("/", getCompraLista);

module.exports = router;
