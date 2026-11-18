var express = require("express");
var router = express.Router();

var locaisController = require("../controllers/locaisController");

router.get("/listar/:idCliente", locaisController.listar);
router.put("/editarEmpresa/:idEmpresa", locaisController.editarEmpresa);
router.put("/editarEndereco/:idEndereco", locaisController.editarEndereco);
router.post("/cadastrarAmbiente/:idEndereco", locaisController.cadastrarAmbiente);

module.exports = router;
