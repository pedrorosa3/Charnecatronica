const express = require("express");
const router = express.Router();
const {
  insertLojaComMorada,
  getLojas,
  getEmpregadosByLoja,
} = require("../controllers/lojasController");

router.post("/", insertLojaComMorada);
router.get("/", getLojas);
router.get("/:nipc/empregados", getEmpregadosByLoja);

module.exports = router;
