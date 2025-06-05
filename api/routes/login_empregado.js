const express = require("express");
const router = express.Router();
const { getlogin2 } = require("../controllers/loginEmpregadoController");

router.post("/", getlogin2); 

module.exports = router;