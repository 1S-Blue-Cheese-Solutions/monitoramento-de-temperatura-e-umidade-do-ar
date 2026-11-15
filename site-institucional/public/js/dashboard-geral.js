// Dados mockados: a câmara 1 segue os dados da dashboard (dia 13/10), as câmaras 2 e 3 têm valores fictícios
let camaras = [
  {
    id: 1, nome: 'Câmara de Maturação 1 - Roquefort',
    temperaturaMinima: 8, temperaturaMaxima: 12, umidadeMinima: 90, umidadeMaxima: 98,
    temperatura: 8.9, umidade: 92.7, horaLeitura: '20:55', segundosDesdeLeitura: 3,
    minutosForaAgora: 0, minutosForaHoje: 234,
    sensores: [
      {
        id: 1, nome: 'Sensor 1',
        temperatura: 8.8, umidade: 92.9, horaLeitura: '20:55', segundosDesdeLeitura: 3,
        minutosForaAgora: 0, minutosForaHoje: 118
      },
      {
        id: 2, nome: 'Sensor 2',
        temperatura: 9.1, umidade: 92.4, horaLeitura: '20:54', segundosDesdeLeitura: 45,
        minutosForaAgora: 0, minutosForaHoje: 116
      }
    ]
  },
  {
    id: 2, nome: 'Câmara de Maturação 2 - Roquefort',
    temperaturaMinima: 8, temperaturaMaxima: 12, umidadeMinima: 85, umidadeMaxima: 95,
    temperatura: 12.9, umidade: 88.4, horaLeitura: '20:55', segundosDesdeLeitura: 2,
    minutosForaAgora: 52, minutosForaHoje: 127,
    sensores: [
      {
        id: 3, nome: 'Sensor 3',
        temperatura: 13.2, umidade: 88.0, horaLeitura: '20:55', segundosDesdeLeitura: 2,
        minutosForaAgora: 52, minutosForaHoje: 64
      },
      {
        id: 4, nome: 'Sensor 4',
        temperatura: 12.6, umidade: 88.8, horaLeitura: '20:55', segundosDesdeLeitura: 8,
        minutosForaAgora: 48, minutosForaHoje: 63
      }
    ]
  },
  {
    id: 3, nome: 'Câmara de Maturação 3 - Roquefort',
    temperaturaMinima: 8, temperaturaMaxima: 12, umidadeMinima: 85, umidadeMaxima: 95,
    temperatura: 9.7, umidade: 88.6, horaLeitura: '20:55', segundosDesdeLeitura: 4,
    minutosForaAgora: 0, minutosForaHoje: 0,
    sensores: [
      {
        id: 5, nome: 'Sensor 5',
        temperatura: 9.6, umidade: 88.7, horaLeitura: '20:55', segundosDesdeLeitura: 4,
        minutosForaAgora: 0, minutosForaHoje: 0
      },
      {
        id: 6, nome: 'Sensor 6',
        temperatura: 9.8, umidade: 88.4, horaLeitura: '20:12', segundosDesdeLeitura: 2580,
        minutosForaAgora: 0, minutosForaHoje: 0
      }
    ]
  }
];

// Total de minutos fora da faixa no dia anterior, somando as câmaras
let minutosForaOntem = 289;

let limiteSemDados = 120; // segundos sem leitura para considerar o sensor parado

// ===== Funções de apoio =====

// 8.9 -> "8,9"
function formatarNumero(valor) {
  return valor.toFixed(1).replace('.', ',');
}

// 100 minutos -> "1 h 40 min"
function textoDuracao(minutos) {
  let horas = Math.floor(minutos / 60);
  let resto = minutos % 60;

  if (horas == 0) {
    return resto + ' min';
  } else if (resto == 0) {
    return horas + ' h';
  } else {
    return horas + ' h ' + resto + ' min';
  }
}

// 100 minutos -> "1 h 40 min" (número grande e a unidade pequena)
function valorDuracao(minutos) {
  let horas = Math.floor(minutos / 60);
  let resto = minutos % 60;

  if (horas == 0) {
    return resto + '<span class="card-unit">min</span>';
  } else if (resto == 0) {
    return horas + '<span class="card-unit">h</span>';
  } else {
    return horas + '<span class="card-unit">h</span> ' + resto + '<span class="card-unit">min</span>';
  }
}

function temperaturaFora(camara) {
  return camara.temperatura < camara.temperaturaMinima || camara.temperatura > camara.temperaturaMaxima;
}

function umidadeFora(camara) {
  return camara.umidade < camara.umidadeMinima || camara.umidade > camara.umidadeMaxima;
}

function estaFora(camara) {
  return temperaturaFora(camara) || umidadeFora(camara);
}

function enviandoDados(camara) {
  return camara.segundosDesdeLeitura < limiteSemDados;
}

function sensorEnviandoDados(sensor) {
  return sensor.segundosDesdeLeitura < limiteSemDados;
}

function sensorTemperaturaFora(camara, sensor) {
  return sensor.temperatura < camara.temperaturaMinima || sensor.temperatura > camara.temperaturaMaxima;
}

function sensorUmidadeFora(camara, sensor) {
  return sensor.umidade < camara.umidadeMinima || sensor.umidade > camara.umidadeMaxima;
}

function sensorEstaFora(camara, sensor) {
  return sensorTemperaturaFora(camara, sensor) || sensorUmidadeFora(camara, sensor);
}

// "Temperatura acima do ideal"
function motivoFora(camara) {
  let partes = [];

  if (camara.temperatura > camara.temperaturaMaxima) partes.push('Temperatura acima do ideal');
  if (camara.temperatura < camara.temperaturaMinima) partes.push('Temperatura abaixo do ideal');
  if (camara.umidade > camara.umidadeMaxima) partes.push('Umidade acima do ideal');
  if (camara.umidade < camara.umidadeMinima) partes.push('Umidade abaixo do ideal');

  return partes.join(' e ');
}

// 0 = fora da faixa, 1 = sem dados, 2 = dentro da faixa
function gravidade(camara) {
  if (!enviandoDados(camara)) {
    return 1;
  }
  return estaFora(camara) ? 0 : 2;
}

// ===== Cards =====  
function atualizarCards() {
    let total = camaras.length;
    let fora = 0;
    let enviando = 0;
    let minutosForaHoje = 0;

    for (let i = 0; i < total; i++) {
        let camara = camaras[i];

        minutosForaHoje += camara.minutosForaHoje;

        if (enviandoDados(camara)) {
            enviando++;

            if (estaFora(camara)) {
                fora++;
            }
        }
    }

    // Fora da faixa agora
    span_valor_dentro.innerHTML = `${fora}<span class="card-unit"> de ${total} câmaras</span>`;

    if (fora == 0) {
        div_selo_dentro.innerHTML = '<span class="dashboard-badge dashboard-ok">✓ Todas dentro da faixa</span>';
    } else {
        div_selo_dentro.innerHTML = '<span class="dashboard-badge dashboard-bad">✕ Requer atenção</span>';
        span_valor_dentro.classList.add('geral-valor-fora');
    }

    // Tempo fora da faixa hoje
    let variacao = Math.round(Math.abs(minutosForaHoje - minutosForaOntem) / minutosForaOntem * 100);

    span_valor_tempo.innerHTML = valorDuracao(minutosForaHoje);

    if (minutosForaHoje < minutosForaOntem) {
        div_selo_tempo.innerHTML = `<span class="dashboard-badge dashboard-ok">↓ ${variacao}% a menos que o dia anterior</span>`;
    } else {
        div_selo_tempo.innerHTML = `<span class="dashboard-badge dashboard-bad">↑ ${variacao}% a mais que o dia anterior</span>`;
    }

    // Sensores enviando dados
    span_valor_sensores.innerHTML = `${enviando}<span class="card-unit"> de ${total}</span>`;

    if (enviando == total) {
        div_selo_sensores.innerHTML = '<span class="dashboard-badge dashboard-ok">✓ Sensores ativos</span>';
    } else {
        div_selo_sensores.innerHTML = '<span class="dashboard-badge dashboard-bad">✕ Sensores sem dados</span>';
        span_valor_sensores.classList.add('geral-valor-fora');
    }
}

// ===== Tabela =====

function montarSituacao(camara) {
  if (!enviandoDados(camara)) {
    return `<span class="dashboard-badge geral-sem-dados">○ Sem dados</span><span class="geral-sub">desde ${camara.horaLeitura}</span>`;
  }
  if (estaFora(camara)) {
    return `<span class="dashboard-badge dashboard-bad">✕ Fora da faixa há ${textoDuracao(camara.minutosForaAgora)}</span><span class="geral-sub">${motivoFora(camara)}</span>`;
  }
  return '<span class="dashboard-badge dashboard-ok">✓ Dentro da faixa</span>';
}

function montarSensor(camara, sensor) {
  let ativo = sensorEnviandoDados(sensor);
  let classeTemperatura = ativo && sensorTemperaturaFora(camara, sensor) ? 'geral-valor-fora' : '';
  let classeUmidade = ativo && sensorUmidadeFora(camara, sensor) ? 'geral-valor-fora' : '';

  return `
    <a class="geral-sensor" href="./dashboard.html?camara=${camara.id}&sensor=${sensor.id}" aria-label="Ver dashboard do ${sensor.nome} da ${camara.nome}">
      <span class="geral-sensor-nome">${sensor.nome}</span>
      <span class="geral-sensor-kpis">
        <span class="geral-sensor-kpi">
          <span class="geral-sensor-kpi-label">Temperatura</span>
          <span class="geral-sensor-kpi-valor ${classeTemperatura}">${formatarNumero(sensor.temperatura)} °C</span>
        </span>
        <span class="geral-sensor-kpi">
          <span class="geral-sensor-kpi-label">Umidade</span>
          <span class="geral-sensor-kpi-valor ${classeUmidade}">${formatarNumero(sensor.umidade)}%</span>
        </span>
      </span>
    </a>`;
}

function montarSensores(camara) {
  let itens = '';

  for (let i = 0; i < camara.sensores.length; i++) {
    itens += montarSensor(camara, camara.sensores[i]);
  }

  return `
    <tr class="geral-sensores-linha" id="sensores_camara_${camara.id}" hidden>
      <td colspan="7">
        <div class="geral-sensores">
          <span class="geral-sensores-titulo">Sensores da ${camara.nome}</span>
          <div class="geral-sensores-lista">${itens}</div>
        </div>
      </td>
    </tr>`;
}

function montarLinha(camara) {
  // Sensor parado: o valor antigo não fica em vermelho, porque não diz como a câmara está agora
  let ativo = enviandoDados(camara);
  let classeTemperatura = ativo && temperaturaFora(camara) ? 'geral-valor-fora' : '';
  let classeUmidade = ativo && umidadeFora(camara) ? 'geral-valor-fora' : '';

  let tempoHoje = '<span class="geral-tempo geral-tempo-zero">Nenhum</span>';
  if (camara.minutosForaHoje > 0) {
    tempoHoje = `<span class="geral-tempo">${textoDuracao(camara.minutosForaHoje)}</span>`;
  }

  return `
    <tr class="geral-linha-camara" data-camara="${camara.id}" aria-expanded="false">
      <td>
        <span class="geral-camara-nome">
          <strong>${camara.nome}</strong>
          <span class="geral-seta" aria-hidden="true">▾</span>
        </span>
      </td>
      <td>
        <span class="geral-valor ${classeTemperatura}">${formatarNumero(camara.temperatura)} °C</span>
        <span class="geral-sub geral-ideal">ideal ${camara.temperaturaMinima} a ${camara.temperaturaMaxima} °C</span>
      </td>
      <td>
        <span class="geral-valor ${classeUmidade}">${formatarNumero(camara.umidade)}%</span>
        <span class="geral-sub geral-ideal">ideal ${camara.umidadeMinima} a ${camara.umidadeMaxima}%</span>
      </td>
      <td>${montarSituacao(camara)}</td>
      <td>${tempoHoje}</td>
      <td>${camara.horaLeitura}</td>
      <td class="geral-acao">
        <button type="button" class="btn-branco geral-btn-dashboard geral-btn-sensores" aria-expanded="false" aria-controls="sensores_camara_${camara.id}" aria-label="Ver sensores da ${camara.nome}">Sensores</button>
      </td>
    </tr>
    ${montarSensores(camara)}`;
}

function alternarSensores(id) {
  let linha = tbody_camaras.querySelector(`.geral-linha-camara[data-camara="${id}"]`);
  let painel = document.getElementById('sensores_camara_' + id);
  if (!linha || !painel) {
    return;
  }

  let aberto = !painel.hidden;
  painel.hidden = aberto;
  linha.classList.toggle('geral-linha-aberta', !aberto);
  linha.setAttribute('aria-expanded', String(!aberto));
  linha.querySelector('.geral-btn-sensores').setAttribute('aria-expanded', String(!aberto));
}

// Clique na linha (ou no botão) abre e fecha a lista de sensores
tbody_camaras.addEventListener('click', function (evento) {
  if (evento.target.closest('a')) {
    return;
  }

  let linha = evento.target.closest('.geral-linha-camara');
  if (linha) {
    alternarSensores(linha.dataset.camara);
  }
});

// Primeiro as câmaras fora da faixa, depois as sem dados; em cada grupo, quem ficou mais tempo fora hoje
function atualizarTabela() {
  let ordenadas = camaras.slice().sort(function (a, b) {
    return gravidade(a) - gravidade(b) || b.minutosForaHoje - a.minutosForaHoje;
  });
  let linhas = '';

  for (let i = 0; i < ordenadas.length; i++) {
    linhas += montarLinha(ordenadas[i]);
  }

  tbody_camaras.innerHTML = linhas;
}

// Primeira carga da tela
atualizarCards();
atualizarTabela();
