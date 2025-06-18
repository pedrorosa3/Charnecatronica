const express = require("express");
const router = express.Router();
const { upsertPerfil, getPerfilByEmail, getClientIdByEmail, findOrCreateUserByEmail } = require("../controllers/perfilController");

router.post("/", upsertPerfil);
router.get("/", getPerfilByEmail);
router.get("/clienteId", getClientIdByEmail);
router.post("/email", findOrCreateUserByEmail);

module.exports = router;
