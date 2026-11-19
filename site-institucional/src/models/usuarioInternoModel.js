var database = require("../database/config");

function listarPorEmpresa(idEmpresa) {
    var instrucaoSql = `
        SELECT u.idUsuario, u.login, u.cargo, c.nome, e.nomeFantasia
        FROM usuario u
        JOIN cliente c ON u.fkCliente = c.idCliente
        JOIN empresa e ON u.fkEmpresa = e.idEmpresa
        WHERE u.fkEmpresa = ${idEmpresa};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    listarPorEmpresa
};