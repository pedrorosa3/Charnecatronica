const express = require("express");
const router = express.Router();
const diagnosticoController = require("../controllers/diagnosticoController");

router.post("/:id", diagnosticoController.registarDiagnostico);

module.exports = router;
