const express = require("express");
const router = express.Router();
const { insertVenda } = require("../controllers/vendasController");

router.post("/", insertVenda);

module.exports = router;

