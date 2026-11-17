var database = require("../database/config");


function buscarPorId(id) {
  var instrucaoSql = `SELECT * FROM locais WHERE id = '${id}'`;

  return database.executar(instrucaoSql);
}

function editarLocal(req, res) {

}

function editarEmpresa(req, res) {

}

module.exports = { buscarPorId, editarEmpresa, editarLocal };