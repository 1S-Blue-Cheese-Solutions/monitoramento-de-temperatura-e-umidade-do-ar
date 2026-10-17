function verSenha() {
    if (isenha.type == 'password') {
        isenha.type = 'text';
        btn_ver.innerHTML = 'OCULTAR';
    } else {
        isenha.type = 'password';
        btn_ver.innerHTML = 'VER';
    }
}

function entrar() {
    var emailVar = imail.value;
    var senhaVar = isenha.value;

    if(!(email.includes('@') && email.includes('.com'))) {
        mostrarPopup('o e-mail deve conter \'@\' e \'.com\'!');
        return false;
    }

    if (emailVar == "" || senhaVar == "") {
        mostrarPopup('Todos os campos precisam estar preenchidos!');
        return false;
    }

    console.log("FORM LOGIN: ", emailVar);
    console.log("FORM SENHA: ", senhaVar);


    fetch("/usuarios/autenticar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            emailServer: emailVar,
            senhaServer: senhaVar,
        })
    }).then(function (resposta) {

        if (resposta.ok) {
            console.log(resposta);

            resposta.json().then(json => {
                console.log(json);
                console.log(JSON.stringify(json));
                sessionStorage.EMAIL_USUARIO = json.email;
                sessionStorage.NOME_USUARIO = json.nome;

                setTimeout(function () {
                    window.location = "../dashboard.html";
                }, 1000); // apenas para exibir o loading

            });

        } else {
            mostrarPopup("Houve um erro ao tentar realizar o login!")

            resposta.text().then(texto => {
                console.error(texto);
            });
        }

    }).catch(function (erro) {
        console.log(erro);
    })

    return false;
}