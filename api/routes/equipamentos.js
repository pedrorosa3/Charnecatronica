const express = require("express");
const router = express.Router();
const { getEquipamentos } = require("../controllers/equipamentosController");

router.get("/", getEquipamentos);

module.exports = router;
