// sessão
function validarSessao() {
    var email = sessionStorage.EMAIL_USUARIO;
    var nome = sessionStorage.NOME_CLIENTE;

    var b_usuario = document.getElementById("nome_usuario");
    var avatar_usuario = document.getElementById("avatar_usuario");

    if (email != null && nome != null) {
        b_usuario.innerHTML = nome;

        avatar_usuario.innerHTML = nome
            .trim()
            .split(" ")
            .filter(palavra => palavra != "")
            .map(palavra => palavra[0])
            .slice(0, 2)
            .join("")
            .toUpperCase();
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