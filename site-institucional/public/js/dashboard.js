// Dias que têm leitura - uma leitura por hora, 24 por dia (o último dia vai até as 20:00)
let dias = ['2026-10-11', '2026-10-12', '2026-10-13'];

// Leituras por hora (dia + hora) - uma linha para cada dia
let datasHoras = [
  '11/10 00:00', '11/10 01:00', '11/10 02:00', '11/10 03:00', '11/10 04:00', '11/10 05:00', '11/10 06:00', '11/10 07:00', '11/10 08:00', '11/10 09:00', '11/10 10:00', '11/10 11:00', '11/10 12:00', '11/10 13:00', '11/10 14:00', '11/10 15:00', '11/10 16:00', '11/10 17:00', '11/10 18:00', '11/10 19:00', '11/10 20:00', '11/10 21:00', '11/10 22:00', '11/10 23:00',
  '12/10 00:00', '12/10 01:00', '12/10 02:00', '12/10 03:00', '12/10 04:00', '12/10 05:00', '12/10 06:00', '12/10 07:00', '12/10 08:00', '12/10 09:00', '12/10 10:00', '12/10 11:00', '12/10 12:00', '12/10 13:00', '12/10 14:00', '12/10 15:00', '12/10 16:00', '12/10 17:00', '12/10 18:00', '12/10 19:00', '12/10 20:00', '12/10 21:00', '12/10 22:00', '12/10 23:00',
  '13/10 00:00', '13/10 01:00', '13/10 02:00', '13/10 03:00', '13/10 04:00', '13/10 05:00', '13/10 06:00', '13/10 07:00', '13/10 08:00', '13/10 09:00', '13/10 10:00', '13/10 11:00', '13/10 12:00', '13/10 13:00', '13/10 14:00', '13/10 15:00', '13/10 16:00', '13/10 17:00', '13/10 18:00', '13/10 19:00', '13/10 20:00'
];
// Só a hora das últimas 24 leituras - usada nos períodos de 24, 12 e 6 h
let horarios = ['21:00', '22:00', '23:00', '00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];
let temperaturas = [
  9.8, 9.7, 9.5, 9.4, 9.2, 9.1, 9.0, 9.1, 9.3, 9.6, 9.9, 10.2, 10.5, 10.8, 11.0, 11.2, 11.1, 10.9, 10.7, 10.5, 10.3, 10.2, 10.0, 9.9,
  9.8, 9.6, 9.5, 9.3, 9.2, 9.1, 9.3, 9.5, 9.8, 10.1, 10.4, 10.8, 11.2, 11.7, 12.3, 12.1, 11.6, 11.2, 10.9, 10.7, 10.6, 10.7, 11.0, 11.3,
  11.6, 11.4, 11.1, 10.9, 10.6, 10.3, 10.1, 9.8, 9.6, 9.4, 9.3, 9.1, 9.0, 9.2, 9.4, 9.8, 10.1, 11.0, 2.0, 9.6, 8.9
];
let umidades = [
  94.2, 94.4, 94.6, 94.8, 95.0, 95.1, 95.2, 95.1, 94.9, 94.6, 94.3, 94.0, 93.7, 93.4, 93.1, 92.9, 93.0, 93.2, 93.5, 93.7, 93.9, 94.0, 94.2, 94.3,
  94.4, 94.6, 94.8, 95.0, 95.1, 95.2, 95.0, 94.8, 94.5, 94.2, 93.8, 93.3, 92.6, 91.4, 89.6, 90.3, 91.5, 92.2, 92.7, 93.0, 93.1, 93.2, 93.6, 94.0,
  94.4, 94.7, 95.0, 95.1, 95.1, 95.0, 95.0, 94.9, 94.9, 95.0, 95.0, 94.7, 94.4, 94.3, 94.3, 94.1, 86.2, 87.1, 88.2, 90.8, 92.7
];

// Faixa ideal da fase
let temperaturaMaxima = 12;
let temperaturaMinima = 8;
let umidadeMaxima = 98;
let umidadeMinima = 90;

// Os gráficos começam nas últimas 12 h
// Temperatura - 8 a 12
let chartTemperatura = new Chart(graficoTemperatura, {
  type: 'line',
  data: {
    labels: horarios.slice(-12),
    datasets: [
      { data: Array(12).fill(temperaturaMinima), borderWidth: 0, pointRadius: 0 },
      { data: Array(12).fill(temperaturaMaxima), borderWidth: 0, pointRadius: 0, fill: '-1', backgroundColor: 'rgba(46, 139, 92, 0.1)' },
      { data: temperaturas.slice(-12), borderColor: '#173f73', tension: 0.3 }
    ]
  },
  options: {
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { min: 0, max: 16 } }
  }
});

// Umidade - 90 a 98
let chartUmidade = new Chart(graficoUmidade, {
  type: 'line',
  data: {
    labels: horarios.slice(-12),
    datasets: [
      { data: Array(12).fill(umidadeMinima), borderWidth: 0, pointRadius: 0 },
      { data: Array(12).fill(umidadeMaxima), borderWidth: 0, pointRadius: 0, fill: '-1', backgroundColor: 'rgba(46, 139, 92, 0.1)' },
      { data: umidades.slice(-12), borderColor: '#209598', tension: 0.3 }
    ]
  },
  options: {
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { min: 80, max: 100 } }
  }
});

// Conformidade por câmara % tempo dentro da faixa
new Chart(graficoConformidade, {
  type: 'bar',
  data: {
    labels: ['Câmara 1', 'Câmara 2', 'Câmara 3'],
    datasets: [
      { label: 'Temperatura', data: [95, 94, 94], backgroundColor: '#173f73' },
      { label: 'Umidade', data: [94, 94, 94], backgroundColor: '#29999b' }
    ]
  },
  options: {
    indexAxis: 'y',
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { x: { min: 0, max: 100 } }
  }
});

// Troca os dados dos gráficos de temperatura e umidade
function atualizarGraficos(rotulos, temperaturasPeriodo, umidadesPeriodo) {
  chartTemperatura.data.labels = rotulos;
  chartTemperatura.data.datasets[0].data = Array(rotulos.length).fill(temperaturaMinima);
  chartTemperatura.data.datasets[1].data = Array(rotulos.length).fill(temperaturaMaxima);
  chartTemperatura.data.datasets[2].data = temperaturasPeriodo;
  chartTemperatura.update();

  chartUmidade.data.labels = rotulos;
  chartUmidade.data.datasets[0].data = Array(rotulos.length).fill(umidadeMinima);
  chartUmidade.data.datasets[1].data = Array(rotulos.length).fill(umidadeMaxima);
  chartUmidade.data.datasets[2].data = umidadesPeriodo;
  chartUmidade.update();
}

// Últimas 24, 12 ou 6 h - pega as leituras mais recentes
function trocarPeriodo() {
  if (select_periodo.value == 'Personalizado') {
    div_periodo.style.display = 'flex';
    filtrar();
  } else {
    div_periodo.style.display = 'none';
    let horas = Number(select_periodo.value);
    atualizarGraficos(horarios.slice(-horas), temperaturas.slice(-horas), umidades.slice(-horas));
  }
}

// Período personalizado - pega as leituras entre os dois dias (24 por dia)
function filtrar() {
  let inicio = dias.indexOf(input_inicio.value) * 24;
  let fim = (dias.indexOf(input_fim.value) + 1) * 24;

  atualizarGraficos(datasHoras.slice(inicio, fim), temperaturas.slice(inicio, fim), umidades.slice(inicio, fim));
}
