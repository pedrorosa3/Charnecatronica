const express = require("express");
const router = express.Router();
const { upsertPerfil, getPerfilByEmail } = require("../controllers/perfilController");

router.post("/", upsertPerfil);
router.get("/", getPerfilByEmail);

module.exports = router;
