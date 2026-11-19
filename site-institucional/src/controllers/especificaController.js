var especificaModel = require("../models/especificaModel");


function kpi1(req, res) {
var fkSensorAmbiente = req.body.fkSensorAmbiente;
var fkAmbienteProcesso = req.body.fkAmbienteProcesso;

    if(fkSensorAmbiente == undefined) {
        res.status(400).send("Seu fkSensorAmbiente está undefined!");
    } else if(fkAmbienteProcesso == undefined){
        res.status(400).send("Seu fkAmbienteProcesso está undefined!");

    }

        especificaModel.kpi1(fkSensorAmbiente, fkAmbienteProcesso).then(function (resultado) {
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

function kpi2(req, res) {
var fkSensorAmbiente = req.body.fkSensorAmbiente;
var fkAmbienteProcesso = req.body.fkAmbienteProcesso;

    if(fkSensorAmbiente == undefined) {
        res.status(400).send("Seu fkSensorAmbiente está undefined!");
    } else if(fkAmbienteProcesso == undefined){
        res.status(400).send("Seu fkAmbienteProcesso está undefined!");

    }

        especificaModel.kpi2(fkSensorAmbiente, fkAmbienteProcesso).then(function (resultado) {
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

function kpi4(req, res) {
var fkSensorAmbiente = req.body.fkSensorAmbiente;
var fkAmbienteProcesso = req.body.fkAmbienteProcesso;

    if(fkSensorAmbiente == undefined) {
        res.status(400).send("Seu fkSensorAmbiente está undefined!");
    } else if(fkAmbienteProcesso == undefined){
        res.status(400).send("Seu fkAmbienteProcesso está undefined!");

    }

        especificaModel.kpi2(fkSensorAmbiente, fkAmbienteProcesso).then(function (resultado) {
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


module.exports = {
    kpi1,
    kpi2,
    kpi4
}