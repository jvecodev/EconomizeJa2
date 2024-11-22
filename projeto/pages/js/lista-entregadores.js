// Função para carregar e exibir os motoboys na tabela
async function carregarMotoboys() {
    const tabela = document.getElementById('tabela-motoboys');
    tabela.innerHTML = ''; // Limpa a tabela antes de adicionar novos dados

    // Faz uma solicitação GET para buscar os dados do banco de dados
    try {
        const response = await fetch('/api/motoboys'); // Atualize para o endpoint correto
        const motoboys = await response.json();

        console.log(motoboys); // Verificar se os dados estão chegando corretamente

        // Adiciona uma linha na tabela para cada motoboy
        motoboys.forEach(motoboy => {
            const linha = document.createElement('tr');
            linha.innerHTML = `
                <td>${motoboy.Nome}</td>
                <td>${motoboy.Email}</td>
                <td>${motoboy.Senha}</td>
                <td>${motoboy.CPF}</td>
                <td>${motoboy.Placa}</td>
                <td>${motoboy.CNH}</td>
                <td>${motoboy.Telefone}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editarMotoboy(this, '${motoboy.CPF}')">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="excluirMotoboy('${motoboy.CPF}')">Excluir</button>
                </td>
            `;
            tabela.appendChild(linha);
        });
    } catch (error) {
        console.error('Erro ao carregar motoboys:', error);
    }
}

// Função para editar um motoboy
function editarMotoboy(botao, cpf) {
    const linha = botao.parentNode.parentNode;
    const colunas = linha.querySelectorAll('td');

    // Permite edição in-line, exceto o CPF
    colunas.forEach((coluna, index) => {
        if (index < colunas.length - 1) { // Não permite edição da última coluna (Ações)
            const conteudoAtual = coluna.innerText;
            // Se for a coluna do CPF, mantém como texto, caso contrário, cria um input
            if (index === 3) { // Supondo que o CPF seja o quarto índice (0-base)
                coluna.innerHTML = `<span>${conteudoAtual}</span>`;
            } else {
                coluna.innerHTML = `<input type="text" value="${conteudoAtual}" class="form-control">`;
            }
        }
    });

    botao.innerText = 'Salvar';
    botao.onclick = function () {
        salvarEdicaoMotoboy(linha, cpf);
    };
}

async function salvarEdicaoMotoboy(linha, cpf) {
    const inputs = linha.querySelectorAll('input');
    const motoboyEditado = {
        nome: inputs[0].value,
        email: inputs[1].value,
        senha: inputs[2].value,
        cpf: cpf, // O CPF deve ser mantido, não deve ser alterado.
        placa: inputs[4].value,
        cnh: inputs[5].value,
        telefone: inputs[6].value
    };

    // Validação de campos
    if (!motoboyEditado.nome || !motoboyEditado.email || !motoboyEditado.telefone) {
        alert('Por favor, preencha todos os campos!');
        return;
    }

    try {
        const response = await fetch(`/api/motoboys/${cpf}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(motoboyEditado)
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error('Falha ao atualizar motoboy: ' + JSON.stringify(errorResponse));
        }

        // Atualiza a tabela novamente após a edição
        await carregarMotoboys(); // Garante que a tabela seja recarregada com os dados mais recentes

        // Restaura o botão para "Editar"
        linha.querySelector('button').innerText = 'Editar';
    } catch (error) {
        console.error('Erro ao salvar edição do motoboy:', error);
    }
}

// Função para excluir um motoboy
async function excluirMotoboy(cpf) {
    try {
        await fetch(`/api/motoboys/${cpf}`, { method: 'DELETE' });
        carregarMotoboys(); // Recarrega os dados para atualizar a tabela
    } catch (error) {
        console.error('Erro ao excluir motoboy:', error);
    }
}

function atualizarMotoboy() {
    const tabela = document.getElementById('tabela-motoboys');
    const linhas = tabela.getElementsByTagName('tr');
    let motoboys = [];

    // Inicia do índice 1 para ignorar o cabeçalho
    Array.from(linhas).forEach((linha, index) => {
        // Ignora a primeira linha (cabeçalho)
        if (index === 0) return;

        const cells = linha.getElementsByTagName('td');
        if (cells.length > 0) { // Verifica se a linha tem células
            const motoboy = {
                nome: cells[0] ? cells[0].innerText.trim() : null,
                email: cells[1] ? cells[1].innerText.trim() : null,
                senha: cells[2] ? cells[2].innerText.trim() : null,
                cpf: cells[3] ? cells[3].innerText.trim() : null,
                placa: cells[4] ? cells[4].innerText.trim() : null,
                cnh: cells[5] ? cells[5].innerText.trim() : null,
                telefone: cells[6] ? cells[6].innerText.trim() : null
            };
            motoboys.push(motoboy);
        }
    });

    // Debug: Log dos motoboys para verificar
    console.log(motoboys);

    // Faz a requisição ao servidor para salvar os dados
    fetch('/api/motoboys', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(motoboys)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao salvar os dados no banco de dados.');
        }
        console.log('Dados dos motoboys salvos com sucesso!');
    })
    .catch(error => {
        console.error('Erro:', error);
    });
}

window.onload = carregarMotoboys;
