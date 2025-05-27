// routes/lojaRoutes.js
const express = require("express");
const { insertLojaComMorada } = require("../controllers/adicionarLoja");
const router = express.Router();

router.post("/lojas", insertLojaComMorada);

module.exports = router;
