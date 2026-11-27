var express = require("express");
var router = express.Router();

var usuarioInternoController = require("../controllers/usuarioInternoController");

router.get("/listar/:idEmpresa", function (req, res) {
    usuarioInternoController.listarPorEmpresa(req, res);
});

router.get("/empresas/:idCliente", function (req, res) {
    usuarioInternoController.listarEmpresas(req, res);
});

router.post("/cadastrar", function (req, res) {
    usuarioInternoController.cadastrar(req, res);
});

module.exports = router;