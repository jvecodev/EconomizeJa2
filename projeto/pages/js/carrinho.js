async function carregarCarrinho() {
    const carrinhoContainer = document.getElementById("carrinhoContainer");
    let carrinhoConteudo = '';  // Variável para armazenar o HTML do carrinho

    try {
        const response = await fetch('/api/produtos-pedidos');
        const produtosPedidos = await response.json();

        if (produtosPedidos.length === 0) {
            carrinhoContainer.innerHTML = "<p class='alert alert-warning'>Carrinho vazio.</p>";
            return;
        }

        produtosPedidos.forEach(produtoPedido => {
            // Verifica se os dados necessários estão presentes
            if (!produtoPedido.Nome || !produtoPedido.Preco || !produtoPedido.Imagem || produtoPedido.Quantidade === undefined) {
                console.error('Dados incompletos para o produto', produtoPedido);
                return;
            }

            // Adiciona o HTML para o item do produto no carrinho
            carrinhoConteudo += `
                <div class="produto-card" id="produto-${produtoPedido.ID_Produtos_Pedidos}">
                    <div class="produto-imagem">
                        <img src="${produtoPedido.Imagem}" alt="${produtoPedido.Nome}">
                    </div>
                    <div class="conteudo">
                    <div class="produto-informacoes">
                        <h5 class="produto-nome">${produtoPedido.Nome}</h5>
                        <p class="produto-descricao">${produtoPedido.Descricao}</p>
                        <p class="produto-preco">R$ ${produtoPedido.Preco.toFixed(2)}</p>
                        <div class="produto-quantidade">
                            <strong>Quantidade:</strong>
                            <span id="quantidade-${produtoPedido.ID_Produtos_Pedidos}">${produtoPedido.Quantidade}</span>
                            <div id="input-quantidade-${produtoPedido.ID_Produtos_Pedidos}" class="d-none">
                                <input type="number" value="${produtoPedido.Quantidade}" min="1" id="input-quantidade-num-${produtoPedido.ID_Produtos_Pedidos}" class="input-quantidade">
                                <button class="btn btn-primary" onclick="salvarQuantidade(${produtoPedido.ID_Produtos_Pedidos})">Salvar</button>
                            </div>
                        </div>
                    </div>
                    <div class="produto-botoes">
                        <button class="btn btn-danger" onclick="excluirProduto(${produtoPedido.ID_Produtos_Pedidos})">
                            <i class="bi bi-trash"></i>
                        </button>
                        <button class="btn btn-primary" onclick="mostrarInputQuantidade(${produtoPedido.ID_Produtos_Pedidos})">
                            <i class="bi bi-plus-circle"></i>
                        </button>
                    </div>
                    </div>
                </div>
            `;
        });

        // Coloca o conteúdo do carrinho no carrinhoContainer
        carrinhoContainer.innerHTML = carrinhoConteudo;

        // Adiciona o botão de finalizar compra fora dos produtos
        const finalizarCompraButton = `
            <div class="finalizar-compra">
                <button class="btn btn-success" onclick="finalizarCompra()">Finalizar Compra</button>
            </div>
        `;
        carrinhoContainer.innerHTML += finalizarCompraButton;

    } catch (error) {
        console.error("Erro ao carregar carrinho:", error);
        alert("Erro ao carregar carrinho.");
    }
}

async function excluirProduto(produtoPedidoId) {
    try {
        const response = await fetch(`/api/produtos-pedidos/${produtoPedidoId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            document.getElementById(`produto-${produtoPedidoId}`).remove();
            alert("Produto excluído do carrinho!");
        } else {
            const errorData = await response.json();
            alert(`Erro ao excluir produto: ${errorData.error}`);
        }
    } catch (error) {
        console.error('Erro ao excluir produto:', error);
        alert('Erro ao excluir produto do carrinho.');
    }
}

// Função para mostrar o input de quantidade
function mostrarInputQuantidade(produtoId) {
    document.getElementById(`quantidade-${produtoId}`).classList.add('d-none');  // Oculta o texto de quantidade atual
    document.getElementById(`input-quantidade-${produtoId}`).classList.remove('d-none');  // Mostra o input
}

async function salvarQuantidade(produtoId) {
    const novaQuantidade = parseInt(document.getElementById(`input-quantidade-num-${produtoId}`).value); // Converte o valor para número inteiro

    if (novaQuantidade < 1) {
        alert("A quantidade deve ser maior que 0.");
        return;
    }

    try {
        const response = await fetch(`/api/produtos-pedidos/${produtoId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantidade: novaQuantidade })
        });

        if (response.ok) {
            
            
            document.getElementById(`quantidade-${produtoId}`).textContent = novaQuantidade;
            document.getElementById(`input-quantidade-${produtoId}`).classList.add('d-none');
            document.getElementById(`quantidade-${produtoId}`).classList.remove('d-none');
        } else {
            const errorData = await response.json();
            alert(`Erro ao atualizar quantidade: ${errorData.error}`);
        }
    } catch (error) {
        console.error("Erro ao salvar a quantidade:", error);
        alert("Erro ao atualizar a quantidade.");
    }
}

async function finalizarCompra() {
    const idCliente = 1; // ID do cliente (pegue isso dinamicamente no seu sistema)
    const carrinhoProdutos = [...document.querySelectorAll('.produto-card')].map(produtoCard => {
        const idProduto = produtoCard.getAttribute('data-id-produto');
        const quantidadeElement = document.getElementById(`quantidade-${idProduto}`);
        
        // Verifica se o elemento da quantidade existe antes de tentar acessar
        const quantidade = quantidadeElement ? parseInt(quantidadeElement.textContent) : 0; // Se não encontrar, assume 0
        
        return {
            idProduto,
            quantidade
        };
    });

    try {
        const response = await fetch('/api/finalizar-compra', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idCliente, carrinhoProdutos })
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Compra finalizada:', data);

            // Exibir modal de sucesso
            const modal = new bootstrap.Modal(document.getElementById('finalizadoModal'));
            modal.show();
        } else {
            const errorData = await response.json();
            alert(`Erro ao finalizar a compra: ${errorData.error}`);
        }
    } catch (error) {
        console.error('Erro ao finalizar compra:', error);
        alert('Erro ao finalizar a compra.');
    }
}


// Carregar os produtos do carrinho ao carregar a página
document.addEventListener("DOMContentLoaded", carregarCarrinho);
