const express = require("express");
const router = express.Router();
const { getClientesLista } = require("../controllers/clientesController");

router.get("/", getClientesLista);

module.exports = router;