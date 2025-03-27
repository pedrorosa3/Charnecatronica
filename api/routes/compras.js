const express = require("express");
const router = express.Router();
const { insertCompra } = require("../controllers/comprasController");

router.post("/", insertCompra);

module.exports = router;

