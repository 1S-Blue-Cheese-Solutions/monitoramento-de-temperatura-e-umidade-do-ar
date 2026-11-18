var database = require("../database/config")

function kpi1(fkSensorAmbiente, fkAmbienteProcesso) {
    var instrucaoSql = `
    select sensorTemperatura as 'Temperatura'
from leituraSensor join sensorAmbiente as sensorAmbiente on fkSensorAmbiente = idSensorAmbiente
join sensorAmbiente as ambienteProcesso on leituraSensor.fkAmbienteProcesso = ambienteProcesso.fkAmbienteProcesso
where leituraSensor.fkSensorAmbiente = ${fkSensorAmbiente} and leituraSensor.fkAmbienteProcesso = ${fkAmbienteProcesso}  order by dataHora desc LIMIT 1;`

    return database.executar(instrucaoSql,);
}

function kpi2() {
    var instrucaoSql = `
    select sensorTemperatura as 'Temperatura',
	case
		when sensorTemperatura between 8 and 12 then 'Dentro da faixa'
        else 'Fora da faixa'
	end as 'Temperatura Atual'
    from leituraSensor 
    join sensorAmbiente as sensorAmbiente on fkSensorAmbiente = idSensorAmbiente
    join sensorAmbiente as ambienteProcesso on leituraSensor.fkAmbienteProcesso = ambienteProcesso.fkAmbienteProcesso
    where idSensor = ? and leituraSensor.fkSensorAmbiente = ? and leituraSensor.fkAmbienteProcesso = ?; `

    return database.executar(instrucaoSql);
}

module.exports = {
    kpi1
}