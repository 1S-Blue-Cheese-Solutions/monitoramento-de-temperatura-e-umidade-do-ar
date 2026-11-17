var locaisModel = require("../models/locaisModel");

function buscarPorId(req, res) {
  //locaisModel.buscarPorId(id).then((resultado) => {
    res.status(200).json({coelho: "AAAAAA"});
    //console.log()
  //});
}


function editarLocal(req, res) {
  //locaisModel.editarLocal(id).then((resultado) => {
    res.status(200).json({coelho2: "BBBB"});
    //console.log()
  //});
}

function editarEmpresa(req, res) {
  //locaisModel.editarEmpresa(id).then((resultado) => {
    res.status(200).json({coelho2: "BBBB"});
    //console.log()
  //});
}

module.exports = { buscarPorId, editarEmpresa, editarLocal };