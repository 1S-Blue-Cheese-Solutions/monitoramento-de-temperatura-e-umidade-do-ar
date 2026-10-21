// sessão
function validarSessao() {
    var email = sessionStorage.EMAIL_USUARIO;
    var nome = sessionStorage.NOME_CLIENTE;
    

    var b_usuario = document.getElementById("b_usuario");

    if (email != null && nome != null) {
        // Informações do usuário
        //b_usuario.innerHTML = nome;
    } else {
        window.location = "./login.html";
    }
}

function limparSessao() {
    sessionStorage.clear();
}

function mostrarPopup(mensagem) {
    mensagemPopup.textContent = mensagem;
    popup.style.display = "flex";
}

function fecharPopup() {
    popup.style.display = "none";
}