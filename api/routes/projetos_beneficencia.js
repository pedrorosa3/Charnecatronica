const express = require("express");
const router = express.Router();
const { getProjetosBeneficencia, deleteProjetoBeneficencia } = require("../controllers/projetoController");

router.get("/", getProjetosBeneficencia);
router.delete("/:id", deleteProjetoBeneficencia);

module.exports = router;
