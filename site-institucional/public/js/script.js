function queijoPerdido() {
  let quilos = Number(input_quilos.value);
  let precoPorKg = Number(select_queijo.value);
  let nomeQueijo = select_queijo.options[select_queijo.selectedIndex].text;

  let prejuizoTotal = quilos * precoPorKg;

  div_resultado.innerHTML = `
            <div>
                Tipo de queijo: ${nomeQueijo}<br>
                Quantidade perdida: ${quilos.toFixed(2)}kg<br>
                Prejuízo total: R$ ${prejuizoTotal.toFixed(2)}
            </div>
        `;
}

function escolher() {
  let pacote = select_pacote.value;
  let unidSensor = 11;

  if (pacote == "1") {
    let pacote10 = unidSensor * 10;
    let pacote10Format = pacote10.toFixed(2);

    div_exbCalc.innerHTML = `Você optou pelo sistema com 10 sensores, seu gasto com sensores será de R$${pacote10Format}`;
  }
  if (pacote == "2") {
    let pacote20 = unidSensor * 20;
    let pacote20Format = pacote20.toFixed(2);

    div_exbCalc.innerHTML = `Você optou pelo sistema com 20 sensores, seu gasto com sensores será de R$${pacote20Format}`;
  }
  if (pacote == "3") {
    let pacote30 = unidSensor * 30;
    let pacote30Format = pacote30.toFixed(2);

    div_exbCalc.innerHTML = `Você optou pelo sistema com 30 sensores, seu gasto com sensores será de R$${pacote30Format}`;
  }
}

function calcularRetorno() {
  let pacote = select_pacote2.value;
  let lucroSemanal = Number(input_lucro.value);
  let unidSensor = 30;
  let investimentoTotal;

  if (pacote == "1") {
    investimentoTotal = unidSensor * 10;
  } else if (pacote == "2") {
    investimentoTotal = unidSensor * 20;
  } else if (pacote == "3") {
    investimentoTotal = unidSensor * 30;
  } else {
    div_exbRoi.innerHTML = "Por favor, selecione um pacote de sensores.";
    return;
  }


  let retornoMensal = lucroSemanal * 4 - investimentoTotal;
  let contadorSemana = 0;
  let contadorLucro = 0;

  while (contadorLucro < investimentoTotal) {
    contadorLucro += lucroSemanal;
    contadorSemana++;

    if (contadorSemana == 1) {
      div_exbRoi.innerHTML = `O retorno do investimento será alcançado em apenas uma semana.`;
    } else {
      div_exbRoi.innerHTML = `O retorno do investimento será alcançado em ${contadorSemana} semanas.`;
    }
  
  }

  div_exbRoi.innerHTML += `
        <div>
            Investimento total: R$ ${investimentoTotal.toFixed(2)}<br>
            Retorno mensal: R$ ${retornoMensal.toFixed(2)}
        </div>
    `;

        
}