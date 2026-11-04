// Dados mockados: câmara 1 segue os dados da dashboard (dia 13/10), câmaras 2 e 3 têm valores fictícios
const camaras = [
  { nomeFantasia: 'Queijaria Serra Azul', logradouro: 'Estrada do Queijo', numero: '1500', cidade: 'Cunha', estado: 'SP',
    idAmbienteProcesso: 1, nomePrincipal: 'Câmara de Maturação 1', descricao: 'Maturação de Roquefort',
    temperaturaMin: 8, temperaturaMax: 12, umidadeMin: 90, umidadeMax: 98,
    sensorTemperatura: 8.9, sensorUmidade: 92.7, horaLeitura: '20:56', segundosDesdeLeitura: 3, minutosDesdeUltimaDentro: 0 },

  { nomeFantasia: 'Queijaria Serra Azul', logradouro: 'Estrada do Queijo', numero: '1500', cidade: 'Cunha', estado: 'SP',
    idAmbienteProcesso: 2, nomePrincipal: 'Câmara de Maturação 2', descricao: 'Maturação de Gorgonzola',
    temperaturaMin: 8, temperaturaMax: 12, umidadeMin: 85, umidadeMax: 95,
    sensorTemperatura: 12.9, sensorUmidade: 88.4, horaLeitura: '20:56', segundosDesdeLeitura: 2, minutosDesdeUltimaDentro: 52 },

  { nomeFantasia: 'Queijaria Serra Azul', logradouro: 'Estrada do Queijo', numero: '1500', cidade: 'Cunha', estado: 'SP',
    idAmbienteProcesso: 3, nomePrincipal: 'Câmara de Maturação 3', descricao: 'Maturação de Stilton',
    temperaturaMin: 8, temperaturaMax: 12, umidadeMin: 85, umidadeMax: 95,
    sensorTemperatura: 9.7, sensorUmidade: 88.6, horaLeitura: '20:56', segundosDesdeLeitura: 4, minutosDesdeUltimaDentro: 0 }
];

// Minutos fora da faixa desde 00:00, por câmara
const resumoDia = [
  { fkAmbienteProcesso: 1, minutosFora: 234 },
  { fkAmbienteProcesso: 2, minutosFora: 127 },
  { fkAmbienteProcesso: 3, minutosFora: 0 }
];

// Total de minutos fora da faixa no dia anterior, somando as câmaras
const MINUTOS_FORA_ONTEM = 289;

const HORA_ATUAL = '20:56';
const LIMITE_SEM_DADOS = 120; // segundos sem leitura para considerar o sensor parado

// ===== Funções de apoio =====

function fmt(v) {
  return v.toFixed(1).replace('.', ',');
}

function fmtDuracao(min) {
  if (min == 0) return '0 min';
  let h = Math.floor(min / 60);
  let r = min % 60;
  if (h == 0) return r + ' min';
  return r == 0 ? h + ' h' : `${h} h ${String(r).padStart(2, '0')} min`;
}

function tempFora(c) {
  return c.sensorTemperatura < c.temperaturaMin || c.sensorTemperatura > c.temperaturaMax;
}

function umidFora(c) {
  return c.sensorUmidade < c.umidadeMin || c.sensorUmidade > c.umidadeMax;
}

function estaFora(c) {
  return tempFora(c) || umidFora(c);
}

function enviandoDados(c) {
  return c.segundosDesdeLeitura < LIMITE_SEM_DADOS;
}

function minutosForaHoje(c) {
  return resumoDia.find(r => r.fkAmbienteProcesso == c.idAmbienteProcesso).minutosFora;
}

function nomeCurto(c) {
  return c.nomePrincipal.replace('Câmara de Maturação', 'Câmara');
}

// "Temperatura acima do ideal"
function motivo(c) {
  let partes = [];
  if (c.sensorTemperatura > c.temperaturaMax) partes.push('Temperatura acima do ideal');
  if (c.sensorTemperatura < c.temperaturaMin) partes.push('Temperatura abaixo do ideal');
  if (c.sensorUmidade > c.umidadeMax) partes.push('Umidade acima do ideal');
  if (c.sensorUmidade < c.umidadeMin) partes.push('Umidade abaixo do ideal');
  return partes.join(' e ');
}

function situacao(c) {
  if (!enviandoDados(c)) {
    return `<span class="geral-selo geral-sem">○ Sem dados</span><span class="geral-sub">desde ${c.horaLeitura}</span>`;
  }
  if (estaFora(c)) {
    return `<span class="geral-selo geral-fora">✕ Fora da faixa há ${fmtDuracao(c.minutosDesdeUltimaDentro)}</span><span class="geral-sub">${motivo(c)}</span>`;
  }
  return '<span class="geral-selo geral-ok">✓ Dentro da faixa</span>';
}

// 0 = fora da faixa, 1 = sem dados, 2 = dentro da faixa
function gravidade(c) {
  if (!enviandoDados(c)) return 1;
  return estaFora(c) ? 0 : 2;
}

// Primeiro as câmaras fora da faixa, depois as sem dados; em cada grupo, quem ficou mais tempo fora hoje
function ordenarPorGravidade(lista) {
  return [...lista].sort((a, b) =>
    gravidade(a) - gravidade(b)
    || minutosForaHoje(b) - minutosForaHoje(a));
}

// ===== Montagem da tela =====

function renderCabecalho() {
  let c = camaras[0];
  span_local.textContent = `${c.nomeFantasia} · ${c.logradouro}, ${c.numero} · ${c.cidade} - ${c.estado}`;
}

// As 3 KPIs: quantas câmaras estão bem agora, quanto tempo de exposição hoje, e se dá para confiar nos dados
function renderKpis() {
  let total = camaras.length;
  let dentro = camaras.filter(c => enviandoDados(c) && !estaFora(c));
  let fora = camaras.filter(c => enviandoDados(c) && estaFora(c));
  let enviando = camaras.filter(enviandoDados);
  let totalFora = camaras.reduce((soma, c) => soma + minutosForaHoje(c), 0);

  let infoDentro = 'Demais câmaras sem dados';
  if (dentro.length == total) {
    infoDentro = 'Todas dentro da faixa ideal';
  } else if (fora.length > 0) {
    infoDentro = fora.map(c => `${nomeCurto(c)} está fora da faixa há ${fmtDuracao(c.minutosDesdeUltimaDentro)}`).join(', ');
  }

  // Menos tempo fora da faixa que ontem é bom (verde); mais tempo é ruim (vermelho)
  let variacao = Math.round(Math.abs(totalFora - MINUTOS_FORA_ONTEM) / MINUTOS_FORA_ONTEM * 100);
  let seloVariacao = totalFora < MINUTOS_FORA_ONTEM
    ? `<span class="dashboard-badge dashboard-ok">↓ ${variacao}% a menos que o dia anterior</span>`
    : `<span class="dashboard-badge dashboard-bad">↑ ${variacao}% a mais que o dia anterior</span>`;

  div_kpis.innerHTML = `
    <div class="dashboard-card geral-kpi ${dentro.length < total ? 'geral-kpi-alerta' : ''}">
      <span class="geral-kpi-rotulo">Dentro da faixa agora</span>
      <span class="geral-kpi-valor">${dentro.length}<small> de ${total} câmaras</small></span>
      <span class="geral-kpi-info">${infoDentro}</span>
    </div>
    <div class="dashboard-card geral-kpi">
      <span class="geral-kpi-rotulo">Tempo fora da faixa hoje</span>
      <span class="geral-kpi-valor">${fmtDuracao(totalFora)}</span>
      ${seloVariacao}
    </div>
    <div class="dashboard-card geral-kpi ${enviando.length < total ? 'geral-kpi-alerta' : ''}">
      <span class="geral-kpi-rotulo">Sensores enviando dados</span>
      <span class="geral-kpi-valor">${enviando.length}<small> de ${total}</small></span>
      <span class="geral-kpi-info">${enviando.length == total ? `Última leitura às ${HORA_ATUAL}` : 'Verifique os sensores sem dados'}</span>
    </div>`;
}

function linha(c) {
  let minutos = minutosForaHoje(c);
  // Sensor parado: o valor antigo não fica em vermelho, porque não diz como a câmara está agora
  let ativo = enviandoDados(c);

  return `
    <tr>
      <td>
        <strong>${c.nomePrincipal}</strong>
        <span class="geral-sub">${c.descricao}</span>
      </td>
      <td>
        <span class="geral-valor ${ativo && tempFora(c) ? 'geral-valor-fora' : ''}">${fmt(c.sensorTemperatura)} °C</span>
        <span class="geral-sub geral-ideal">ideal ${c.temperaturaMin} a ${c.temperaturaMax} °C</span>
      </td>
      <td>
        <span class="geral-valor ${ativo && umidFora(c) ? 'geral-valor-fora' : ''}">${fmt(c.sensorUmidade)}%</span>
        <span class="geral-sub geral-ideal">ideal ${c.umidadeMin} a ${c.umidadeMax}%</span>
      </td>
      <td>${situacao(c)}</td>
      <td><span class="geral-tempo ${minutos == 0 ? 'zero' : ''}">${minutos == 0 ? 'Nenhum' : fmtDuracao(minutos)}</span></td>
      <td>${c.horaLeitura}</td>
      <td class="geral-acao">
        <a class="btn-branco geral-btn-dashboard" href="./dashboard.html?camara=${c.idAmbienteProcesso}" aria-label="Ver dashboard da ${c.nomePrincipal}">Ver dashboard</a>
      </td>
    </tr>`;
}

renderCabecalho();
renderKpis();
tbody_camaras.innerHTML = ordenarPorGravidade(camaras).map(linha).join('');
