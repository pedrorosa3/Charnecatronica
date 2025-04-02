const express = require("express");
const router = express.Router();
const { insertProjeto } = require("../controllers/add_projetoController");

router.post("/", insertProjeto);

module.exports = router;