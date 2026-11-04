// Dados mockados: a câmara 1 segue os dados da dashboard (dia 13/10), as câmaras 2 e 3 têm valores fictícios
let camaras = [
  {
    id: 1, nome: 'Câmara de Maturação 1 - Roquefort',
    temperaturaMinima: 8, temperaturaMaxima: 12, umidadeMinima: 90, umidadeMaxima: 98,
    temperatura: 8.9, umidade: 92.7, horaLeitura: '20:55', segundosDesdeLeitura: 3,
    minutosForaAgora: 0, minutosForaHoje: 234
  },
  {
    id: 2, nome: 'Câmara de Maturação 2 - Gorgonzola',
    temperaturaMinima: 8, temperaturaMaxima: 12, umidadeMinima: 85, umidadeMaxima: 95,
    temperatura: 12.9, umidade: 88.4, horaLeitura: '20:55', segundosDesdeLeitura: 2,
    minutosForaAgora: 52, minutosForaHoje: 127
  },
  {
    id: 3, nome: 'Câmara de Maturação 3 - Stilton',
    temperaturaMinima: 8, temperaturaMaxima: 12, umidadeMinima: 85, umidadeMaxima: 95,
    temperatura: 9.7, umidade: 88.6, horaLeitura: '20:55', segundosDesdeLeitura: 4,
    minutosForaAgora: 0, minutosForaHoje: 0
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
  let dentro = 0;
  let enviando = 0;
  let minutosForaHoje = 0;

  for (let i = 0; i < total; i++) {
    let camara = camaras[i];
    minutosForaHoje += camara.minutosForaHoje;

    if (enviandoDados(camara)) {
      enviando++;

      if (!estaFora(camara)) {
        dentro++;
      }
    }
  }

  // Dentro da faixa agora
  span_valor_dentro.innerHTML = `${dentro}<span class="card-unit">de ${total} câmaras</span>`;
  if (dentro == total) {
    div_selo_dentro.innerHTML = '<span class="dashboard-badge dashboard-ok">✓ Condições ideais</span>';
  } else {
    div_selo_dentro.innerHTML = '<span class="dashboard-badge dashboard-bad">✕ Requer atenção</span>';
    span_valor_dentro.classList.add('geral-valor-fora');
  }

  // Tempo fora da faixa hoje: menos tempo que ontem é bom (verde), mais tempo é ruim (vermelho)
  let variacao = Math.round(Math.abs(minutosForaHoje - minutosForaOntem) / minutosForaOntem * 100);

  span_valor_tempo.innerHTML = valorDuracao(minutosForaHoje);
  if (minutosForaHoje < minutosForaOntem) {
    div_selo_tempo.innerHTML = `<span class="dashboard-badge dashboard-ok">↓ ${variacao}% a menos que o dia anterior</span>`;
  } else {
    div_selo_tempo.innerHTML = `<span class="dashboard-badge dashboard-bad">↑ ${variacao}% a mais que o dia anterior</span>`;
  }

  // Sensores enviando dados
  span_valor_sensores.innerHTML = `${enviando}<span class="card-unit">de ${total}</span>`;
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
    <tr>
      <td>
        <strong>${camara.nome}</strong>
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
        <a class="btn-branco geral-btn-dashboard" href="./dashboard.html?camara=${camara.id}" aria-label="Ver dashboard da ${camara.nome}">Ver dashboard</a>
      </td>
    </tr>`;
}

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
