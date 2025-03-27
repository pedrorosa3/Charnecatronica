const express = require("express");
const router = express.Router();
const { getlogin } = require("../controllers/loginController");

router.post("/", getlogin); 

module.exports = router;
