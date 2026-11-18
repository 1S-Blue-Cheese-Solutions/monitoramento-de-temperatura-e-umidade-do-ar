var locaisModel = require("../models/locaisModel");

// Devolve o resultado do model ou o erro do MySQL, como no usuarioController
function responder(res, promessa) {
  promessa
    .then(function (resultado) {
      res.json(resultado);
    })
    .catch(function (erro) {
      console.log(erro);
      res.status(500).json(erro.sqlMessage);
    });
}

function listar(req, res) {
  responder(res, locaisModel.listar(req.params.idCliente));
}

function editarEmpresa(req, res) {
  responder(res, locaisModel.editarEmpresa(req.params.idEmpresa, req.body));
}

function editarEndereco(req, res) {
  responder(res, locaisModel.editarEndereco(req.params.idEndereco, req.body));
}

function cadastrarAmbiente(req, res) {
  responder(res, locaisModel.cadastrarAmbiente(req.params.idEndereco, req.body));
}

module.exports = { listar, editarEmpresa, editarEndereco, cadastrarAmbiente };
