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

        fetch('/api/estabelecimento', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(estabelecimento),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao cadastrar estabelecimento');
            }
            return response.json();
        })
        .then(data => {
            console.log('Estabelecimento cadastrado com sucesso:', data);
            enviarEmailParaEstabelecimento(estabelecimento.email);
            window.location.href = 'login.html';
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
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao enviar e-mail');
        }
        return response.json();
    })
    .then(data => console.log(data.message))
    .catch(error => console.error('Erro ao enviar e-mail:', error));
}

// Função para carregar todos os estabelecimentos
function carregarEstabelecimentos() {
    fetch('/api/estabelecimento')
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erro na resposta da API: ${response.statusText} (Código: ${response.status})`);
        }
        return response.json();
    })
    .then(estabelecimentos => {
        const tabela = document.getElementById('tabela-empresas');
        tabela.innerHTML = '';

        estabelecimentos.forEach(empresa => {
            const row = tabela.insertRow();
            row.insertCell(0).innerText = empresa.nome_empresa;
            row.insertCell(1).innerText = empresa.email;
            row.insertCell(2).innerText = empresa.cnpj;
            row.insertCell(3).innerText = empresa.endereco;
            row.insertCell(4).innerText = empresa.cidade;
            row.insertCell(5).innerText = empresa.telefone;

            const actionsCell = row.insertCell(6);
            actionsCell.innerHTML = `
                <button class="btn btn-warning" onclick="editarEmpresa(this, '${empresa.ID_Estabelecimento}')">Editar</button>
                <button class="btn btn-danger" onclick="excluirEmpresa('${empresa.ID_Estabelecimento}')">Excluir</button>
            `;
        });
    })
    .catch(error => {
        console.error('Erro ao carregar estabelecimentos:', error);
        alert(`Erro ao buscar estabelecimentos: ${error.message}`);
    });
}

// Função para editar empresa
function editarEmpresa(botao, id) {
    const linha = botao.parentNode.parentNode;
    const inputs = Array.from(linha.cells).slice(0, 6).map(cell => {
        const conteudoAtual = cell.innerText;
        cell.innerHTML = `<input type="text" value="${conteudoAtual}" class="form-control">`;
        return cell.querySelector('input');
    });

    botao.innerText = 'Salvar';
    botao.onclick = function() {
        const [nome_empresa, email, cnpj, endereco, cidade, telefone] = inputs.map(input => input.value);

        if (!nome_empresa || !email || !endereco || !cidade || !telefone) {
            alert('Todos os campos devem ser preenchidos!');
            return;
        }

        fetch(`/api/estabelecimentos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome_empresa, email, cnpj, endereco, cidade, telefone })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao atualizar estabelecimento');
            }
            return response.json();
        })
        .then(data => {
            alert('Estabelecimento atualizado com sucesso!');
            carregarEstabelecimentos();
        })
        .catch(error => {
            console.error('Erro ao atualizar:', error);
            alert('Erro ao atualizar estabelecimento. Tente novamente.');
        });
    };
}

// Função para excluir empresa
function excluirEmpresa(id) {
    if (!confirm('Tem certeza que deseja excluir este estabelecimento?')) return;

    fetch(`/api/estabelecimentos/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao excluir estabelecimento');
        }
        return response.json();
    })
    .then(data => {
        alert('Estabelecimento excluído com sucesso!');
        carregarEstabelecimentos();
    })
    .catch(error => {
        console.error('Erro ao excluir:', error);
        alert('Erro ao excluir estabelecimento. Tente novamente.');
    });
}

// Carregar os estabelecimentos ao carregar a página
window.onload = carregarEstabelecimentos;
