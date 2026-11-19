var usuarioInternoModel = require("../models/usuarioInternoModel");

function listarPorEmpresa(req, res) {
    var idEmpresa = req.params.idEmpresa;

    if (idEmpresa == undefined || idEmpresa == "undefined") {
        res.status(400).send("O id da empresa está indefinido!");
        return;
    }

    acessoModel.listarPorEmpresa(idEmpresa)
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

module.exports = {
    listarPorEmpresa
};