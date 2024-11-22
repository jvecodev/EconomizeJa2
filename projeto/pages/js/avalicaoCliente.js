const stars = document.querySelectorAll('.stars input[type="radio"]');
    const thankYouMessage = document.getElementById('thankYouMessage');

    stars.forEach(star => {
      star.addEventListener('change', () => {
        thankYouMessage.style.display = 'block';
      });
    });

    function enviarSugestion(event) {
        event.preventDefault(); // Previne o comportamento padrão do formulário
    
        const sugestion = document.getElementById('sugestion').value;
    
        if (sugestion) {
            // Envia a sugestão para o backend
            fetch('/api/sugestoes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sugestion }), // Envia a sugestão no formato correto
            })
            .then(response => response.json())
            .then(data => {
                console.log('Sugestão enviada com sucesso:', data);
                alert('Sugestão enviada com sucesso!');
                document.getElementById('sugestion').value = ''; // Limpa o campo de sugestão
            })
            .catch(error => {
                console.error('Erro ao enviar a sugestão:', error);
                alert('Ocorreu um erro ao enviar a sugestão.');
            });
        } else {
            alert('Por favor, preencha o campo de sugestão.');
        }
    }
    