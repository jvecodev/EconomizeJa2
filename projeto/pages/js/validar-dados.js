
  
  function validarPadraoSenha(event) {
    const senha = event.target.value;
    const senhaMinLength = 8;
    const senhaMaxLength = 16;
    const senhaRegex = /^(?=.*[A-Z])(?=.*[\W_])/; // Pelo menos uma letra maiúscula e um caractere especial
  
    const alertasUsuario = document.getElementById('alertas-usuario');
    const alertasMotoboy = document.getElementById('alertas-motoboy');
    const alertasRestaurante = document.getElementById('alertas-restaurante');
  
    const alertasMap = {
      'usuario': alertasUsuario,
      'motoboy': alertasMotoboy,
      'restaurante': alertasRestaurante
    };
  
    let alertas;
    if (event.target.id.includes('usuario')) {
      alertas = alertasMap['usuario'];
    } else if (event.target.id.includes('motoboy')) {
      alertas = alertasMap['motoboy'];
    } else if (event.target.id.includes('restaurante')) {
      alertas = alertasMap['restaurante'];
    }
  
    if (senha.length < senhaMinLength || senha.length > senhaMaxLength) {
      alertas.querySelector('.labelValidacao#senhaTamanho-' + event.target.id.split('-')[1]).style.display = 'block';
    } else {
      alertas.querySelector('.labelValidacao#senhaTamanho-' + event.target.id.split('-')[1]).style.display = 'none';
    }
  
    if (!senhaRegex.test(senha)) {
      alertas.querySelector('.labelValidacao#senhaPadrao-' + event.target.id.split('-')[1]).style.display = 'block';
    } else {
      alertas.querySelector('.labelValidacao#senhaPadrao-' + event.target.id.split('-')[1]).style.display = 'none';
    }
  }
  
  function validarEmail(email) {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexEmail.test(email);
  }
  
  function validarTelefone(telefone) {
    const regexTelefone = /^\d{10,11}$/;
    return regexTelefone.test(telefone);
  }
  
  function validarCpf(cpf) {
    const regexCpf = /^\d{11}$/;
    return regexCpf.test(cpf);
  }
  
  function validarCnpj(cnpj) {
    const regexCnpj = /^\d{14}$/;
    return regexCnpj.test(cnpj);
  }