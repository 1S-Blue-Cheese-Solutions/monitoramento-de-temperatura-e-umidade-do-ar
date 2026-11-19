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

function kpi4(fkSensorAmbiente, fkAmbienteProcesso) {
    var instrucaoSql = `
    select
sum(
				case
					when l.sensorTemperatura < a.temperaturaMin or l.sensorTemperatura > a.temperaturaMax
					then 1
					else 0
				end
			)
			+ sum(
				case
					when l.sensorUmidade < a.umidadeMin or l.sensorUmidade > a.umidadeMax
					then 1
					else 0
				end
	) as 'Quantidade de alertas'
from leituraSensor as l
	join ambienteProcesso as a
		on l.fkAmbienteProcesso = a.idAmbienteProcesso
		where l.fkAmbienteProcesso = ${fkAmbienteProcesso} and l.fkSensorAmbiente = ${fkAmbienteProcesso}
		and date(l.dataHora) >= curdate() - interval 1 day;
    `
}

module.exports = {
    kpi1,
    kpi2,
    kpi4
}