const express = require("express");
const router = express.Router();
const { upsertPerfil } = require("../controllers/perfilController");

router.post("/", upsertPerfil);

module.exports = router;
