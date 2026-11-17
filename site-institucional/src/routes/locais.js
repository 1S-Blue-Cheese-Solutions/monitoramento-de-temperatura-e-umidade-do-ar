var express = require("express");
var router = express.Router();

var locaisController = require("../controllers/locaisController");

router.get("/buscarLocal", function (req, res) {
        locaisController.buscarPorId(req, res);
});

router.put("/editarEmpresa", function (req, res) {
        locaisController.editarEmpresa(req, res);
});

router.put("/editarLocal", function (req, res) {
       locaisController.editarLocal(req, res);
});

module.exports = router;