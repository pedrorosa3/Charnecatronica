// routes/lojas.js
const express = require("express");
const router = express.Router();
const {insertLojaComMorada} = require("../controllers/adicionarLoja");

router.post("/", insertLojaComMorada);

module.exports = router;
