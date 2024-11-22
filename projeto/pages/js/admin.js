function redirecionar() {
    const selectedValue = document.getElementById('listaSelect').value;
    if (selectedValue !== "Escolha uma opção") {
        window.location.href = selectedValue;
    } else {
        alert("Por favor, selecione uma opção válida."); // 
    }
}