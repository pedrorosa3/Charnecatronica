const express = require("express");
const router = express.Router();
const {
  getEquipamentos,
  getEquipamentoById,
} = require("../controllers/equipamentosController");

router.get("/", getEquipamentos);
router.get("/:id", getEquipamentoById);

module.exports = router;
