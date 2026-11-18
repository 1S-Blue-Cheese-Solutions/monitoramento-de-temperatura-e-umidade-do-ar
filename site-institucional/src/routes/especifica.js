var express = require("express");
var router = express.Router();

var especificaController = require("../controllers/especificaController");

//Recebendo os dados do html e direcionando para a função cadastrar de usuarioController.js
router.get("/kpi1", function (req, res) {
    especificaController.kpi1(req, res);
})

module.exports = router;