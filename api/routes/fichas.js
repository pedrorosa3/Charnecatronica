const express = require("express");
const router = express.Router();
const { getFichas } = require("../controllers/fichasController");

router.get("/", getFichas);


module.exports = router;