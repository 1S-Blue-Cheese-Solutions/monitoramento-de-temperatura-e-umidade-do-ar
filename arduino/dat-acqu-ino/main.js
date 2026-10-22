// importa os bibliotecas necessários
const serialport = require('serialport');
const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');

// Define o arquivo com base na variável NODE_ENV
const envFile = process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env';
dotenv.config({ path: envFile });

// Definindo as variavéis do projeto
const HOST_BD = process.env.HOST_BD;
const USER_BD = process.env.USER_BD;
const PASSWORD_BD = process.env.PASSWORD_BD;
const DATABASE_BD = process.env.DATABASE_BD;
const PORT = process.env.PORT;

// constantes para configurações
const SERIAL_BAUD_RATE = 9600;
const SERVIDOR_PORTA = 3300;

// habilita ou desabilita a inserção de dados no banco de dados
const HABILITAR_OPERACAO_INSERIR = true;

// função para comunicação serial
const serial = async (
    valoresSensorUmidade,
    valoresSensorTemp,
) => {

    // conexão com o banco de dados MySQL
    let poolBancoDados = mysql.createPool(
        {
            host: HOST_BD,
            user: USER_BD,
            password: PASSWORD_BD,
            database: DATABASE_BD,
            port: PORT
        }
    ).promise();

    // lista as portas seriais disponíveis e procura pelo Arduino
    const portas = await serialport.SerialPort.list();
    const portaArduino = portas.find((porta) => porta.vendorId == 2341 && porta.productId == 43);
    if (!portaArduino) {
        throw new Error('O arduino não foi encontrado em nenhuma porta serial');
    }

    // configura a porta serial com o baud rate especificado
    const arduino = new serialport.SerialPort(
        {
            path: portaArduino.path,
            baudRate: SERIAL_BAUD_RATE
        }
    );

    // evento quando a porta serial é aberta
    arduino.on('open', () => {
        console.log(`A leitura do arduino foi iniciada na porta ${portaArduino.path} utilizando Baud Rate de ${SERIAL_BAUD_RATE}`);
    });

    // processa os dados recebidos do Arduino
    arduino.pipe(new serialport.ReadlineParser({ delimiter: '\r\n' })).on('data', async (data) => {
        console.log(data);
        const valores = data.split(';');
        const sensorAnalogicoTemp = parseFloat(valores[1]);
        const sensorAnalogicoUmidade = parseFloat(valores[0]);

        // armazena os valores dos sensores nos arrays correspondentes
        valoresSensorUmidade.push(sensorAnalogicoUmidade);
        valoresSensorTemp.push(sensorAnalogicoTemp);

        // insere os dados no banco de dados (se habilitado)
        if (HABILITAR_OPERACAO_INSERIR) {

            // este insert irá inserir os dados na tabela "medida"
            await poolBancoDados.execute(
                'INSERT INTO leituraSensor (sensorUmidade, sensorTemperatura, fkSensorAmbiente, fkAmbienteProcesso) VALUES (?, ?, 1, 1)',
                [sensorAnalogicoUmidade, sensorAnalogicoTemp]
            );
            console.log("valores inseridos no banco: ", sensorAnalogicoUmidade + ", " + sensorAnalogicoTemp);

            const ACRESCIMO_SALA_2_UMIDADE = sensorAnalogicoUmidade + 10;
            const ACRESCIMO_SALA_2_TEMPERATURA = sensorAnalogicoUmidade + 10;
            await poolBancoDados.execute(
                'INSERT INTO leituraSensor (sensorUmidade, sensorTemperatura, fkSensorAmbiente, fkAmbienteProcesso) VALUES (?, ?, 2, 2)',
                [ACRESCIMO_SALA_2_UMIDADE, ACRESCIMO_SALA_2_TEMPERATURA]
            );
            console.log("valores inseridos no banco: ", ACRESCIMO_SALA_2_UMIDADE + ", " + ACRESCIMO_SALA_2_TEMPERATURA);

            const ACRESCIMO_SALA_3_UMIDADE = sensorAnalogicoUmidade + 10;
            const ACRESCIMO_SALA_3_TEMPERATURA = sensorAnalogicoUmidade + 10;
            await poolBancoDados.execute(
                'INSERT INTO leituraSensor (sensorUmidade, sensorTemperatura, fkSensorAmbiente, fkAmbienteProcesso) VALUES (?, ?, 3, 3)',
                [ACRESCIMO_SALA_3_UMIDADE, ACRESCIMO_SALA_3_TEMPERATURA]
            );
            console.log("valores inseridos no banco: ", ACRESCIMO_SALA_3_UMIDADE + ", " + ACRESCIMO_SALA_3_TEMPERATURA);

        }

    });

    // evento para lidar com erros na comunicação serial
    arduino.on('error', (mensagem) => {
        console.error(`Erro no arduino (Mensagem: ${mensagem}`)
    });
}

// função para criar e configurar o servidor web
const servidor = (
    valoresSensorUmidade,
    valoresSensorTemp
) => {
    const app = express();

    // configurações de requisição e resposta
    app.use((request, response, next) => {
        response.header('Access-Control-Allow-Origin', '*');
        response.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');
        next();
    });

    // inicia o servidor na porta especificada
    app.listen(SERVIDOR_PORTA, () => {
        console.log(`API executada com sucesso na porta ${SERVIDOR_PORTA}`);
    });

    // define os endpoints da API para cada tipo de sensor
    app.get('/sensores/umidade', (_, response) => {
        return response.json(valoresSensorUmidade);
    });
    app.get('/sensores/temperatura', (_, response) => {
        return response.json(valoresSensorTemp);
    });
}

// função principal assíncrona para iniciar a comunicação serial e o servidor web
(async () => {
    // arrays para armazenar os valores dos sensores
    const valoresSensorUmidade = [];
    const valoresSensorTemp = [];

    // inicia a comunicação serial
    await serial(
        valoresSensorUmidade,
        valoresSensorTemp
    );

    // inicia o servidor web
    servidor(
        valoresSensorUmidade,
        valoresSensorTemp
    );
})();