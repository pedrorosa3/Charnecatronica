const express = require("express");
const router = express.Router();
const { getInteressesById } = require("../controllers/interessesController");

router.get("/", getInteressesById); 

module.exports = router;