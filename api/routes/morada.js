const express = require("express");
const router = express.Router();
const { adicionarMorada } = require("../controllers/moradaController");

router.post("/", adicionarMorada);

module.exports = router;