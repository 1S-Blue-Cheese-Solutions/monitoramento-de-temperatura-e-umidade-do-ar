var express = require("express");
var router = express.Router();

var usuarioInternoController = require("../controllers/usuarioInternoController");

router.get("/listar/:idEmpresa", function (req, res) {
    usuarioInternoController.listarPorEmpresa(req, res);
});

module.exports = router;