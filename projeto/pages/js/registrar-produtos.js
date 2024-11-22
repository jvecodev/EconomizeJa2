async function adicionarProduto(event) {
    event.preventDefault();

    const formData = new FormData();

    // Adiciona os campos ao FormData
    const imageInput = document.getElementById("productImage");
    formData.append("Imagem", imageInput.files[0]);
    formData.append("Nome", document.getElementById("productName").value);
    formData.append("Nicho", document.getElementById("productCategory").value);
    formData.append("Descricao", document.getElementById("productDescription").value);
    formData.append("Preco", document.getElementById("productPrice").value);

    try {
        const response = await fetch('/api/produtos', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            
            document.getElementById("produtoForm").reset();
            carregarProdutos();
        } else {
            const error = await response.json();
            throw new Error(error.error || "Erro ao adicionar produto.");
        }
    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}


// Função para carregar os produtos
async function carregarProdutos() {
    try {
        const response = await fetch('/api/produtos');
        const produtos = await response.json();

        const produtosContainer = document.getElementById("produtosContainer");
        produtosContainer.innerHTML = "";

        if (produtos.length === 0) {
            produtosContainer.innerHTML = "<p class='alert alert-warning'>Nenhum produto encontrado.</p>";
            return;
        }

        // Exibe os produtos existentes
        produtos.forEach((produto, index) => {
            const imagem = produto.Imagem || '';  

            const produtoCard = `
                <div class="col-md-4">
                    <div class="card mb-4">
                        <img src="${imagem}" class="card-img-top" alt="${produto.Nome}" style="height: 400px; object-fit: cover;">
                        <div class="card-body">
                            <h5 class="card-title" id="nameDisplay-${index}">${produto.Nome}</h5>
                            <input type="text" value="${produto.Nome}" class="form-control mb-2" readonly id="name-${index}" style="display: none;">
                            <p class="card-text" id="descriptionDisplay-${index}">${produto.Descricao}</p>
                            <input type="text" value="${produto.Descricao}" class="form-control mb-2" readonly id="description-${index}" style="display: none;">
                            <p class="card-text" id="priceDisplay-${index}"><strong>R$</strong> ${produto.Preco.toFixed(2)}</p>
                            <input type="number" value="${produto.Preco}" class="form-control mb-2" readonly id="price-${index}" style="display: none;">
                            <button class="btn btn-warning mt-2" onclick="toggleEdit(${index}, event, ${produto.ID_Produtos})">Editar</button>
                            <button class="btn btn-danger mt-2" onclick="excluirProduto(${produto.ID_Produtos})">Remover</button>
                        </div>
                    </div>
                </div>
            `;
            produtosContainer.innerHTML += produtoCard;
        });
    } catch (error) {
        console.error("Erro ao carregar produtos:", error);
        alert("Erro ao carregar produtos.");
    }
}

// Função para alternar entre editar e salvar
async function toggleEdit(index, event, produtoId) {
    const nameInput = document.getElementById(`name-${index}`);
    const descriptionInput = document.getElementById(`description-${index}`);
    const priceInput = document.getElementById(`price-${index}`);
    const nameDisplay = document.getElementById(`nameDisplay-${index}`);
    const descriptionDisplay = document.getElementById(`descriptionDisplay-${index}`);
    const priceDisplay = document.getElementById(`priceDisplay-${index}`);
    const button = event.target;

    if (button.innerText === 'Editar') {
        // Muda para modo de edição
        nameInput.style.display = 'block';
        descriptionInput.style.display = 'block';
        priceInput.style.display = 'block';
        nameDisplay.style.display = 'none';
        descriptionDisplay.style.display = 'none';
        priceDisplay.style.display = 'none';
        button.innerText = 'Salvar';
        nameInput.removeAttribute('readonly');
        descriptionInput.removeAttribute('readonly');
        priceInput.removeAttribute('readonly');
        nameInput.focus();
    } else {
        // Salva as alterações
        const updatedProduto = {
            Nome: nameInput.value,
            Descricao: descriptionInput.value,
            Preco: parseFloat(priceInput.value)
        };

        try {
            const response = await fetch(`/api/produtos/${produtoId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedProduto),
            });

            if (response.ok) {
                const produtoAtualizado = await response.json();
                atualizarDisplay(index, produtoAtualizado, button);
                alert("Produto atualizado com sucesso!");
                carregarProdutos(); // Recarrega a lista de produtos
            } else {
                throw new Error("Erro ao atualizar produto.");
            }
        } catch (error) {
            console.error("Erro ao atualizar produto:", error);
            alert("Erro ao atualizar produto. Tente novamente.");
        }
    }
}

// Função para atualizar a exibição depois de salvar
function atualizarDisplay(index, produtoAtualizado, button) {
    const nameDisplay = document.getElementById(`nameDisplay-${index}`);
    const descriptionDisplay = document.getElementById(`descriptionDisplay-${index}`);
    const priceDisplay = document.getElementById(`priceDisplay-${index}`);
    const nameInput = document.getElementById(`name-${index}`);
    const descriptionInput = document.getElementById(`description-${index}`);
    const priceInput = document.getElementById(`price-${index}`);

    // Atualiza os valores de exibição
    nameDisplay.innerText = produtoAtualizado.Nome;
    descriptionDisplay.innerText = produtoAtualizado.Descricao;
    priceDisplay.innerHTML = `<strong>R$</strong> ${parseFloat(produtoAtualizado.Preco).toFixed(2)}`;

    // Esconde os campos de entrada e mostra os textos atualizados
    nameInput.style.display = 'none';
    descriptionInput.style.display = 'none';
    priceInput.style.display = 'none';
    nameDisplay.style.display = 'block';
    descriptionDisplay.style.display = 'block';
    priceDisplay.style.display = 'block';

    // Volta o texto do botão para 'Editar'
    button.innerText = 'Editar';
}

// Função para excluir um produto
async function excluirProduto(produtoId) {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
        try {
            const response = await fetch(`/api/produtos/${produtoId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert("Produto excluído com sucesso!");
                carregarProdutos(); // Atualiza a lista de produtos
            } else {
                throw new Error("Erro ao excluir produto.");
            }
        } catch (error) {
            console.error("Erro ao excluir produto:", error);
            alert("Erro ao excluir produto.");
        }
    }
}

// Carrega os produtos ao iniciar a página
document.addEventListener('DOMContentLoaded', carregarProdutos);

// Adiciona o evento de submit ao formulário de novo produto
document.getElementById("produtoForm").addEventListener("submit", adicionarProduto);
