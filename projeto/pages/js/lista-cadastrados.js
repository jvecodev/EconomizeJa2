const inputPesquisar = document.getElementById('searchInput');

function inputPesquisarUsuarios() {
    const filtro = inputPesquisar.value.toUpperCase();
    const tabela = document.getElementById('tabela-usuarios');	
    const linhas = tabela.getElementsByTagName('tr');

    for (let i = 0; i < linhas.length; i++) {
        const colunas = linhas[i].getElementsByTagName('td');
        let encontrou = false;

        for (let j = 0; j < colunas.length - 1; j++) {
            const texto = colunas[j].innerText.toUpperCase();
            if (texto.indexOf(filtro) > -1) {
                encontrou = true;
                break;
            }
        }
        linhas[i].style.display = encontrou ? '' : 'none';
    }
}



async function carregarUsuarios() {
    const tabela = document.getElementById('tabela-usuarios');
    tabela.innerHTML = ''; 

    try {
        const response = await fetch('/api/usuarios');
        const usuarios = await response.json();

        usuarios.forEach(usuario => {
            const linha = document.createElement('tr');
            linha.innerHTML = `
                <td>${usuario.Nome}</td>
                <td>${usuario.Email}</td>
                <td>${usuario.CPF}</td>
                <td>${usuario.Telefone}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editarUsuario(this, '${usuario.CPF}')">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="excluirUsuario('${usuario.CPF}')">Excluir</button>
                </td>
            `;
            tabela.appendChild(linha);
        });
    } catch (error) {
        console.error('Erro ao carregar usuários:', error);
    }
}
// Função para editar um usuário
function editarUsuario(botao, cpf) {
    const linha = botao.parentNode.parentNode;
    const colunas = linha.querySelectorAll('td');

    // Permite edição in-line para os campos, exceto o CPF
    colunas.forEach((coluna, index) => {
        if (index < colunas.length - 1) { // Não permite edição da última coluna (Ações)
            const conteudoAtual = coluna.innerText;
            // Se for a coluna do CPF, mantém como texto, caso contrário, cria um input
            if (index === 2) { // Supondo que o CPF seja o terceiro índice (0-Base)
                coluna.innerHTML = `<span>${conteudoAtual}</span>`;
            } else {
                coluna.innerHTML = `<input type="text" value="${conteudoAtual}" class="form-control">`;
            }
        }
    });

    botao.innerText = 'Salvar';
    botao.onclick = function () {
        salvarEdicaoUsuario(linha, cpf);
    };
}


async function salvarEdicaoUsuario(linha, cpf) {
    const inputs = linha.querySelectorAll('input');
    const usuarioEditado = {
        nome: inputs[0].value,
        email: inputs[1].value,
        cpf: cpf,  // O CPF deve ser mantido, não deve ser alterado.
        telefone: inputs[2].value
    };

    // Validação de campos
    if (!usuarioEditado.nome || !usuarioEditado.email || !usuarioEditado.telefone) {
        alert('Por favor, preencha todos os campos!');
        return;
    }

    try {
        const response = await fetch(`/api/usuarios/${cpf}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(usuarioEditado)
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error('Falha ao atualizar usuário: ' + JSON.stringify(errorResponse));
        }

        // Atualiza a tabela novamente após a edição
        await carregarUsuarios();  // Garante que a tabela seja recarregada com os dados mais recentes

        // Restaura o botão para "Editar"
        linha.querySelector('button').innerText = 'Editar';
    } catch (error) {
        console.error('Erro ao salvar edição:', error);
    }
}
// Função para excluir um usuário
async function excluirUsuario(cpf) {
    try {
        await fetch(`/api/usuarios/${cpf}`, { method: 'DELETE' });
        carregarUsuarios(); // Recarrega os dados para atualizar a tabela
    } catch (error) {
        console.error('Erro ao excluir usuário:', error);
    }
}

// Função para atualizar os dados dos usuários no localStorage
function atualizarUsuarios() {
    const tabela = document.getElementById('tabela-usuarios');
    const linhas = tabela.getElementsByTagName('tr');
    let usuarios = [];

    Array.from(linhas).forEach(linha => {
        const cells = linha.getElementsByTagName('td');
        if (cells.length > 0) { // Verifica se a linha tem células
            const usuario = {
                nome: cells[0].innerText,
                email: cells[1].innerText,
                cpf: cells[2].innerText,
                telefone: cells[3].innerText,
                senha: cells[4].innerText // Certifique-se de ter um campo de senha na tabela
            };
            usuarios.push(usuario);
        }
    });

    // Faz a requisição ao servidor para salvar os dados
    fetch('/api/usuarios', { // caminho atualizado para o endpoint
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(usuarios)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao salvar os dados no banco de dados.');
        }
        console.log('Dados salvos com sucesso!');
    })
    .catch(error => {
        console.error('Erro:', error);
    });
}


// Chama a função para carregar os usuários quando a página é carregada
window.onload = carregarUsuarios;