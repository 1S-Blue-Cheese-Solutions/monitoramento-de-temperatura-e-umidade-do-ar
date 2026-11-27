function fecharPopups() {
  popup_novo_login.style.display = 'none';
  popup_editar_login.style.display = 'none';
}

function abrirNovoLogin() {
  input_login_novo.value = '';
  input_senha_novo.value = '';
  input_confirmar_novo.value = '';
  select_sala_novo.value = sessionStorage.FK_EMPRESA || '';
  div_msg_novo.innerHTML = '';
  popup_novo_login.style.display = 'flex';
}

function abrirEditarLogin(login) {
  input_login_editar.value = login;
  popup_editar_login.style.display = 'flex';
}

function carregarEmpresas() {
  let idCliente = sessionStorage.FK_CLIENTE;

  fetch(`/usuarioInterno/empresas/${idCliente}?idEmpresa=${sessionStorage.FK_EMPRESA}`)
    .then(function (resposta) {
      if (resposta.status == 204) {
        return;
      }

      if (resposta.ok) {
        resposta.json().then(function (empresas) {
          let opcoes = '<option value="" disabled>Selecione uma empresa</option>';

          for (let i = 0; i < empresas.length; i++) {
            opcoes += `<option value="${empresas[i].idEmpresa}">${empresas[i].nomeFantasia}</option>`;
          }

          select_sala_novo.innerHTML = opcoes;
          select_sala_editar.innerHTML = opcoes;

          // deixa a empresa atual de quem está logado já selecionada
          select_sala_novo.value = sessionStorage.FK_EMPRESA || '';
        });
      } else {
        console.log("Erro ao listar empresas");
      }
    })
    .catch(function (erro) {
      console.log(erro);
    });
}

function criarLogin() {
  let login = input_login_novo.value;
  let senha = input_senha_novo.value;
  let confirmar = input_confirmar_novo.value;
  let fkEmpresa = select_sala_novo.value;

  if (login == '') {
    div_msg_novo.innerHTML = 'Informe um login';
  } else if (!(login.includes('@') && login.endsWith('.com'))) {
    div_msg_novo.innerHTML = 'O login deve ser um e-mail (com \'@\' e terminando em \'.com\')';
  } else if (senha.length < 8) {
    div_msg_novo.innerHTML = 'A senha precisa ter pelo menos 8 caracteres';
  } else if (senha != confirmar) {
    div_msg_novo.innerHTML = 'As senhas não coincidem';
  } else if (fkEmpresa == '') {
    div_msg_novo.innerHTML = 'Selecione uma empresa';
  } else {
    div_msg_novo.innerHTML = '';

    fetch('/usuarioInterno/cadastrar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        loginServer: login,
        senhaServer: senha,
        fkClienteServer: sessionStorage.FK_CLIENTE,
        fkEmpresaServer: fkEmpresa
      })
    }).then(function (resposta) {
      if (resposta.ok) {
        fecharPopups();
        listarUsuarios();
      } else {
        resposta.text().then(function (texto) {
          div_msg_novo.innerHTML = texto || 'Erro ao criar login';
        });
      }
    }).catch(function (erro) {
      console.log(erro);
      div_msg_novo.innerHTML = 'Erro ao criar login';
    });
  }
}

function salvarLogin() {
  let login = input_login_editar.value;
  let senha = input_senha_editar.value;
  let confirmar = input_confirmar_editar.value;

  if (login == '') {
    div_msg_editar.innerHTML = 'Informe um login';
  } else if (senha != '' && senha.length < 8) {
    div_msg_editar.innerHTML = 'A senha precisa ter pelo menos 8 caracteres';
  } else if (senha != confirmar) {
    div_msg_editar.innerHTML = 'As senhas não coincidem';
  } else {
    div_msg_editar.innerHTML = '';
    fecharPopups();
  }
}

function pegarIniciais(nome) {
  let partes = nome.split(" ");
  if (partes.length >= 2) {
    return partes[0][0] + partes[1][0];
  } else {
    return partes[0][0] + partes[0][1];
  }
}

function listarUsuarios() {
  let idEmpresa = sessionStorage.FK_EMPRESA;
  let idUsuarioLogado = sessionStorage.ID_USUARIO;

  fetch(`/usuarioInterno/listar/${idEmpresa}`)
    .then(function (resposta) {
      if (resposta.status == 204) {
        lista_usuarios.innerHTML = '<p>Nenhum usuário cadastrado.</p>';
        return;
      }

      if (resposta.ok) {
        resposta.json().then(function (usuarios) {
          console.log(usuarios);
          lista_usuarios.innerHTML = '';

          for (let i = 0; i < usuarios.length; i++) {
            let usuario = usuarios[i];

            let tagVoce = '';
            if (usuario.idUsuario == idUsuarioLogado) {
              tagVoce = '<span class="acesso-voce">Você</span>';
            }

            let tagAdm = '';
            if (usuario.cargo == 'Dono') {
              tagAdm = '<span class="acesso-adm">♙ Administrador</span>';
            }

            lista_usuarios.innerHTML += `
              <div class="acesso">
                <span class="acesso-avatar">${pegarIniciais(usuario.nome)}</span>
                <b>${usuario.nome}</b>
                ${tagVoce}
                ${tagAdm}
                <span class="acesso-empresa">${usuario.nomeFantasia}</span>
                <button class="btn-link" onclick="abrirEditarLogin('${usuario.login}')">Editar</button>
              </div>
            `;
          }
        });
      } else {
        console.log("Erro ao listar usuários");
      }
    })
    .catch(function (erro) {
      console.log(erro);
    });
}
