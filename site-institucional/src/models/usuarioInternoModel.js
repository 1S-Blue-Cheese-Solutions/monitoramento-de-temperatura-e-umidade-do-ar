var database = require("../database/config");

function listarPorEmpresa(idEmpresa) {
    var instrucaoSql = `
        SELECT u.idUsuario, u.login, u.cargo, u.fkEmpresa,
            CASE WHEN u.cargo = 'Dono' THEN c.nome ELSE u.login END AS nome,
            e.nomeFantasia
        FROM usuario u
        JOIN cliente c ON u.fkCliente = c.idCliente
        JOIN empresa e ON u.fkEmpresa = e.idEmpresa
        WHERE u.fkEmpresa = ${idEmpresa};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function listarEmpresas(idCliente) {
    var instrucaoSql = `
        SELECT idEmpresa, nomeFantasia
        FROM empresa
        WHERE fkCliente = ${idCliente}
        ORDER BY nomeFantasia;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function cadastrar(login, senha, fkCliente, fkEmpresa) {
    var instrucaoSql = `
        INSERT INTO usuario (login, senha, cargo, fkCliente, fkEmpresa)
        VALUES ('${login}', '${senha}', 'Funcionario', ${fkCliente}, ${fkEmpresa});
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    listarPorEmpresa,
    listarEmpresas,
    cadastrar
};