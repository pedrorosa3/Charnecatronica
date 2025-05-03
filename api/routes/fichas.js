const express = require("express");
const router = express.Router();
const {
  getFichas,
  getFichaById,
  getTiposDeEquipamento,
  createFicha,
  deleteFicha,
  updateFicha,
} = require("../controllers/fichasController");
// Lista de todas as fichas
router.get("/", getFichas);
router.get("/tipos", getTiposDeEquipamento);
router.post("/", createFicha);
// Detalhes de uma ficha específica
router.get("/:id", getFichaById);
router.delete("/:id", deleteFicha);
router.put("/:id", updateFicha);

module.exports = router;
