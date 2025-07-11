

// Login simplificado - apenas autenticação
// Verificar se authManager está disponível
if (typeof authManager === 'undefined') {
    console.error('AuthManager não está disponível. Verifique se auth_config.js foi carregado corretamente.');
    alert('Erro: Sistema de autenticação não carregado. Recarregue a página.');
}

document.addEventListener('DOMContentLoaded', function() {
    // Selecionar o formulário de login
    const loginForm = document.getElementById("loginForm");
    
    if (!loginForm) {
        console.error('Formulário de login não encontrado');
        return;
    }

    // Seletores dos campos
    const emailInput = loginForm.querySelector("#loginEmail");
    const passwordInput = loginForm.querySelector("#loginPassword");
    const submitBtn = loginForm.querySelector("button[type='submit']");

    // Configurar evento de submit
    loginForm.onsubmit = async (e) => {
        e.preventDefault();
        
        // Validações básicas
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        
        if (!email) {
            showMessage("Email é obrigatório", "error");
            return;
        }
        
        if (!password) {
            showMessage("Senha é obrigatória", "error");
            return;
        }
        
        // Validar formato do email
        const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
        if (!email.match(emailPattern)) {
            showMessage("Digite um email válido", "error");
            return;
        }
        
        // Processar login
        await processLogin(email, password);
    };

    // Processar login
    async function processLogin(email, password) {
        // Verificar se authManager está disponível
        if (typeof authManager === 'undefined') {
            showMessage("Erro: Sistema de autenticação não carregado. Recarregue a página.", "error");
            return;
        }
        
        try {
            // Desabilitar botão durante processamento
            submitBtn.disabled = true;
            submitBtn.textContent = "Entrando...";
            
            const result = await authManager.login(email, password);
            
            if (result.success) {
                showMessage("Login realizado com sucesso! Redirecionando...", "success");
                
                // Verificar se há redirecionamento salvo
                setTimeout(() => {
                    if (window.authInterceptor) {
                        window.authInterceptor.checkRedirectAfterLogin();
                    } else {
                        window.location.href = "../home/index.html"; // Redirecionar para página principal
                    }
                }, 1500);
                return;
            } else {
                // Se chegou aqui, houve erro
                showMessage(result.error || "Email ou senha incorretos", "error");
            }
            
        } catch (error) {
            console.error("Erro na autenticação:", error);
            showMessage("Erro interno. Tente novamente.", "error");
        } finally {
            // Reabilitar botão
            submitBtn.disabled = false;
            submitBtn.textContent = "Entrar";
        }
    }

    // Mostrar mensagens para o usuário
    function showMessage(message, type = "info") {
        // Remover mensagem anterior se existir
        const existingMessage = document.querySelector(".auth-message");
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Criar nova mensagem
        const messageDiv = document.createElement("div");
        messageDiv.className = `auth-message ${type}`;
        messageDiv.textContent = message;
        
        // Estilos da mensagem
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 15px 25px;
            border-radius: 5px;
            color: white;
            font-weight: bold;
            z-index: 1000;
            max-width: 400px;
            text-align: center;
            ${type === 'success' ? 'background-color: #4CAF50;' : ''}
            ${type === 'error' ? 'background-color: #f44336;' : ''}
            ${type === 'info' ? 'background-color: #2196F3;' : ''}
        `;
        
        // Adicionar ao DOM
        document.body.appendChild(messageDiv);
        
        // Remover automaticamente após 5 segundos
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }

    // Focar no campo de email ao carregar
    emailInput.focus();
});



