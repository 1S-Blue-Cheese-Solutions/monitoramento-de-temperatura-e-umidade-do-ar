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

// Responde 400 e retorna true quando o id da rota não veio
function idInvalido(res, id, nome) {
  if (id == undefined || id == "undefined") {
    res.status(400).send(`Seu ${nome} está undefined!`);
    return true;
  }
  return false;
}

function listar(req, res) {
  var idCliente = req.params.idCliente;
  if (idInvalido(res, idCliente, "idCliente")) return;

  responder(res, locaisModel.listar(idCliente));
}

function editarEmpresa(req, res) {
  var idEmpresa = req.params.idEmpresa;
  if (idInvalido(res, idEmpresa, "idEmpresa")) return;

  responder(res, locaisModel.editarEmpresa(idEmpresa, req.body));
}

function editarEndereco(req, res) {
  var idEndereco = req.params.idEndereco;
  if (idInvalido(res, idEndereco, "idEndereco")) return;

  responder(res, locaisModel.editarEndereco(idEndereco, req.body));
}

function cadastrarAmbiente(req, res) {
  var idEndereco = req.params.idEndereco;
  if (idInvalido(res, idEndereco, "idEndereco")) return;

  responder(res, locaisModel.cadastrarAmbiente(idEndereco, req.body));
}

module.exports = { listar, editarEmpresa, editarEndereco, cadastrarAmbiente };
