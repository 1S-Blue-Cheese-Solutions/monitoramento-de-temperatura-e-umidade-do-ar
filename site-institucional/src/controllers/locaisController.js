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

  // empresa atual de quem está logado (vem como ?idEmpresa=); 0 quando não vier
  var idEmpresaAtual = Number(req.query.idEmpresa) || 0;

  responder(res, locaisModel.listar(idCliente, idEmpresaAtual));
}

// Cria a empresa junto com o endereço (o endereço é obrigatório para ela aparecer na tela)
function cadastrarEmpresa(req, res) {
  var e = req.body;
  var en = e.endereco || {};

  if (idInvalido(res, e.fkCliente, "fkCliente")) return;

  if (!e.nomeFantasia) {
    return res.status(400).send("Preencha o nome fantasia!");
  }
  if (!/^\d{14}$/.test(e.cnpj || "")) {
    return res.status(400).send("O CNPJ deve ter 14 números!");
  }
  if (!/^\d{8}$/.test(en.cep || "") || !en.logradouro || !en.bairro || !en.cidade || !en.estado || en.estado.length != 2) {
    return res.status(400).send("Endereço incompleto!");
  }

  locaisModel.cadastrarEmpresa(e.fkCliente, e, en)
    .then(function (resultado) {
      res.status(201).json(resultado);
    })
    .catch(function (erro) {
      console.log(erro);
      if (erro.code == "ER_DUP_ENTRY") {
        res.status(409).send("Já existe uma empresa com esse CNPJ!");
      } else {
        res.status(500).json(erro.sqlMessage);
      }
    });
}

function editarEmpresa(req, res) {
  var idEmpresa = req.params.idEmpresa;
  if (idInvalido(res, idEmpresa, "idEmpresa")) return;

  responder(res, locaisModel.editarEmpresa(idEmpresa, req.body));
}

function cadastrarEndereco(req, res) {
  var idEmpresa = req.params.idEmpresa;
  if (idInvalido(res, idEmpresa, "idEmpresa")) return;

  responder(res, locaisModel.cadastrarEndereco(idEmpresa, req.body));
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

module.exports = { listar, cadastrarEmpresa, editarEmpresa, cadastrarEndereco, editarEndereco, cadastrarAmbiente };
