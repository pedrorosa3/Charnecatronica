const express = require("express");
const router = express.Router();
const { adicionarPessoa } = require("../controllers/pessoaController");

router.post("/", adicionarPessoa);

module.exports = router;