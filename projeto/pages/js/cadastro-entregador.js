function cadastrarMotoboy() {
    const nome = document.getElementById('nome-motoboy').value;
    const email = document.getElementById('email-motoboy').value;
    const senha = document.getElementById('senha-motoboy').value;
    const cpf = document.getElementById('cpf-motoboy').value;
    const placa = document.getElementById('placa-motoboy').value;
    const cnh = document.getElementById('cnh-motoboy').value;
    const telefone = document.getElementById('telefone-motoboy').value;

    if(nome && email && cpf && placa && cnh && telefone && senha) {
        const motoboy = { nome, email, cpf, placa, cnh, telefone, senha };

        const motoboys = JSON.parse(localStorage.getItem('motoboys')) || [];
        motoboys.push(motoboy);
        localStorage.setItem('motoboys', JSON.stringify(motoboys));

        fetch('/api/motoboys', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(motoboy),
        })
            .then((response) => response .json())
            .then((data) => {
                console.log('Motoboy cadastrado com sucesso:', data);
                // enviarEmailParaMotoboy(motoboy.email);
                window.open('login.html', '_blank');
               
            })
            .catch((error) => {
                console.error('Erro ao cadastrar o motoboy:', error);
                alert('Ocorreu um erro ao cadastrar o motoboy.');
            });

        } else {
            alert('Por favor, preencha todos os campos.');
        }
}

// function enviarEmailParaMotoboy(email) {
//     fetch('/api/sendEmail', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//             email: email,
//             subject: 'Bem-vindo!',
//             text: 'Obrigado por se cadastrar!',
//         }),
//     })
//     .then(response => response.json())
//     .then(data => console.log(data.message))
//     .catch(error => console.error('Erro ao enviar e-mail:', error));
// }

function carrregarMotoboys() {
    const motoboys = JSON.parse(localStorage.getItem('motoboys'));
    const tabela = document.getElementById('tabela-motoboys');

    tabela.innerHTML = '';

    motoboys.forEach((motoboy) => {
        const row = tabela.insertRow();
        row.insertCell(0).textContent = motoboy.nome;
        row.insertCell(1).textContent = motoboy.email;
        row.insertCell(2).textContent = motoboy.cpf;
        row.insertCell(3).textContent = motoboy.placa;
        row.insertCell(4).textContent = motoboy.cnh;
        row.insertCell(5).textContent = motoboy.telefone;

        // Criando a célula de Ações com os botões de Editar e Excluir
        const acoesCell = row.insertCell(7);
        acoesCell.innerHTML = `
            <button class="btn btn-warning btn-sm" onclick="editarMotoboy('${motoboy.ID_motoboy}')">Editar</button>
            <button class="btn btn-danger btn-sm" onclick="excluirMotoboy('${motoboy.ID_motoboy}')">Excluir</button>
        `;
    });
}
function editarMotoboy(botao) {
    const linha = botao.parentNode.parentNode;
    const colunas = linha.querySelectorAll('td');

    // Exemplo simples: permite edição in-line
    colunas.forEach((coluna, index) => {
        if (index < colunas.length - 1) {
            // Não permite edição da última coluna (Ações)
            const conteudoAtual = coluna.innerText;
            coluna.innerHTML = `<input type="text" value="${conteudoAtual}" class="form-control">`;
        }
    });

    botao.innerText = 'Salvar';
    botao.onclick = function () {
        salvarEdicao(linha);
    };
}

function salvarEdicao(linha) {
    const inputs = linha.querySelectorAll('input');
    const motoboyAtualizado = {};

    inputs.forEach((input, index) => {
        const valorEditado = input.value;
        linha.cells[index].innerText = valorEditado;

        // Adicionar os dados editados ao objeto `motoboyAtualizado`
        switch (index) {
            case 0:
                motoboyAtualizado.nome = valorEditado;
                break;
            case 1:
                motoboyAtualizado.email = valorEditado;
                break;
            case 2:
                motoboyAtualizado.cpf = valorEditado;
                break;
            case 3:
                motoboyAtualizado.placa = valorEditado;
                break;
            case 4:
                motoboyAtualizado.cnh = valorEditado;
                break;
            case 5:
                motoboyAtualizado.telefone = valorEditado;
                break;
            default:
                break;
        }
    });

    // Atualizar o objeto no Local Storage
    let motoboys = JSON.parse(localStorage.getItem('motoboys'));
    const index = motoboys.findIndex(
        (motoboy) => motoboy.cpf === motoboyAtualizado.cpf
    );

    if (index !== -1) {
        motoboys[index] = motoboyAtualizado;
        localStorage.setItem('motoboys', JSON.stringify(motoboys));
    }

    linha.querySelector('.btn-warning').innerText = 'Editar';
    linha.querySelector('.btn-warning').onclick = function () {
        editarMotoboy(this);
    };
}

function excluirMotoboy(botao) {
    const linha = botao.parentNode.parentNode;
    const cpf = linha.cells[2].innerText;

    fetch(`/api/motoboys/${cpf}`, {
        method: 'DELETE',
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Erro ao excluir motoboy.');
            }

            const motoboys = JSON.parse(localStorage.getItem('motoboys'));
            const index = motoboys.findIndex((motoboy) => motoboy.cpf === cpf);

            if (index !== -1) {
                motoboys.splice(index, 1);
                localStorage.setItem('motoboys', JSON.stringify(motoboys));
            }

            linha.remove();
        })
        .catch((error) => {
            console.error('Erro:', error.message);
            alert('Erro ao excluir motoboy.');
        });
}

function buscarMotoboy(){
    const searchImput = document.getElementById('searchImput').value;
    const filter = searchImput.value.toLowerCase();
    const rows = document.querySelectorAll('#tabela-motoboys tr');

    rows.forEach((row) => {
        const cells = row.getElementsByTagName('td');
        let match = false;

        for (let i = 0 ; i < cells.length - 1; i++){
            
            if(cells[i].textContent.toLowerCase().includes(filter)){
                match = true;
                break;
            }
            }

        if (match){
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }	
    });
  }


document.getElementById('searchInput').addEventListener('input', buscarMotoboy)

carrregarMotoboys