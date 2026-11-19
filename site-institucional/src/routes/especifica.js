var express = require("express");
var router = express.Router();

var especificaController = require("../controllers/especificaController");

//Recebendo os dados do html e direcionando para a função cadastrar de usuarioController.js
router.get("/kpi1", function (req, res) {
    especificaController.kpi1(req, res);
})

router.get("/kpi2", function (req, res) {
    especificaController.kpi2(req, res);
})

router.get("/kpi4", function (req, res) {
    especificaController.kpi4(req, res);
})

module.exports = router;