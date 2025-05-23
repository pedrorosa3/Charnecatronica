const express = require("express");
const router = express.Router();
const {
  getEquipamentos,
  getEquipamentoById,
  createEquipamento,   // novo controller
} = require("../controllers/equipamentosController");

router.get("/", getEquipamentos);
router.get("/:id", getEquipamentoById);
router.post("/", createEquipamento);  // nova rota POST

module.exports = router;

