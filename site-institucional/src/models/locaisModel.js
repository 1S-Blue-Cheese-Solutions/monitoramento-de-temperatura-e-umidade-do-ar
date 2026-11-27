var database = require("../database/config");

// Empresas do cliente + a empresa atual do usuário logado.
// LEFT JOIN no endereço para mostrar também a empresa criada no cadastro, que ainda não tem endereço.
function listar(idCliente, idEmpresaAtual) {
  var instrucaoSql = `
    SELECT e.idEmpresa, e.nomeFantasia, e.cnpj,
      en.idEndereco, en.logradouro, en.numero, en.bairro, en.cidade, en.estado, en.cep,
      a.nomePrincipal
    FROM empresa AS e
      LEFT JOIN endereco AS en ON en.fkEmpresa = e.idEmpresa
      LEFT JOIN ambienteProcesso AS a ON a.fkEndereco = en.idEndereco
    WHERE e.fkCliente = ${idCliente} OR e.idEmpresa = ${idEmpresaAtual}
    ORDER BY e.nomeFantasia;
  `;
  return database.executar(instrucaoSql);
}

// Insere a empresa e depois o endereço dela; devolve os dois ids
async function cadastrarEmpresa(idCliente, e, en) {
  var sqlEmpresa = `
    INSERT INTO empresa (nomeFantasia, cnpj, fkCliente)
    VALUES ('${e.nomeFantasia}', '${e.cnpj}', ${idCliente});
  `;
  var resultadoEmpresa = await database.executar(sqlEmpresa);
  var idEmpresa = resultadoEmpresa.insertId;

  var sqlEndereco = `
    INSERT INTO endereco (logradouro, numero, bairro, cidade, estado, cep, fkEmpresa)
    VALUES ('${en.logradouro}', '${en.numero}', '${en.bairro}', '${en.cidade}', '${en.estado}', '${en.cep}', ${idEmpresa});
  `;
  var resultadoEndereco = await database.executar(sqlEndereco);

  return { idEmpresa: idEmpresa, idEndereco: resultadoEndereco.insertId };
}

function editarEmpresa(idEmpresa, e) {
  var instrucaoSql = `
    UPDATE empresa SET nomeFantasia = '${e.nomeFantasia}', cnpj = '${e.cnpj}'
    WHERE idEmpresa = ${idEmpresa};
  `;
  return database.executar(instrucaoSql);
}

function cadastrarEndereco(idEmpresa, en) {
  var instrucaoSql = `
    INSERT INTO endereco (logradouro, numero, bairro, cidade, estado, cep, fkEmpresa)
    VALUES ('${en.logradouro}', '${en.numero}', '${en.bairro}', '${en.cidade}', '${en.estado}', '${en.cep}', ${idEmpresa});
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

module.exports = { listar, cadastrarEmpresa, editarEmpresa, cadastrarEndereco, editarEndereco, cadastrarAmbiente };
