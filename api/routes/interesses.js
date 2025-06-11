const express = require("express");
const router = express.Router();
const { getInteressesById, adicionarInteresse, deleteInteresse } = require("../controllers/interessesController");

router.get("/", getInteressesById); 
router.post("/",adicionarInteresse);
router.delete("/:id", deleteInteresse);


module.exports = router;