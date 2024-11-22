// Carregar dados do usuário logado
function carregarPerfil() {
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

    if (usuarioLogado) {
        document.getElementById("nome-perfil").innerText = usuarioLogado.nome;
        document.getElementById("email-perfil").innerText = usuarioLogado.email;
        document.getElementById("cpf-perfil").innerText = usuarioLogado.cpf;
        document.getElementById("endereco-perfil").innerText = usuarioLogado.endereco;
        document.getElementById("cidade-perfil").innerText = usuarioLogado.cidade;
        document.getElementById("telefone-perfil").innerText = usuarioLogado.telefone;
    } else {
        window.location.href = "login.html"; // Redirecionar se não houver usuário logado
    }
}

// Função para editar o perfil
function editarPerfil() {
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
    const nome = prompt("Novo Nome:", usuarioLogado.nome);
    const email = prompt("Novo Email:", usuarioLogado.email);
    const endereco = prompt("Novo Endereço:", usuarioLogado.endereco);
    const cidade = prompt("Nova Cidade:", usuarioLogado.cidade);
    const telefone = prompt("Novo Telefone:", usuarioLogado.telefone);

    if (nome && email && endereco && cidade && telefone) {
        usuarioLogado.nome = nome;
        usuarioLogado.email = email;
        usuarioLogado.endereco = endereco;
        usuarioLogado.cidade = cidade;
        usuarioLogado.telefone = telefone;

        // Atualizar o localStorage
        let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
        const indexUsuario = usuarios.findIndex(usuario => usuario.cpf === usuarioLogado.cpf);
        
        if (indexUsuario !== -1) {
            usuarios[indexUsuario] = usuarioLogado;
            localStorage.setItem("usuarios", JSON.stringify(usuarios));
            carregarPerfil(); // Recarregar perfil atualizado
        }
    }
}

// Função para excluir o perfil
function excluirPerfil() {
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (confirm("Tem certeza que deseja excluir sua conta?")) {
        let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
        usuarios = usuarios.filter(usuario => usuario.cpf !== usuarioLogado.cpf);
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
        localStorage.removeItem("usuarioLogado");
        window.location.href = "login.html"; // Redirecionar para a página de login após exclusão
    }
}

// Chamar a função para carregar o perfil ao iniciar a página
carregarPerfil();

document.addEventListener('DOMContentLoaded', function () {
    carregarDadosMotoboy();
});

function carregarDadosMotoboy() {
    const motoboys = JSON.parse(localStorage.getItem('motoboys'));
    const emailLogado = localStorage.getItem('emailLogado'); // Supondo que você armazene o email do motoboy logado

    if (motoboys && emailLogado) {
        const motoboy = motoboys.find(m => m.email === emailLogado);
        if (motoboy) {
            document.getElementById('nome-motoboy').value = motoboy.nome;
            document.getElementById('email-motoboy').value = motoboy.email;
            document.getElementById('cpf-motoboy').value = motoboy.cpf;
            document.getElementById('placa-motoboy').value = motoboy.placa;
            document.getElementById('cnh-motoboy').value = motoboy.cnh;
            document.getElementById('telefone-motoboy').value = motoboy.telefone;
        }
    }
}

function salvarEdicoes() {
    const nome = document.getElementById('nome-motoboy').value;
    const email = document.getElementById('email-motoboy').value;
    const cpf = document.getElementById('cpf-motoboy').value;
    const placa = document.getElementById('placa-motoboy').value;
    const cnh = document.getElementById('cnh-motoboy').value;
    const telefone = document.getElementById('telefone-motoboy').value;

    const motoboys = JSON.parse(localStorage.getItem('motoboys'));
    const emailLogado = localStorage.getItem('emailLogado'); // Supondo que você armazene o email do motoboy logado

    if (motoboys && emailLogado) {
        const index = motoboys.findIndex(m => m.email === emailLogado);
        if (index !== -1) {
            motoboys[index] = { nome, email, cpf, placa, cnh, telefone }; // Atualizando os dados
            localStorage.setItem('motoboys', JSON.stringify(motoboys));
            alert('Dados atualizados com sucesso!');
        }
    }
}
// Função para carregar os dados do motoboy na página


// Função para excluir a conta do motoboy
function excluirConta() {
    const motoboy = JSON.parse(localStorage.getItem('motoboy'));
    const cpf = motoboy.cpf; // Usando o CPF como identificador

    fetch(`/api/motoboys/${cpf}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao excluir a conta.');
            }
            alert('Conta excluída com sucesso!');
            localStorage.removeItem('motoboy'); // Remove os dados do localStorage
            window.location.href = 'home.html'; // Redirecionar para a página inicial
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Ocorreu um erro ao excluir a conta.');
        });
}


