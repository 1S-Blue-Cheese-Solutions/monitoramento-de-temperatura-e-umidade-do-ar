create database BlueCheeseSol;

use BlueCheeseSol;

-- Usuario dat-acqu-ino
create user 'user_ino'@'localhost' identified by 'Urubu@100';
-- create user 'user_ino'@'%' identified by 'Urubu@100'; -- comando deve ser copiado na VM
grant insert on BlueCheeseSol.* to 'user_ino'@'localhost';

-- Usuario web-data-viz
create user 'user_dataViz'@'localhost' identified by 'Urubu@300';

-- create user 'user_dataViz'@'%' identified by 'Urubu@300'; -- comando deve ser copiado na VM
grant insert, select on BlueCheeseSol.* to 'user_dataViz'@'localhost';

-- comando para salvar as mudanças de usuario
flush privileges;

-- verifica se a permissão foi salva
show grants for 'user_ino'@'localhost';
show grants for 'user_dataViz'@'localhost';


create table cliente (
idCliente int primary key auto_increment,
nome varchar(60) not null,
cpf char(14) not null unique,
email varchar(100) not null unique,
	constraint chkEmail check (email like'%@%'),
numeroCelular char(11)
);

insert into cliente (nome, cpf, email, numeroCelular) values
('Guilherme Breda', '123.456.789-01', 'guilherme@email.com', '11987654321'),
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
('Câmara de Maturação 2', 'Câmara B', 'Maturação de Roquefort', 6.00, 10.00, 90, 98, 1),
('Câmara de Maturação 3', 'Câmara C', 'Maturação de Gorgonzola', 8.00, 12.00, 85, 95, 1);

create table usuario (
idUsuario int auto_increment,
login varchar(45) not null unique,
senha varchar(45) not null,
cargo varchar(11) not null default 'Funcionario',
fkCliente int not null,
fkEmpresa int,
constraint chkLogin check (login like '%_@_%.com'),
constraint chkCargo check (cargo IN ('Dono', 'Funcionario')),
constraint fkUsuario_cliente foreign key (fkCliente) references cliente(idCliente),
constraint fkUsuario_empresa foreign key (fkEmpresa) references empresa(idEmpresa),
primary key (idUsuario,fkCliente,fkEmpresa)
);

insert into usuario (login, senha, cargo, fkCliente, fkEmpresa) values
('guilherme@email.com', 'Guilherme@21', 'Dono', 1, 1),
('fernanda.souza@email.com', 'Senha@456', 'Dono', 2, 1),
('rafael.moreira@email.com', 'Senha@789', 'Dono', 3, 1);

select * from usuario;
 
create table modeloSensor (
idSensor int primary key auto_increment,
nome varchar(45),
descricao varchar(100)
);

insert into sensor (nome, descricao) values
('DHT11', 'Sensor de umidade e temperatura');

create table sensorAmbiente (
idSensorAmbiente int auto_increment,
dtInstalacao datetime default current_timestamp,
dtRemocao datetime, 
fkAmbienteProcesso int not null,
	constraint fkSensorAmbiente_ambienteProcesso foreign key (fkAmbienteProcesso) references ambienteProcesso(idAmbienteProcesso),
fkSensor int not null,
	constraint fkSensorAmbiente_sensor foreign key (fkSensor) references sensor(idSensor),
primary key (idSensorAmbiente,fkAmbienteProcesso)
) auto_increment=1;

insert into sensorAmbiente (fkAmbienteProcesso, fkSensor) values
(1, 1),
(2, 1),
(3, 1);

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

insert into leituraSensor (sensorUmidade, sensorTemperatura, dataHora, fkSensorAmbiente, fkAmbienteProcesso) values
(91.5, 10.2, now() - interval 23 hour, 1, 1),
(92.0, 10.4, now() - interval 20 hour, 1, 1),
(90.8, 10.9, now() - interval 16 hour, 1, 1),
(93.1, 11.3, now() - interval 12 hour, 1, 1),
(92.4, 10.7, now() - interval 8 hour, 1, 1),
(91.9, 10.1, now() - interval 4 hour, 1, 1),
(92.7, 10.5, now() - interval 2 hour, 1, 1),
(93.0, 10.8, now() - interval 50 minute, 1, 1),
(92.2, 10.6, now() - interval 30 minute, 1, 1),
(91.8, 10.3, now() - interval 10 minute, 1, 1),
(92.5, 10.4, now() - interval 5 minute, 1, 1),
(92.1, 10.5, now() - interval 90 second, 1, 1),
(92.3, 10.7, now() - interval 45 second, 1, 1),
(92.6, 10.6, now() - interval 10 second, 1, 1);

insert into leituraSensor (sensorUmidade, sensorTemperatura, dataHora, fkSensorAmbiente, fkAmbienteProcesso) values
(180, 99, now() - interval 1 hour, 1, 1);

select * from leituraSensor;

-- Selects dashboard

-- Primeira KPI: Temperatura Atual
select sensorTemperatura as 'Temperatura',
	case
		when sensorTemperatura between 8 and 12 then 'Dentro da faixa'
        else 'Fora da faixa'
	end as 'Temperatura Atual'
from leituraSensor;


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
from leituraSensor as l
	join ambienteProcesso as a
		on l.fkAmbienteProcesso = a.idAmbienteProcesso
        where l.fkAmbienteProcesso = 1;
        
        
-- Quarta KPI quantidade de alertas
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
		where l.fkAmbienteProcesso = 1
		and date(l.dataHora) >= curdate() - interval 1 day;


-- Gráfico de Temperatura por hora (últimas 24 horas)
select
	date_format(dataHora, '%d/%m %H:%i:%s') as 'Horário',
    round(avg(sensorTemperatura), 1) as 'Temperatura'
from leituraSensor
where fkAmbienteProcesso = 1
	and dataHora >= curdate() - interval 24 hour
group by date_format(dataHora, '%d/%m %H:%i:%s')
order by min(dataHora);

-- Gráfico de Umidade por hora (últimas 24 horas)
select
	date_format(dataHora, '%d/%m %H:%i:%s') as 'Horário',
    round(avg(sensorUmidade), 1) as 'Umidade'
from leituraSensor
where fkAmbienteProcesso = 1
	and dataHora >= curdate() - interval 24 hour
group by date_format(dataHora, '%d/%m %H:%i:%s')
order by min(dataHora);


-- Alertas recentes para queijo gorgonzola

select 	
	case 
		when l.sensorUmidade between 85 and 95 then 'Normal'
		when l.sensorUmidade between 83 and 97 then 'Atenção'
		else 'Crítico'
	end as 'Alertas Recentes de Umidade',
	case 
		when l.sensorTemperatura between 6 and 8 then 'Normal'
		when l.sensorTemperatura between 1 and 13 then 'Atenção'
		else 'Crítico'
	end as 'Alertas Recentes de Temperatura'
from leituraSensor as l
where fkAmbienteProcesso = 1
order by l.dataHora desc
limit 10;