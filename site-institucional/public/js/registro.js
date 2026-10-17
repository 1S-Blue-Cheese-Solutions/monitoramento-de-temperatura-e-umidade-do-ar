
function registrar() {
    // Implementar mais tarde o envio do cadastro
    let empresa = iempresa.value;
    let cnpj = icnpj.value;
    let cliente = icliente.value;
    let cpf = icpf.value;
    let email = imail.value;
    let celular = icelular.value;
    let flagError = false;

    if(empresa == '') {
        div_result_empresa.innerHTML = `Informe o nome da empresa`
        flagError = true;
    } else {
        div_result_empresa.innerHTML = ``
    }

    if(cnpj.length != 14 || cnpj.includes("-") || cnpj.includes(".")) {
        div_result_cnpj.innerHTML = `CNPJ deve ter 14 números`
        flagError = true;
    } else {
        div_result_cnpj.innerHTML = ``
    }

    if(cliente == '') {
        div_result_cliente.innerHTML = `Informe o seu nome`
        flagError = true;
    } else {
        div_result_cliente.innerHTML = ``
    }

    if(cpf.length != 11 || cnpj.includes("-") || cnpj.includes(".")) {
        div_result_cpf.innerHTML = `CPF deve ter 11 números`
        flagError = true;
    } else {
        div_result_cpf.innerHTML = ``
    }

    if(email.includes('@') && email.includes('.com')) {
        div_result_mail.innerHTML = ``
    } else {
        div_result_mail.innerHTML = `Email deve conter @ e .com`
        flagError = true;
    }

    if(celular.length != 11) {
        div_result_celular.innerHTML = `Celular deve ter DDD + 9 números`
        flagError = true;
    } else {
        div_result_celular.innerHTML = ``
    }

    // VALIDAÇÃO DA SENHA
    let senha = isenha.value;
    let tamanhoSenha = senha.length;
    let temMaiuscula = senha !== senha.toUpperCase();
    let temMinuscula = senha !== senha.toLowerCase();

    if(temMaiuscula && temMinuscula && tamanhoSenha >= 8) {
        div_result_senha.innerHTML = ``
    } else if(temMaiuscula && temMinuscula) {
        div_result_senha.innerHTML = `Senha deve ter mais que 8 caracteres`
        flagError = true;
    } else if(temMaiuscula && tamanhoSenha >= 8) {
        div_result_senha.innerHTML = `Senha deve conter letra minuscula`
        flagError = true;
    } else if(temMinuscula && tamanhoSenha >= 8) {
        div_result_senha.innerHTML = `Senha deve conter letra maiscula`
        flagError = true;
    } else if(tamanhoSenha >= 8) {
        div_result_senha.innerHTML = `Senha deve conter Maiuscula e minuscula`
        flagError = true;
    } else if(temMaiuscula) {
        div_result_senha.innerHTML = `Senha deve ter mais que 8 caracteres <br> e conter minuscula`
        flagError = true;
    } else if(temMinuscula) {
        div_result_senha.innerHTML = `Senha deve ter mais que 8 caracteres <br> e conter minuscula`
        flagError = true;
    } else if(tamanhoSenha == 0) {
        div_result_senha.innerHTML = `Informe uma senha`
        flagError = true;
    }

    let contador = 0;
    let contSimbolos = 0;
    let simbolos = '!@#$%&*()_+-=[]{};:,.<>?/|~';

    while (contador < senha.length) {
        if (simbolos.includes(senha[contador])) {
            contSimbolos++;
        }
        contador++;
    }

    if(flagError) {
        return
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
    // aguardar();

    //Recupere o valor da nova input pelo nome do id
    // Agora vá para o método fetch logo abaixo
    var nomeFantasiaVar = iempresa.value;
    var numeroCelular = icelular.value;
    var cnpjVar = icnpj.value;
    var nomeVar = icliente.value;
    var emailVar = imail.value;
    var cpfVar = icpf.value;
    var senhaVar = isenha.value;
    var confirmacaoSenhaVar = iconfirmacao.value;

    // Verificando se há algum campo em branco
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
        mostrarPopup('Você precisa preencher todos os campos!')
    }

    // Enviando o valor da nova input
    fetch("/usuarios/cadastrar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            // crie um atributo que recebe o valor recuperado aqui
            // Agora vá para o arquivo routes/usuario.js
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
            }, "1000");

        } else {
            throw "Houve um erro ao tentar realizar o cadastro!";
        }
    })
    .catch(function (resposta) {
        console.log(`#ERRO: ${resposta}`);

        mostrarPopup(resposta);
    });

    return false;
}

function mostrarPopup(mensagem) {
    mensagemPopup.textContent = mensagem;
    popup.style.display = "flex";
}

function fecharPopup() {
    popup.style.display = "none";
}
