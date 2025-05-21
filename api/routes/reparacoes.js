const express = require("express");
const router = express.Router();
const reparacoesController = require("../controllers/reparacoesController");

router.get("/", reparacoesController.getAllReparacoes);
router.get("/:id", reparacoesController.getReparacaoById);
router.post("/", reparacoesController.createReparacao);
router.put("/:id", reparacoesController.updateReparacao);
router.delete("/:id", reparacoesController.deleteReparacao);

module.exports = router;
