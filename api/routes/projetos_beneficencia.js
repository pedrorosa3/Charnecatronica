const express = require("express");
const router = express.Router();
const { getProjetosBeneficencia } = require("../controllers/projetos_beneficenciaController");

router.get("/", getProjetosBeneficencia);

module.exports = router;