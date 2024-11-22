// Função para alterar o campo de entrada com base no tipo de usuário selecionado
function alterarInput() {
  const tipoUsuario = document.getElementById('tipoUsuario').value;
  const inputContainer = document.getElementById('inputCpfCnpj');

  if (tipoUsuario === 'estabelecimento') {
    inputContainer.innerHTML = `
      <label for="cnpj" class="form-label">CNPJ</label>
      <input type="text" id="cnpj" name="cnpj" class="form-control" required>
    `;
  } else {
    inputContainer.innerHTML = `
      <label for="cpf" class="form-label">CPF</label>
      <input type="text" id="cpf" name="cpf" class="form-control" required>
    `;
  }
}

// Função para gerenciar o login
async function realizarLogin(event) {
  event.preventDefault();

  // Coleta os valores dos campos
  const tipoUsuario = document.getElementById('tipoUsuario').value;
  const cpf = tipoUsuario !== 'estabelecimento' ? document.getElementById('cpf')?.value.trim() : null;
  const cnpj = tipoUsuario === 'estabelecimento' ? document.getElementById('cnpj')?.value.trim() : null;
  const senha = document.getElementById('senha').value;

  // Verificação de campos obrigatórios
  if (!tipoUsuario || (!cpf && !cnpj) || !senha) {
    document.getElementById('campoObrigatorio').style.display = 'block';
    return;
  }
  document.getElementById('campoObrigatorio').style.display = 'none';

  const endpoint =
    tipoUsuario === 'usuario' ? '/api/login/usuario' :
    tipoUsuario === 'motoboy' ? '/api/login/motoboy' :
    '/api/login/estabelecimentos';  

  try {
    const body = tipoUsuario === 'estabelecimento' ? { cnpj, senha } : { cpf, senha };
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao fazer login.');
    }

    const data = await response.json();
    console.log('Login bem-sucedido:', data);

  
    if (tipoUsuario === 'motoboy' && data.nome) {
      localStorage.setItem('motoboyNome', data.nome); 
    }

 
    const redirectionMap = {
      'usuario': 'home-logado.html',
      'motoboy': 'homeEntregador.html',
      'estabelecimento': 'homeEstabelecimento.html'
    };

    const storageKey = `${tipoUsuario}Logado`;
    localStorage.setItem(storageKey, JSON.stringify(data));

   
    window.location.href = redirectionMap[tipoUsuario];

  } catch (error) {
    console.error('Erro:', error.message);
    alert('Erro ao tentar realizar login. Tente novamente.');
  }
}


document.getElementById('form-login').addEventListener('submit', realizarLogin);
