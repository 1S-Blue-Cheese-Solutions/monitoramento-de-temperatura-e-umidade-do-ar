function queijoPerdido() {
  let quilos = Number(input_quilos.value);
  let precoPorKg = Number(select_queijo.value);
  let nomeQueijo = select_queijo.options[select_queijo.selectedIndex].text;

  let prejuizoTotal = quilos * precoPorKg;

  if (quilos <= 0) {
    div_resultado.innerHTML = `Por favor, insira uma quantidade válida.`
    div_resultado.style.display = 'block';  
  } else {
    div_resultado.innerHTML = `
              <div>
                  Tipo de queijo: ${nomeQueijo}<br>
                  Quantidade perdida: ${quilos.toFixed(2)}kg<br>
                  Prejuízo total: R$ ${prejuizoTotal.toFixed(2)}
              </div>
          `;
  
          div_resultado.style.display = 'block';
  }
}


function calcularRetorno() {
  let pacote = select_pacote2.value;
  let lucroSemanal = Number(input_lucro.value);
  let precoSensor = 30;
  let investimentoTotal;

  if (lucroSemanal <= 0)  {
      div_exbRoi.innerHTML = `Por favor, insira uma quantidade válida.`
      div_exbRoi.style.display = 'flex';;
  } else{

  if (pacote == "1") {
    investimentoTotal = precoSensor * 10;
  } else if (pacote == "2") {
    investimentoTotal = precoSensor * 20;
  } else if (pacote == "3") {
    investimentoTotal = precoSensor * 30;
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

        div_exbRoi.style.display = 'flex';  }
}