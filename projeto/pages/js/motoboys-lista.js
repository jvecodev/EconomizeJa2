document.addEventListener('DOMContentLoaded', function () {
    carregarMotoboys();
});

function carregarMotoboys() {
    fetch('/api/motoboys') // Certifique-se de que a URL da API está correta
        .then((response) => response.json())
        .then((motoboys) => {
            const carouselContainer = document.getElementById('carousel-motoboys-items');
            carouselContainer.innerHTML = '';  // Limpar o carrossel antes de adicionar os novos dados

            if (motoboys.length === 0) {
                carouselContainer.innerHTML = '<div class="alert alert-info">Nenhum motoboy cadastrado.</div>';
                return;
            }

            motoboys.forEach((motoboy, index) => {
                const isActive = index === 0 ? 'active' : '';  // Definir o primeiro item como ativo
                const cardHTML = `
                    <div class="carousel-item ${isActive}">
                        <div class="card">
                            <img src="${motoboy.imagem || 'https://via.placeholder.com/150'}" class="card-img-top" alt="Imagem do Motoboy">
                            <div class="card-body">
                                <h5 class="card-title">${motoboy.nome || 'Nome não disponível'}</h5>
                                <p class="card-text"><strong>Email:</strong> ${motoboy.email || 'Não disponível'}</p>
                                <p class="card-text"><strong>CPF:</strong> ${motoboy.cpf || 'Não disponível'}</p>
                                <p class="card-text"><strong>Placa:</strong> ${motoboy.placa || 'Não disponível'}</p>
                                <p class="card-text"><strong>CNH:</strong> ${motoboy.cnh || 'Não disponível'}</p>
                                <p class="card-text"><strong>Telefone:</strong> ${motoboy.telefone || 'Não disponível'}</p>
                                <button class="btn btn-warning btn-sm" onclick="editarMotoboy('${motoboy.ID_motboy}')">Editar</button>
                                <button class="btn btn-danger btn-sm" onclick="excluirMotoboy('${motoboy.ID_motboy}')">Excluir</button>
                            </div>
                        </div>
                    </div>
                `;
                carouselContainer.innerHTML += cardHTML;
            });

            // Certifique-se de inicializar o carrossel corretamente
            let carouselElement = new bootstrap.Carousel(document.getElementById('carousel-motoboys'));
            carouselElement.dispose();  // Para evitar múltiplas instâncias
            carouselElement = new bootstrap.Carousel(document.getElementById('carousel-motoboys'));  // Reinicia o carrossel
        })
        .catch((error) => {
            console.error('Erro ao carregar motoboys:', error);
            alert('Erro ao carregar os motoboys.');
        });
}