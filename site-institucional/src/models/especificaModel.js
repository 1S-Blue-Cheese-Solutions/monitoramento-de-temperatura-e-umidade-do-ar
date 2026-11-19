var database = require("../database/config")

function kpi1(fkSensorAmbiente, fkAmbienteProcesso) {
    var instrucaoSql = `
    select sensorTemperatura as 'Temperatura'
    from leituraSensor 
    join sensorAmbiente as sensorAmbiente on fkSensorAmbiente = idSensorAmbiente
    join sensorAmbiente as ambienteProcesso on leituraSensor.fkAmbienteProcesso = ambienteProcesso.fkAmbienteProcesso
    where leituraSensor.fkSensorAmbiente = ${fkSensorAmbiente} and leituraSensor.fkAmbienteProcesso = ${fkAmbienteProcesso}  order by dataHora desc LIMIT 1;`

    return database.executar(instrucaoSql);
}

function kpi2(fkSensorAmbiente, fkAmbienteProcesso) {
    var instrucaoSql = `
    select sensorUmidade as 'Umidade'
    from leituraSensor 
    join sensorAmbiente as sensorAmbiente on fkSensorAmbiente = idSensorAmbiente
    join sensorAmbiente as ambienteProcesso on leituraSensor.fkAmbienteProcesso = ambienteProcesso.fkAmbienteProcesso
    where leituraSensor.fkSensorAmbiente = ${fkSensorAmbiente} and leituraSensor.fkAmbienteProcesso = ${fkAmbienteProcesso}  order by dataHora desc LIMIT 1;`

    return database.executar(instrucaoSql);
}

module.exports = {
    kpi1,
    kpi2
}