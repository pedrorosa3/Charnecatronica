// routes/lojas.js
const express = require("express");
const router = express.Router();
const { getLojas, getEmpregadosByLoja } = require("../controllers/lojasController");

router.get("/", getLojas);
router.get("/:nipc/empregados", getEmpregadosByLoja);

module.exports = router;
