var database = require("../database/config")

function autenticar(email, senha) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ", email, senha)
    var instrucaoSql = `
        SELECT u.idUsuario, u.login, u.senha, u.fkCliente, c.nome, e.nomeFantasia FROM usuario u 
        JOIN cliente c ON u.fkCliente = c.idCliente 
        JOIN empresa e ON u.fkEmpresa = e.idEmpresa
        WHERE u.login = '${email}' AND u.senha = '${senha}';
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
    var resultadoCliente = await database.executar(sqlCliente);
    var idCliente = resultadoCliente.insertId;

    var sqlEmpresa = `
        INSERT INTO empresa (nomeFantasia, cnpj, fkCliente)
        VALUES ('${nomeFantasia}', '${cnpj}', ${idCliente});
    `;

    var resultadoEmpresa = await database.executar(sqlEmpresa);
    var idEmpresa = resultadoEmpresa.insertId;
    
    var sqlUsuario = `
        INSERT INTO usuario (login, senha, fkCliente, fkEmpresa)
        VALUES ('${email}', '${senha}', ${idCliente}, ${idEmpresa});
    `;
    return database.executar(sqlUsuario);
}

module.exports = {
    autenticar,
    cadastrar
};