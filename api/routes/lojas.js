// routes/lojas.js
const express = require("express");
const router = express.Router();
const {insertLojaComMorada} = require("../controllers/adicionarLoja");
const { getLojas } = require("../controllers/adicionarLoja");

router.post("/", insertLojaComMorada);
router.get("/", getLojas); 


module.exports = router;
