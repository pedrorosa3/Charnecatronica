const express = require("express");
const router = express.Router();
const { getInteressesLista } = require("../controllers/interessesController");

router.get("/:id", getInteressesLista); 

module.exports = router;