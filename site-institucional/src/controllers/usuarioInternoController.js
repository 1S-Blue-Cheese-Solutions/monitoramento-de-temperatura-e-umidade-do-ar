var usuarioInternoModel = require("../models/usuarioInternoModel");

function listarPorEmpresa(req, res) {
    var idEmpresa = req.params.idEmpresa;

    if (idEmpresa == undefined || idEmpresa == "undefined") {
        res.status(400).send("O id da empresa está indefinido!");
        return;
    }

    usuarioInternoModel.listarPorEmpresa(idEmpresa)
        .then(function (resultado) {
            if (resultado.length > 0) {
                res.status(200).json(resultado);
            } else {
                res.status(204).send("Nenhum usuário encontrado!");
            }
        }).catch(function (erro) {
            console.log(erro);
            console.log("Houve um erro ao listar os usuários: ", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}

function listarEmpresas(req, res) {
    var idCliente = req.params.idCliente;

    if (idCliente == undefined || idCliente == "undefined") {
        res.status(400).send("O id do cliente está indefinido!");
        return;
    }

    // empresa atual de quem está logado (vem como ?idEmpresa=); 0 quando não vier
    var idEmpresaAtual = Number(req.query.idEmpresa) || 0;

    usuarioInternoModel.listarEmpresas(idCliente, idEmpresaAtual)
        .then(function (resultado) {
            if (resultado.length > 0) {
                res.status(200).json(resultado);
            } else {
                res.status(204).send("Nenhuma empresa encontrada!");
            }
        }).catch(function (erro) {
            console.log(erro);
            console.log("Houve um erro ao listar as empresas: ", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}

function cadastrar(req, res) {
    var login = req.body.loginServer;
    var senha = req.body.senhaServer;
    var fkCliente = req.body.fkClienteServer;
    var fkEmpresa = req.body.fkEmpresaServer;

    if (login == undefined || login == "") {
        res.status(400).send("O login está indefinido!");
    } else if (senha == undefined || senha.length < 8) {
        res.status(400).send("A senha precisa ter pelo menos 8 caracteres!");
    } else if (fkCliente == undefined || fkCliente == "undefined") {
        res.status(400).send("O id do cliente está indefinido!");
    } else if (fkEmpresa == undefined || fkEmpresa == "") {
        res.status(400).send("A empresa está indefinida!");
    } else {
        usuarioInternoModel.cadastrar(login, senha, fkCliente, fkEmpresa)
            .then(function (resultado) {
                res.status(201).json(resultado);
            }).catch(function (erro) {
                console.log(erro);
                console.log("Houve um erro ao cadastrar o usuário: ", erro.sqlMessage);
                if (erro.code == "ER_DUP_ENTRY") {
                    res.status(409).send("Já existe um usuário com esse login!");
                } else {
                    res.status(500).json(erro.sqlMessage);
                }
            });
    }
}

module.exports = {
    listarPorEmpresa,
    listarEmpresas,
    cadastrar
};