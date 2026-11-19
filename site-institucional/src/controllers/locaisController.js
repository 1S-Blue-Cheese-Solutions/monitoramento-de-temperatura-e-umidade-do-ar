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

  var fkCliente = req.body.fkCliente;
  
    if(fkCliente == undefined) {
        res.status(400).send("Seu fkCliente está undefined!");
      } 
         locaisModel.listar(fkCliente).then(function (resultado) {
            if (resultado.length > 0) {
                res.status(200).json(resultado);
            } else {
                  res.status(204).send("Nenhum resultado encontrado!")
              }
          }).catch(function (erro) {
              console.log(erro);
              console.log("Houve um erro ao buscar os avisos: ", erro.sqlMessage);
              res.status(500).json(erro.sqlMessage);
          });
}

function editarEmpresa(req, res) {
  responder(res, locaisModel.editarEmpresa(req.params.idEmpresa, req.body));

    var idEmpresa = req.body.idEmpresa;
  
    if(idEmpresa == undefined) {
        res.status(400).send("Seu idEmpresa está undefined!");
      } 
         locaisModel.listar(idEmpresa).then(function (resultado) {
            if (resultado.length > 0) {
                res.status(200).json(resultado);
            } else {
                  res.status(204).send("Nenhum resultado encontrado!")
              }
          }).catch(function (erro) {
              console.log(erro);
              console.log("Houve um erro ao buscar os avisos: ", erro.sqlMessage);
              res.status(500).json(erro.sqlMessage);
          });
}

function editarEndereco(req, res) {
  responder(res, locaisModel.editarEndereco(req.params.idEndereco, req.body));

      var idEndereco = req.body.idEmpresa;

      if(idEndereco == undefined) {
        res.status(400).send("Seu idEmpresa está undefined!");
      } 
         locaisModel.listar(idEndereco).then(function (resultado) {
            if (resultado.length > 0) {
                res.status(200).json(resultado);
            } else {
                  res.status(204).send("Nenhum resultado encontrado!")
              }
          }).catch(function (erro) {
              console.log(erro);
              console.log("Houve um erro ao buscar os avisos: ", erro.sqlMessage);
              res.status(500).json(erro.sqlMessage);
          });
}

function cadastrarAmbiente(req, res) {
  responder(res, locaisModel.cadastrarAmbiente(req.params.idEndereco, req.body));

        var idEndereco = req.body.idEmpresa;

      if(idEndereco == undefined) {
        res.status(400).send("Seu idEmpresa está undefined!");
      } 
         locaisModel.listar(idEndereco).then(function (resultado) {
            if (resultado.length > 0) {
                res.status(200).json(resultado);
            } else {
                  res.status(204).send("Nenhum resultado encontrado!")
              }
          }).catch(function (erro) {
              console.log(erro);
              console.log("Houve um erro ao buscar os avisos: ", erro.sqlMessage);
              res.status(500).json(erro.sqlMessage);
          });
}

module.exports = { listar, editarEmpresa, editarEndereco, cadastrarAmbiente };
