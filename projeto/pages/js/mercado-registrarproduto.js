function adicionarAoCarrinho(produtoId) {
    fetch('/api/produtos-pedidos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ produtoId, quantidade: 1 })
    })
    .then(response => {
        if (response.ok) {
            alert('Produto adicionado ao carrinho!');
        } else {
            return response.json().then(data => {
                alert(`Erro: ${data.error}`);
            });
        }
    })
    .catch(error => {
        console.error('Erro ao adicionar produto ao carrinho:', error);
        alert('Erro ao adicionar produto ao carrinho.');
    });
}

// Função para carregar os produtos
async function carregarProdutosMercado() {
    try {
        const response = await fetch('/api/produtos'); // Rota que retorna os produtos cadastrados
        const produtos = await response.json();

        const produtosContainer = document.getElementById("produtosContainer");
        produtosContainer.innerHTML = "";

        if (produtos.length === 0) {
            produtosContainer.innerHTML = "<p class='alert alert-warning'>Nenhum produto disponível.</p>";
            return;
        }

        produtos.forEach(produto => {
            const produtoCard = `
                <div class="col-md-4">
                    <div class="card mb-4">
                        <img src="${produto.Imagem}" class="card-img-top" alt="${produto.Nome}" style="height: 400px; object-fit: cover;">
                        <div class="card-body">
                            <h5 class="card-title">${produto.Nome}</h5>
                            <p class="card-text">${produto.Descricao}</p>
                            <p class="card-text"><strong>R$ ${produto.Preco.toFixed(2)}</strong></p>
                            <button class="btn btn-success" onclick="adicionarAoCarrinho(${produto.ID_Produtos})">Adicionar ao Carrinho</button>
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

// Carregar os produtos ao iniciar a página Mercado
document.addEventListener('DOMContentLoaded', carregarProdutosMercado);
