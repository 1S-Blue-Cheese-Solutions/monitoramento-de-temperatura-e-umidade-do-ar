create database BlueCheeseSol;

use BlueCheeseSol;
create user 'usuario_insert '@'localhost' identified by 'QueijoAzul100';

grant insert on BlueCheeseSol.* to 'usuario_insert '@'localhost';
grant select on BlueCheeseSol.* to 'usuario_insert '@'localhost';

-- comando para salvar as mudanças de usuario
flush privileges;

-- verifica se a permissão foi salva
show grants for 'usuario_insert'@'localhost';

create table empresa (
idEmpresa int primary key auto_increment,
nomeFantasia varchar(50),
cnpj varchar(25),
fkCliente int not null,
	constraint fkEmpresa_cliente foreign key (fkCliente) references cliente(idCliente)
);

insert into empresa (nomeFantasia, cnpj, fkCliente) values
('Queijaria Serra Azul', '12.345.678/0001-90', 1),
('Laticínios Vale Verde', '23.456.789/0001-01', 2),
('Fazenda Azul Gourmet', '34.567.890/0001-12', 3);

select * from cliente;

create table endereco (
idEndereco int primary key auto_increment,
logradouro varchar(80),
numero varchar(10),
bairro varchar(50),
cidade varchar(50),
estado char(2),
cep char(8),
fkEmpresa int not null,
	constraint fkEndereco_empresa foreign key (fkEmpresa) references empresa(idEmpresa)
);

insert into endereco (logradouro, numero, bairro, cidade, estado, cep, fkEmpresa) values
('Estrada do Queijo', '1500', 'Zona Rural', 'Cunha', 'SP', '12530000', 1),
('Rua das Acácias', '230', 'Centro', 'Poços de Caldas', 'MG', '37701000', 2),
('Rodovia SP-340 km 12', 's/n', 'Zona Rural', 'Mogi Mirim', 'SP', '13800000', 3);

create table cliente (
idCliente int primary key auto_increment,
nome varchar(60),
cpf varchar(45),
email varchar(100),
	constraint chkEmail check (email like'%@%'),
numeroCelular char(11)
);

insert into cliente (nome, cpf, email, numeroCelular) values
('Marcos Almeida', '123.456.789-01', 'marcos.almeida@queijariaserra.com.br', '11987654321'),
('Fernanda Souza', '234.567.890-12', 'fernanda@laticiniosvale.com.br', '11976543210'),
('Rafael Moreira', '345.678.901-23', 'rafael.moreira@fazendaazul.com.br', '19965432109');

create table ambienteProcesso (
idAmbienteProcesso int primary key auto_increment,
nomePrincipal varchar(45),
nomeAuxiliar varchar(45),
descricao varchar(45),
temperaturaMin decimal(6,2),
temperaturaMax decimal(6,2),
umidadeMin int,
umidadeMax int,
fkEmpresa int not null,
	constraint fkAmbienteProcesso_empresa foreign key (fkEmpresa) references empresa(idEmpresa)
);

insert into ambienteProcesso (nomePrincipal, nomeAuxiliar, descricao, temperaturaMin, temperaturaMax, umidadeMin, umidadeMax, fkEmpresa) values
('Câmara de Maturação 1', 'Câmara A', 'Maturação de Gorgonzola', 8.00, 12.00, 85, 95, 1),
('Câmara de Maturação 2', 'Câmara B', 'Maturação de Roquefort', 6.00, 10.00, 90, 98, 2),
('Câmara de Maturação 3', 'Câmara C', 'Salga dos queijos azuis', 10.00, 14.00, 75, 85, 3);

create table usuario (
idUsuario int auto_increment,
login varchar(45),
senha varchar(45),
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
);

insert into sensorAmbiente (fkAmbienteProcesso, fkSensor) values
(1, 1),
(2, 2),
(3, 3);

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
(92.1,  8.7, 2, 2),
(79.8, 12.4, 3, 3);

select * from leituraSensor;