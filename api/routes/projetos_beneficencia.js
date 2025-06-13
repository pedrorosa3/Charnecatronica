const express = require("express");
const router = express.Router();
const { getProjetosBeneficencia, getProjetoById } = require("../controllers/projetos_beneficenciaController");

router.get("/", getProjetosBeneficencia);

router.get("/:id", getProjetoById);
//router.delete("/:id", deleteProjetoBeneficencia);

module.exports = router;
