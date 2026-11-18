var database = require("../database/config");

function listar(idCliente) {
  var instrucaoSql = `
    SELECT e.nomeFantasia, e.cnpj, en.*, a.nomePrincipal
    FROM empresa AS e
      JOIN endereco AS en ON en.fkEmpresa = e.idEmpresa
      LEFT JOIN ambienteProcesso AS a ON a.fkEndereco = en.idEndereco
    WHERE e.fkCliente = ${idCliente}
    ORDER BY e.nomeFantasia;
  `;
  return database.executar(instrucaoSql);
}

function editarEmpresa(idEmpresa, e) {
  var instrucaoSql = `
    UPDATE empresa SET nomeFantasia = '${e.nomeFantasia}', cnpj = '${e.cnpj}'
    WHERE idEmpresa = ${idEmpresa};
  `;
  return database.executar(instrucaoSql);
}

function editarEndereco(idEndereco, en) {
  var instrucaoSql = `
    UPDATE endereco SET logradouro = '${en.logradouro}', numero = '${en.numero}', bairro = '${en.bairro}',
      cidade = '${en.cidade}', estado = '${en.estado}', cep = '${en.cep}'
    WHERE idEndereco = ${idEndereco};
  `;
  return database.executar(instrucaoSql);
}

function cadastrarAmbiente(idEndereco, a) {
  var instrucaoSql = `
    INSERT INTO ambienteProcesso (nomePrincipal, nomeAuxiliar, descricao, temperaturaMin, temperaturaMax, umidadeMin, umidadeMax, fkEndereco)
    VALUES ('${a.nomePrincipal}', '${a.nomeAuxiliar}', '${a.descricao}', ${a.temperaturaMin}, ${a.temperaturaMax}, ${a.umidadeMin}, ${a.umidadeMax}, ${idEndereco});
  `;
  return database.executar(instrucaoSql);
}

module.exports = { listar, editarEmpresa, editarEndereco, cadastrarAmbiente };
