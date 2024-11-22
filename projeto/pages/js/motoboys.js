function carregarMotoboysNoCarrossel() {
    fetch('/api/motoboys') // Endpoint para pegar os motoboys cadastrados
      .then((response) => response.json())
      .then((motoboys) => {
        const carouselContent = document.getElementById('motoboyCarouselContent');
        carouselContent.innerHTML = '';
  
        // URLs das imagens
        const imagens = [
          'images/img-motoboy.jpg', // Imagem 1
          'images/motoboy2.jpg', // Imagem 2
          'images/motoboy3.jpg'  // Imagem 3
        ];
  
        motoboys.forEach((motoboy, index) => {
          const isActive = index === 0 ? 'active' : ''; // Primeira posição ativa no carrossel
          const imagem = imagens[index % imagens.length]; // Escolher imagem cíclica
  
          const motoboyCard = `
            <div class="carousel-item ${isActive}">
              <div class="motoboy-card">
                <img src="${imagem}" alt="Imagem do Motoboy" class="motoboy-img mb-3"> 
                <h5>${motoboy.Nome || 'Nome não disponível'}</h5>
                <p><strong>Email:</strong> ${motoboy.Email || 'Não informado'}</p>
                <p><strong>Telefone:</strong> ${motoboy.Telefone || 'Não informado'}</p>
                <p><strong>Placa da Moto:</strong> ${motoboy.Placa || 'Não informada'}</p> <!-- Placa exibida -->
              </div>
            </div>
          `;
          carouselContent.innerHTML += motoboyCard;
        });
      })
      .catch((error) => {
        console.error('Erro ao carregar motoboys:', error);
      });
  }
  
  // Função para mostrar o modal de notificação
  document.getElementById('notificarBtn').addEventListener('click', () => {
  });
  
  // Carregar os motoboys no carrossel quando a página carregar
  window.onload = carregarMotoboysNoCarrossel;
  