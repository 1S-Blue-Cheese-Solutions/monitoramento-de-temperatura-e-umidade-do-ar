
function registrar() {
    let empresa = iempresa.value;
    let cnpj = icnpj.value;
    let cliente = icliente.value;
    let cpf = icpf.value;
    let email = imail.value;
    let celular = icelular.value;
    let flagError = false;

    if (empresa.trim() == '') {
        div_result_empresa.innerHTML = `Informe o nome da empresa`;
        flagError = true;
    } else {
        div_result_empresa.innerHTML = ``;
    }

    if (cnpj.length != 14 || cnpj.includes("-") || cnpj.includes(".")) {
        div_result_cnpj.innerHTML = `CNPJ deve ter 14 números`;
        flagError = true;
    } else {
        div_result_cnpj.innerHTML = ``;
    }

    if (cliente.trim() == '') {
        div_result_cliente.innerHTML = `Informe o seu nome`;
        flagError = true;
    } else {
        div_result_cliente.innerHTML = ``;
    }

    if (cpf.length != 11 || cpf.includes("-") || cpf.includes(".")) {
        div_result_cpf.innerHTML = `CPF deve ter 11 números`;
        flagError = true;
    } else {
        div_result_cpf.innerHTML = ``;
    }

    if (email.includes('@') && email.includes('.com')) {
        div_result_mail.innerHTML = ``;
    } else {
        div_result_mail.innerHTML = `E-mail deve conter @ e .com`;
        flagError = true;
    }

    if (celular.length != 11) {
        div_result_celular.innerHTML = `Celular deve ter DDD + 9 números`;
        flagError = true;
    } else {
        div_result_celular.innerHTML = ``;
    }

    // VALIDAÇÃO DA SENHA
    let senha = isenha.value;
    let tamanhoSenha = senha.length;
    let temMaiuscula = senha !== senha.toUpperCase();
    let temMinuscula = senha !== senha.toLowerCase();
    let validacaoSenha = iconfirmacao.value;

    let contador = 0;
    let contSimbolos = 0;
    let simbolos = '!@#$%&*()_+-=[]{};:,.<>?/|~';

    while (contador < senha.length) {
        if (simbolos.includes(senha[contador])) {
            contSimbolos++;
        }
        contador++;
    }

    if (tamanhoSenha == 0) {
        div_result_senha.innerHTML = `Informe uma senha`;
        flagError = true;
    } else if (tamanhoSenha < 8) {
        div_result_senha.innerHTML = `A senha deve ter pelo menos 8 caracteres`;
        flagError = true;
    } else if (!temMaiuscula) {
        div_result_senha.innerHTML = `A senha deve conter pelo menos uma letra maiúscula`;
        flagError = true;
    } else if (!temMinuscula) {
        div_result_senha.innerHTML = `A senha deve conter pelo menos uma letra minúscula`;
        flagError = true;
    } else if (contSimbolos == 0) {
        div_result_senha.innerHTML = `A senha deve conter pelo menos um caractere especial`;
        flagError = true;
    } else {
        div_result_senha.innerHTML = ``;
    }

    // VALIDAÇÃO DA CONFIRMAÇÃO DA SENHA
    if (validacaoSenha == '') {
        div_result_confirmacao_senha.innerHTML = `Confirme sua senha`;
        flagError = true;
    } else if (senha != validacaoSenha) {
        div_result_confirmacao_senha.innerHTML = `As senhas não conferem`;
        flagError = true;
    } else {
        div_result_confirmacao_senha.innerHTML = ``;
    }

    if (flagError) {
        return;
    }

    cadastrar();
}

function verSenha1() {
    if (isenha.type == 'password') {
        isenha.type = 'text';
        btn_ver1.innerHTML = 'OCULTAR';
    } else {
        isenha.type = 'password';
        btn_ver1.innerHTML = 'VER';
    }
}

function verSenha2() {
    if (iconfirmacao.type == 'password') {
        iconfirmacao.type = 'text';
        btn_ver2.innerHTML = 'OCULTAR';
    } else {
        iconfirmacao.type = 'password';
        btn_ver2.innerHTML = 'VER';
    }
}

// Array para armazenar empresas cadastradas para validação de código de ativação
let listaEmpresasCadastradas = [];

function cadastrar() {
    var nomeFantasiaVar = iempresa.value;
    var numeroCelular = icelular.value;
    var cnpjVar = icnpj.value;
    var nomeVar = icliente.value;
    var emailVar = imail.value;
    var cpfVar = icpf.value;
    var senhaVar = isenha.value;
    var confirmacaoSenhaVar = iconfirmacao.value;

    if (
        nomeFantasiaVar == "" ||
        numeroCelular == "" ||
        cnpjVar == "" ||
        nomeVar == "" ||
        emailVar == "" ||
        cpfVar == "" ||
        senhaVar == "" ||
        confirmacaoSenhaVar == ""
    ) {
        mostrarPopup('Você precisa preencher todos os campos!');
        return false;
    }

    fetch("/usuarios/cadastrar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            nomeFantasiaServer: nomeFantasiaVar,
            numeroCelularServer: numeroCelular,
            cnpjServer: cnpjVar,
            nomeServer: nomeVar,
            emailServer: emailVar,
            senhaServer: senhaVar,
            cpfServer: cpfVar
        }),
    })
    .then(function (resposta) {
        console.log("resposta: ", resposta);

        if (resposta.ok) {
            setTimeout(() => {
                window.location = "../login.html";
            }, 1000);
        } else {
            throw new Error("Houve um erro ao tentar realizar o cadastro!");
        }
    })
    .catch(function (erro) {
        mostrarPopup("Houve um erro ao tentar realizar o cadastro!");
        console.log(`#ERRO: ${erro}`);
    });

    return false;
}
