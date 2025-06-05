const express = require("express");
const router = express.Router();
const {
  insertLojaComMorada,
  getLojas,
  getEmpregadosByLoja,
  getEquipamentosByLoja,
} = require("../controllers/lojasController");

router.post("/", insertLojaComMorada);
router.get("/", getLojas);
router.get("/:nipc/empregados", getEmpregadosByLoja);
router.get("/:nipc/equipamentos", getEquipamentosByLoja);

module.exports = router;
