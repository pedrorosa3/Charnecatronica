const express = require("express");
const router = express.Router();
const {upsertPerfil } = require("../controllers/perfilcontroller");

router.post("/perfil", upsertPerfil);

module.exports = router;