var database = require("../database/config")

function autenticar(email, senha) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ", email, senha)
    var instrucaoSql = `
        SELECT idUsuario, login, senha, fkCliente as empresaId FROM usuario WHERE login = '${email}' AND senha = '${senha}';
    `
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

// Coloque os mesmos parâmetros aqui. Vá para a var instrucaoSql
async function cadastrar(nomeFantasia, numeroCelular, cnpj, nome, email, senha, cpf) {
    console.log("ACESSEI O USUARIO MODEL \n\n function cadastrar():", nome, email, senha, cpf);

    var sqlCliente = `
        INSERT INTO cliente (nome, cpf, email, numeroCelular)
        VALUES ('${nome}', '${cpf}', '${email}', '${numeroCelular}');
    `;
    await database.executar(sqlCliente);

    var sqlEmpresa = `
        INSERT INTO empresa (nomeFantasia, cnpj, fkCliente)
        VALUES ('${nomeFantasia}', '${cnpj}', 1);
    `;
    await database.executar(sqlEmpresa);

    var sqlUsuario = `
        INSERT INTO usuario (login, senha, fkCliente)
        VALUES ('${email}', '${senha}', 1);
    `;
    return database.executar(sqlUsuario);
}

module.exports = {
    autenticar,
    cadastrar
};