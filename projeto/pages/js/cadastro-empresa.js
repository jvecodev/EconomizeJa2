// Função para cadastrar um estabelecimento
function cadastrarEstabelecimento() {
    const nome_empresa = document.getElementById('nome-restaurante').value;
    const email = document.getElementById('email-restaurante').value;
    const cnpj = document.getElementById('cnpj-restaurante').value;
    const endereco = document.getElementById('endereco-restaurante').value;
    const cidade = document.getElementById('cidade-restaurante').value;
    const telefone = document.getElementById('telefone-restaurante').value;
    const senha = document.getElementById('senha-restaurante').value;

    if (nome_empresa && email && cnpj && endereco && cidade && telefone && senha) {
        const estabelecimento = { nome_empresa, email, cnpj, endereco, cidade, telefone, senha };

        // Adicionar ao armazenamento local
        const estabelecimentos = JSON.parse(localStorage.getItem('estabelecimentos')) || [];
        estabelecimentos.push(estabelecimento);
        localStorage.setItem('estabelecimentos', JSON.stringify(estabelecimentos));

        // Enviar para a API
        fetch('/api/estabelecimentos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(estabelecimento),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Estabelecimento cadastrado com sucesso:', data);
            enviarEmailParaEstabelecimento(estabelecimento.email);
            window.open('login.html', '_blank');
        })
        .catch(error => {
            console.error('Erro ao cadastrar o estabelecimento:', error);
            alert('Ocorreu um erro ao cadastrar o estabelecimento.');
        });
    } else {
        alert('Por favor, preencha todos os campos.');
    }
}

// Função para enviar e-mail para o estabelecimento
function enviarEmailParaEstabelecimento(email) {
    fetch('/api/sendEmail', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
            subject: 'Bem-vindo!',
            text: 'Obrigado por se cadastrar!',
        }),
    })
    .then(response => response.json())
    .then(data => console.log(data.message))
    .catch(error => console.error('Erro ao enviar e-mail:', error));
}

// Função para carregar e exibir estabelecimentos na tabela
async function carregarEstabelecimentos() {
    const tabela = document.getElementById('tabela-estabelecimentos');

    // Verificar se a tabela existe
    if (!tabela) {
        console.error("Erro: elemento com ID 'tabela-estabelecimentos' não encontrado.");
        return;
    }

    tabela.innerHTML = ''; // Limpa a tabela antes de adicionar novos dados

    try {
        const response = await fetch('/api/estabelecimentos');
        const estabelecimentos = await response.json();

        console.log(estabelecimentos); // Para verificar se os dados estão corretos

        estabelecimentos.forEach(estabelecimento => {
            const linha = document.createElement('tr');
            linha.innerHTML = `
                <td>${estabelecimento.Nome}</td>
                <td>${estabelecimento.Endereco}</td>
                <td>${estabelecimento.Telefone}</td>
                <td>${estabelecimento.Email}</td>
            `;
            tabela.appendChild(linha);
        });
    } catch (error) {
        console.error('Erro ao carregar estabelecimentos:', error);
    }
}



// Função para editar um estabelecimento
function editarEmpresa(botao, cnpj) {
    const linha = botao.parentNode.parentNode;
    const inputs = Array.from(linha.cells).slice(0, 6).map((cell, index) => {
        if (index !== 2) { // Ignora o campo CNPJ
            const conteudoAtual = cell.innerText;
            cell.innerHTML = `<input type="text" value="${conteudoAtual}" class="form-control">`;
            return cell.querySelector('input');
        }
        return null;
    }).filter(input => input !== null);

    botao.innerText = 'Salvar';
    botao.onclick = function() {
        const [nome_empresa, email, endereco, cidade, telefone] = inputs.map(input => input.value);
        if (!nome_empresa || !email || !endereco || !cidade || !telefone) {
            alert('Todos os campos devem ser preenchidos!');
            return;
        }

        fetch(`/api/estabelecimentos/${cnpj}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome_empresa, email, endereco, cidade, telefone })
        })
        .then(response => {
            if (!response.ok) throw new Error(`Erro ao atualizar estabelecimento: ${response.statusText}`);
            alert('Estabelecimento atualizado com sucesso!');
            carregarEstabelecimentos();
        })
        .catch(error => {
            console.error('Erro ao atualizar:', error);
            alert('Erro ao atualizar estabelecimento. Tente novamente.');
        });
    };
}

// Função para excluir um estabelecimento
function excluirEmpresa(ID_Estabelecimento) {
    if (!confirm('Tem certeza que deseja excluir este estabelecimento?')) return;

    fetch(`/api/estabelecimentos/${ID_Estabelecimento}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) throw new Error(`Erro ao excluir estabelecimento: ${response.statusText}`);
        alert('Estabelecimento excluído com sucesso!');
        carregarEstabelecimentos(); // Atualizar a tabela
    })
    .catch(error => {
        console.error('Erro ao excluir:', error);
        alert('Erro ao excluir estabelecimento. Tente novamente.');
    });
}

// Carregar os estabelecimentos ao carregar a página
window.onload = carregarEstabelecimentos;
