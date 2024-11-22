let historicoCorridas = [];
  
      
function adicionarCorrida(localizacao, destino, tempo) {
    const corrida = {
        localizacao: localizacao,
        destino: destino,
        tempo: tempo
    };
    historicoCorridas.push(corrida);
    localStorage.setItem("historicoCorridas", JSON.stringify(historicoCorridas)); // Salva no localStorage
}

// Função para exibir o histórico no modal
function exibirHistorico() {
    const listaHistorico = document.getElementById("historicoLista");
    listaHistorico.innerHTML = ""; // Limpa a lista antes de adicionar novos itens

    const corridas = JSON.parse(localStorage.getItem("historicoCorridas")) || [];

    corridas.forEach(function(corrida) {
        const li = document.createElement("li");
        li.textContent = `De ${corrida.localizacao} para ${corrida.destino} - ${corrida.tempo} minutos`;
        listaHistorico.appendChild(li);
    });
}

// Exibe o histórico quando o modal for aberto
$('#historicoModal').on('show.bs.modal', function () {
    exibirHistorico();
});

// Lógica para iniciar a corrida
document.getElementById('form-corrida').addEventListener('submit', function(event) {
    event.preventDefault();

    const localizacao = document.getElementById('localizacao').value;
    const destino = document.getElementById('destino').value;
    const tempo = document.getElementById('tempo').value;

    if (localizacao && destino && tempo) {
        // Exibe a mensagem de sucesso
        document.getElementById('mensagem').style.display = 'block';
        document.getElementById('mensagem').className = 'alert alert-success';
        document.getElementById('mensagem').textContent = `Corrida iniciada com sucesso! De ${localizacao} para ${destino}, estimada para ${tempo} minutos.`;

        // Adiciona a corrida ao histórico
        adicionarCorrida(localizacao, destino, tempo);

        // Exibe o botão para finalizar a corrida
        document.getElementById('finalizarCorrida').style.display = 'block';
        document.getElementById('cancelarCorrida').style.display = 'block';
    } else {
        // Exibe mensagem de erro
        document.getElementById('mensagem').style.display = 'block';
        document.getElementById('mensagem').className = 'alert alert-danger';
        document.getElementById('mensagem').textContent = 'Por favor, preencha todos os campos.';
    }
});

// Lógica para finalizar a corrida
document.querySelector('#finalizarCorrida button').addEventListener('click', function() {
    // Exibe mensagem de conclusão
    document.getElementById('mensagem').style.display = 'block';
    document.getElementById('mensagem').className = 'alert alert-info';
    document.getElementById('mensagem').textContent = 'Corrida finalizada com sucesso!';

    // Oculta os botões de finalizar e cancelar
    document.getElementById('finalizarCorrida').style.display = 'none';
    document.getElementById('cancelarCorrida').style.display = 'none';

    // Limpa os campos de entrada
    document.getElementById('localizacao').value = '';
    document.getElementById('destino').value = '';
    document.getElementById('tempo').value = '';
});

// Lógica para cancelar a corrida
document.querySelector('#cancelarCorrida button').addEventListener('click', function() {
    // Exibe mensagem de cancelamento
    document.getElementById('mensagem').style.display = 'block';
    document.getElementById('mensagem').className = 'alert alert-warning';
    document.getElementById('mensagem').textContent = 'Corrida cancelada.';

    // Oculta os botões de finalizar e cancelar
    document.getElementById('finalizarCorrida').style.display = 'none';
    document.getElementById('cancelarCorrida').style.display = 'none';

    // Limpa os campos de entrada
    document.getElementById('localizacao').value = '';
    document.getElementById('destino').value = '';
    document.getElementById('tempo').value = '';
});

// Inicialização do Mapa com Leaflet.js
const map = L.map('map').setView([51.505, -0.09], 13); // Posição inicial do mapa (pode ajustar para sua localização)

// Adiciona um Tile Layer do OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Marcador para a localização inicial
L.marker([51.505, -0.09]).addTo(map)
    .bindPopup('Você está aqui.')
    .openPopup();