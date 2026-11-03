function fecharPopups() {
  popup_nova_empresa.style.display = 'none';
  popup_editar_empresa.style.display = 'none';
  popup_novo_endereco.style.display = 'none';
  popup_ambientes.style.display = 'none';
}

function abrirEditarEmpresa(nome, cnpj) {
  input_nome_editar.value = nome;
  input_cnpj_editar.value = cnpj;
  popup_editar_empresa.style.display = 'flex';
}

function abrirNovoEndereco(empresa) {
  div_empresa_endereco.innerHTML = empresa;
  popup_novo_endereco.style.display = 'flex';
}

function salvarNovaEmpresa() {
  let nome = input_nome_nova.value;
  let cnpj = input_cnpj_nova.value;

  if (nome == '') {
    div_msg_nova.innerHTML = 'Preencha o nome fantasia';
  } else if (cnpj.length != 14) {
    div_msg_nova.innerHTML = 'O CNPJ deve ter 14 números';
  } else {
    div_msg_nova.innerHTML = '';
    fecharPopups();
  }
}

function salvarEditarEmpresa() {
  let nome = input_nome_editar.value;
  let cnpj = input_cnpj_editar.value;

  if (nome == '') {
    div_msg_editar.innerHTML = 'Preencha o nome fantasia';
  } else if (cnpj.length != 14) {
    div_msg_editar.innerHTML = 'O CNPJ deve ter 14 números';
  } else {
    div_msg_editar.innerHTML = '';
    fecharPopups();
  }
}

function proximo() {
  let cep = input_cep.value;
  let logradouro = input_logradouro.value;
  let numero = input_numero.value;
  let bairro = input_bairro.value;
  let cidade = input_cidade.value;
  let estado = input_estado.value;

  if (cep.length != 8) {
    div_msg_endereco.innerHTML = 'O CEP deve ter 8 números';
  } else if (logradouro == '' || numero == '' || bairro == '' || cidade == '') {
    div_msg_endereco.innerHTML = 'Preencha todos os campos';
  } else if (estado.length != 2) {
    div_msg_endereco.innerHTML = 'O estado deve ter pelo menos 2 letras';
  } else {
    div_msg_endereco.innerHTML = '';
    fecharPopups();
    abrirAmbientes(`${logradouro}, ${numero} · ${cidade} - ${estado}`, []);
  }
}

// Vetor com os ambientes que aparecem na lista do pop-up
let listaAmbientes = [];

function adicionarAmbiente() {
  let nome = input_nome_principal.value;
  let tempMin = Number(input_temp_min.value);
  let tempMax = Number(input_temp_max.value);
  let umidMin = Number(input_umid_min.value);
  let umidMax = Number(input_umid_max.value);

  if (nome == '') {
    div_msg_ambientes.innerHTML = 'Preencha o nome principal';
  } else if (tempMin >= tempMax) {
    div_msg_ambientes.innerHTML = 'A temperatura mínima deve ser menor que a máxima';
  } else if (umidMin >= umidMax) {
    div_msg_ambientes.innerHTML = 'A umidade mínima deve ser menor que a máxima';
  } else {
    div_msg_ambientes.innerHTML = '';
    listaAmbientes.push(nome);
    mostrarLista();
  }
}

function removerAmbiente(posicao) {
  listaAmbientes.splice(posicao, 1);
  mostrarLista();
}

function mostrarLista() {
  div_lista.innerHTML = '';
  let i = 0;

  while (i < listaAmbientes.length) {
    div_lista.innerHTML += `
      <div class="item-lista">
        <span><span class="bolinha">●</span> ${listaAmbientes[i]}</span>
        <button class="btn-vermelho" onclick="removerAmbiente(${i})">Remover</button>
      </div>
    `;
    i++;
  }
}
