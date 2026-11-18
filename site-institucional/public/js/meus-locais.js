// Linhas vindas do banco (uma por ambiente) e o local aberto no pop-up
let locais = [];
let localEditando;

const camposEndereco = ['cep', 'logradouro', 'numero', 'bairro', 'cidade', 'estado'];

function fecharPopups() {
  popup_nova_empresa.style.display = 'none';
  popup_editar_empresa.style.display = 'none';
  popup_novo_endereco.style.display = 'none';
  popup_ambientes.style.display = 'none';
}

// Envia o corpo em JSON e só resolve se o back-end responder ok
function enviar(rota, metodo, corpo) {
  return fetch(rota, {
    method: metodo,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(corpo),
  }).then(function (resposta) {
    if (!resposta.ok) {
      throw new Error("Erro ao salvar!");
    }
  });
}

function formatarCnpj(cnpj) {
  return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

function startMeusLocais() {
  fetch(`/locais/listar/${sessionStorage.FK_CLIENTE}`)
    .then(function (resposta) {
      if (!resposta.ok) {
        throw new Error("Erro ao buscar locais!");
      }
      return resposta.json();
    })
    .then(function (dados) {
      locais = dados;
      mostrarLocais();
    })
    .catch(function (erro) {
      console.log(`#ERRO: ${erro}`);
    });
}

function mostrarLocais() {
  // Map mantém a ordem do ORDER BY; cada endereço junta seus ambientes
  let cards = new Map();

  locais.forEach(function (linha) {
    if (!cards.has(linha.idEndereco)) {
      cards.set(linha.idEndereco, []);
    }
    if (linha.nomePrincipal) {
      cards.get(linha.idEndereco).push(`<p class="ambiente"><span class="bolinha">●</span> ${linha.nomePrincipal}</p>`);
    }
  });

  div_locais.innerHTML = [...cards].map(function ([id, ambientes]) {
    let l = buscarLocal(id);
    return `
      <div class="empresa-header">
        <div><h2>${l.nomeFantasia}</h2></div>
        <div><button class="btn-link" onclick="abrirEditarEmpresa(${id})">Editar empresa</button></div>
      </div>
      <div class="enderecos">
        <div class="endereco-card">
          <div class="endereco-header">
            <div>
              <h3>${l.logradouro}, ${l.numero}</h3>
              <p>CNPJ ${formatarCnpj(l.cnpj)}</p>
              <p>${l.cidade} - ${l.estado}</p>
            </div>
            <button class="btn-link" onclick="abrirEditarEndereco(${id})">Editar</button>
          </div>
          ${ambientes.join('') ||'<p class="vazio">Nenhum ambiente cadastrado.</p>'}
        </div>
      </div>
    `;
  }).join('');
}

function buscarLocal(idEndereco) {
  return locais.find(function (l) {
    return l.idEndereco == idEndereco;
  });
}

function abrirEditarEmpresa(idEndereco) {
  localEditando = buscarLocal(idEndereco);
  input_nome_editar.value = localEditando.nomeFantasia;
  input_cnpj_editar.value = localEditando.cnpj;
  popup_editar_empresa.style.display = 'flex';
}

function abrirEditarEndereco(idEndereco) {
  localEditando = buscarLocal(idEndereco);
  div_empresa_endereco.innerHTML = localEditando.nomeFantasia;
  camposEndereco.forEach(function (campo) {
    window[`input_${campo}`].value = localEditando[campo];
  });
  popup_novo_endereco.style.display = 'flex';
}

function abrirAmbientes(endereco) {
  div_endereco_ambientes.innerHTML = endereco;
  popup_ambientes.style.display = 'flex';
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
  } else if (!/^\d{14}$/.test(cnpj)) {
    div_msg_editar.innerHTML = 'O CNPJ deve ter 14 números';
  } else {
    enviar(`/locais/editarEmpresa/${localEditando.fkEmpresa}`, 'PUT', { nomeFantasia: nome, cnpj: cnpj })
      .then(function () {
        div_msg_editar.innerHTML = '';
        fecharPopups();
        startMeusLocais();
      })
      .catch(function () {
        div_msg_editar.innerHTML = 'Não foi possível salvar a empresa';
      });
  }
}

function proximo() {
  let endereco = {};
  camposEndereco.forEach(function (campo) {
    endereco[campo] = window[`input_${campo}`].value;
  });

  if (!/^\d{8}$/.test(endereco.cep)) {
    div_msg_endereco.innerHTML = 'O CEP deve ter 8 números';
  } else if (endereco.logradouro == '' || endereco.numero == '' || endereco.bairro == '' || endereco.cidade == '') {
    div_msg_endereco.innerHTML = 'Preencha todos os campos';
  } else if (endereco.estado.length != 2) {
    div_msg_endereco.innerHTML = 'O estado deve ter 2 letras';
  } else {
    enviar(`/locais/editarEndereco/${localEditando.idEndereco}`, 'PUT', endereco)
      .then(function () {
        div_msg_endereco.innerHTML = '';
        fecharPopups();
        startMeusLocais();
        abrirAmbientes(`${endereco.logradouro}, ${endereco.numero} · ${endereco.cidade} - ${endereco.estado}`);
      })
      .catch(function () {
        div_msg_endereco.innerHTML = 'Não foi possível salvar o endereço';
      });
  }
}

function salvarAmbiente() {
  let ambiente = {
    nomePrincipal: input_nome_principal.value,
    nomeAuxiliar: input_nome_auxiliar.value,
    descricao: input_descricao.value,
    temperaturaMin: Number(input_temp_min.value),
    temperaturaMax: Number(input_temp_max.value),
    umidadeMin: Number(input_umid_min.value),
    umidadeMax: Number(input_umid_max.value),
  };

  if (ambiente.nomePrincipal == '') {
    div_msg_ambientes.innerHTML = 'Preencha o nome principal';
  } else if (ambiente.temperaturaMin >= ambiente.temperaturaMax) {
    div_msg_ambientes.innerHTML = 'A temperatura mínima deve ser menor que a máxima';
  } else if (ambiente.umidadeMin >= ambiente.umidadeMax) {
    div_msg_ambientes.innerHTML = 'A umidade mínima deve ser menor que a máxima';
  } else {
    enviar(`/locais/cadastrarAmbiente/${localEditando.idEndereco}`, 'POST', ambiente)
      .then(function () {
        div_msg_ambientes.innerHTML = '';
        fecharPopups();
        startMeusLocais();
      })
      .catch(function () {
        div_msg_ambientes.innerHTML = 'Não foi possível salvar o ambiente';
      });
  }
}

startMeusLocais();
