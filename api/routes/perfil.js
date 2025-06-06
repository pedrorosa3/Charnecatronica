const express = require("express");
const router = express.Router();
const { upsertPerfil, getPerfilByEmail, getClientIdByEmail } = require("../controllers/perfilController");

router.post("/", upsertPerfil);
router.get("/", getPerfilByEmail);
router.get("/clienteId", getClientIdByEmail);

module.exports = router;
