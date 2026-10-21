create database BlueCheeseSol;

use BlueCheeseSol;

-- Usuario dat-acqu-ino
create user 'user_ino'@'localhost' identified by 'Urubu@100';
grant insert on BlueCheeseSol.* to 'user_ino '@'localhost';

-- Usuario web-data-viz
create user 'user_dataViz'@'localhost' identified by 'Urubu@300';
grant insert, select on BlueCheeseSol.* to 'user_dataViz '@'localhost';

-- comando para salvar as mudanças de usuario
flush privileges;

-- verifica se a permissão foi salva
show grants for 'usuario_insert'@'localhost';

create table cliente (
idCliente int primary key auto_increment,
nome varchar(60) not null,
cpf varchar(45) not null,
email varchar(100) not null,
	constraint chkEmail check (email like'%@%'),
numeroCelular char(11)
);

insert into cliente (nome, cpf, email, numeroCelular) values
('Marcos Almeida', '123.456.789-01', 'marcos.almeida@queijariaserra.com.br', '11987654321'),
('Fernanda Souza', '234.567.890-12', 'fernanda@laticiniosvale.com.br', '11976543210'),
('Rafael Moreira', '345.678.901-23', 'rafael.moreira@fazendaazul.com.br', '19965432109');

create table empresa (
idEmpresa int primary key auto_increment,
nomeFantasia varchar(50) not null,
cnpj varchar(25) unique not null,
fkCliente int not null,
	constraint fkEmpresa_cliente foreign key (fkCliente) references cliente(idCliente)
);

insert into empresa (nomeFantasia, cnpj, fkCliente) values
('Queijaria Serra Azul', '12.345.678/0001-90', 1),
('Laticínios Vale Verde', '23.456.789/0001-01', 2),
('Fazenda Azul Gourmet', '34.567.890/0001-12', 3);

create table endereco (
idEndereco int primary key auto_increment,
logradouro varchar(80) not null,
numero varchar(10),
bairro varchar(50) not null,
cidade varchar(45) not null,
estado char(2) not null,
cep char(8) not null,
fkEmpresa int not null,
	constraint fkEndereco_empresa foreign key (fkEmpresa) references empresa(idEmpresa)
);

insert into endereco (logradouro, numero, bairro, cidade, estado, cep, fkEmpresa) values
('Estrada do Queijo', '1500', 'Zona Rural', 'Cunha', 'SP', '12530000', 1),
('Rua das Acácias', '230', 'Centro', 'Poços de Caldas', 'MG', '37701000', 2),
('Rodovia SP-340 km 12', 's/n', 'Zona Rural', 'Mogi Mirim', 'SP', '13800000', 3);

create table ambienteProcesso (
idAmbienteProcesso int primary key auto_increment,
nomePrincipal varchar(45) not null,
nomeAuxiliar varchar(45),
descricao varchar(45),
temperaturaMin decimal(6,2) not null,
temperaturaMax decimal(6,2) not null,
umidadeMin int not null,
umidadeMax int not null,
fkEndereco int not null,
	constraint fkAmbienteProcesso_endereco foreign key (fkEndereco) references endereco(idEndereco)
);

insert into ambienteProcesso (nomePrincipal, nomeAuxiliar, descricao, temperaturaMin, temperaturaMax, umidadeMin, umidadeMax, fkEndereco) values
('Câmara de Maturação 1', 'Câmara A', 'Maturação de Gorgonzola', 8.00, 12.00, 85, 95, 1),
('Câmara de Maturação 2', 'Câmara B', 'Maturação de Roquefort', 6.00, 10.00, 90, 98, 2);

create table usuario (
idUsuario int auto_increment,
login varchar(45) not null,
senha varchar(45) not null,
fkCliente int not null,
	constraint fkUsuario_cliente foreign key (fkCliente) references cliente(idCliente),
primary key (idUsuario,fkCliente)
);

insert into usuario (login, senha, fkCliente) values
('marcos.almeida', 'Senha@123', 1),
('fernanda.souza', 'Senha@456', 2),
('rafael.moreira', 'Senha@789', 3);
 
create table sensor (
idSensor int primary key auto_increment,
nome varchar(45),
descricao varchar(100)
);

insert into sensor (nome, descricao) values
('DHT11', 'Sensor de umidade e temperatura'),
('DHT11', 'Sensor de umidade e temperatura'),
('DHT11',  'Sensor analógico de temperatura');

create table sensorAmbiente (
idSensorAmbiente int auto_increment,
fkAmbienteProcesso int not null,
	constraint fkSensorAmbiente_ambienteProcesso foreign key (fkAmbienteProcesso) references ambienteProcesso(idAmbienteProcesso),
fkSensor int not null,
	constraint fkSensorAmbiente_sensor foreign key (fkSensor) references sensor(idSensor),
primary key (idSensorAmbiente,fkAmbienteProcesso)
) auto_increment=1;

insert into sensorAmbiente (fkAmbienteProcesso, fkSensor) values
(1, 1),
(2, 2);

create table leituraSensor (
idLeituraSensor int auto_increment,
sensorUmidade float,
sensorTemperatura float,
dataHora timestamp default current_timestamp,
fkSensorAmbiente int not null,
	constraint fkLeituraSensor_SensorAmbiente foreign key (fkSensorAmbiente) references sensorAmbiente(idSensorAmbiente),
fkAmbienteProcesso int not null,
	constraint fkLeituraSensor_ambienteProcesso foreign key (fkAmbienteProcesso) references ambienteProcesso(idAmbienteProcesso),
primary key (idLeituraSensor,fkSensorAmbiente,fkAmbienteProcesso)
);

insert into leituraSensor (sensorUmidade, sensorTemperatura, fkSensorAmbiente, fkAmbienteProcesso) values
(88.5, 10.2, 1, 1),
(92.1, 8.7, 1, 1);

select * from leituraSensor;

-- Selects dashboard

-- Primeira KPI: Temperatura Atual
select sensorTemperatura as 'Temperatura',
	case
		when sensorTemperatura between 8 and 12 then 'Dentro da faixa'
        else 'Fora da faixa'
	end as 'Temperatura Atual'
from sensorTemperatura;

-- Segunda KPI: Umidade Atual
select sensorUmidade as 'Umidade',
	case
		when sensorUmidade between 90 and 98 then 'Dentro da faixa'
        else 'Fora da faixa'
	end as 'Umidade Atual'
from leituraSensor;

-- Terceira KPI: Tempo na Faixa Ideal
select
	round(
		(
			sum(
				case
					when l.sensorTemperatura between a.temperaturaMin and a.temperaturaMax
					then 1
					else 0
				end
			)
			+ sum(
				case
					when l.sensorUmidade between a.umidadeMin and a.umidadeMax
					then 1
					else 0
				end
			)
		) * 100.0 / (count(*) * 2), 1
	) as 'Tempo na Faixa Ideal (%)'
from leituraSensor l
	join ambienteProcesso a
		on l.fkAmbienteProcesso = a.idAmbienteProcesso;

-- Quarta KPI:
SELECT
    COUNT(*)                        AS 'Alertas no Período',
    SUM(critico)                    AS 'Críticos',
    SUM(1 - critico)                AS 'Atenção'
FROM (
    -- Alertas de temperatura
    SELECT
        CASE
            WHEN l.sensorTemperatura < a.temperaturaMin - 2
              OR l.sensorTemperatura > a.temperaturaMax + 2
            THEN 1
            ELSE 0
        END AS critico
    FROM leituraSensor l
        JOIN ambienteProcesso a
            ON l.fkAmbienteProcesso = a.idAmbienteProcesso
    WHERE l.dataHora >= '2026-10-11 00:00:00'
      AND l.dataHora <  '2026-10-18 00:00:00'
      AND (l.sensorTemperatura < a.temperaturaMin
        OR l.sensorTemperatura > a.temperaturaMax)

    UNION ALL

    -- Alertas de umidade
    SELECT
        CASE
            WHEN l.sensorUmidade < a.umidadeMin - 5
              OR l.sensorUmidade > a.umidadeMax + 5
            THEN 1
            ELSE 0
        END AS critico
    FROM leituraSensor l
        JOIN ambienteProcesso a
            ON l.fkAmbienteProcesso = a.idAmbienteProcesso
    WHERE l.dataHora >= '2026-10-11 00:00:00'
      AND l.dataHora <  '2026-10-18 00:00:00'
      AND (l.sensorUmidade < a.umidadeMin
        OR l.sensorUmidade > a.umidadeMax)
) AS alertas;