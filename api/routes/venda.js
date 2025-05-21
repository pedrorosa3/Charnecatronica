const express = require("express");
const router = express.Router();
const { criarVenda } = require("../controllers/vendaController");

router.post("/", criarVenda);


module.exports = router;
