// Interceptor de autenticação para o Meteflix
// Este arquivo verifica se o usuário está logado e redireciona se necessário

class AuthInterceptor {
    constructor() {
        // Páginas que não precisam de autenticação
        this.publicPages = [
            '/index.html', // Página de redirecionamento
            '/pages/login/index.html',
            '/pages/login/index_enhanced.html',
            '/pages/login/test_login.html',
            '/pages/login/debug_login.html',
            '/demo_auth.html'
        ];
        
        // Páginas que precisam de autenticação
        this.protectedPages = [
            '/pages/admin/',
            '/pages/home/' // Página principal (nova localização)
        ];
        
        // URL da página de login
        this.loginUrl = '/pages/login/';
        
        // Inicializar o interceptor
        this.init();
    }
    
    // Inicializar o interceptor
    init() {
        // Aguardar o carregamento da página
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.checkAuth());
        } else {
            this.checkAuth();
        }
        
        // Interceptar navegação
        this.interceptNavigation();
        
        // Adicionar botão de logout se necessário
        this.addLogoutButton();
    }
    
    // Verificar autenticação
    checkAuth() {
        // Aguardar um pouco para garantir que authManager está carregado
        setTimeout(() => {
            if (typeof authManager === 'undefined') {
                console.warn('AuthManager não disponível, pulando verificação de auth');
                return;
            }
            
            const currentPath = window.location.pathname;
            const isPublicPage = this.isPublicPage(currentPath);
            const isProtectedPage = this.isProtectedPage(currentPath);
            const isLoggedIn = authManager.isLoggedIn();
            
            console.log('AuthInterceptor:', {
                currentPath,
                isPublicPage,
                isProtectedPage,
                isLoggedIn
            });
            
            // Se está em página protegida e não está logado
            if (isProtectedPage && !isLoggedIn) {
                console.log('Usuário não logado em página protegida, redirecionando...');
                this.redirectToLogin();
                return;
            }
            
            // Se está logado e tentando acessar página de login
            if (isLoggedIn && this.isLoginPage(currentPath)) {
                console.log('Usuário já logado, redirecionando para página principal...');
                this.redirectToMain();
                return;
            }
            
            // Se chegou aqui, tudo ok
            console.log('Verificação de autenticação concluída');
        }, 100);
    }
    
    // Verificar se é página pública
    isPublicPage(path) {
        return this.publicPages.some(publicPath => path.includes(publicPath));
    }
    
    // Verificar se é página protegida
    isProtectedPage(path) {
        return this.protectedPages.some(protectedPath => path.includes(protectedPath));
    }
    
    // Verificar se é página de login
    isLoginPage(path) {
        return path.includes('/pages/login/') && !path.includes('test_') && !path.includes('debug_');
    }
    
    // Redirecionar para login
    redirectToLogin() {
        // Salvar a página atual para redirecionar após login
        const currentUrl = window.location.href;
        sessionStorage.setItem('redirectAfterLogin', currentUrl);
        
        // Mostrar mensagem
        this.showMessage('Você precisa estar logado para acessar esta página', 'warning');
        
        // Redirecionar após um pequeno delay
        setTimeout(() => {
            window.location.href = this.loginUrl;
        }, 2000);
    }
    
    // Redirecionar para página principal
    redirectToMain() {
        this.showMessage('Você já está logado! Redirecionando...', 'info');
        
        setTimeout(() => {
            window.location.href = '/pages/home/index.html';
        }, 1500);
    }
    
    // Interceptar navegação
    interceptNavigation() {
        // Interceptar cliques em links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.href && !link.href.startsWith('javascript:')) {
                const url = new URL(link.href);
                const path = url.pathname;
                
                // Se é página protegida e não está logado
                if (this.isProtectedPage(path) && !this.isUserLoggedIn()) {
                    e.preventDefault();
                    this.redirectToLogin();
                }
            }
        });
        
        // Interceptar navegação programática
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;
        
        history.pushState = function(...args) {
            originalPushState.apply(history, args);
            // Verificar após mudança de estado
            setTimeout(() => {
                if (window.authInterceptor) {
                    window.authInterceptor.checkAuth();
                }
            }, 100);
        };
        
        history.replaceState = function(...args) {
            originalReplaceState.apply(history, args);
            setTimeout(() => {
                if (window.authInterceptor) {
                    window.authInterceptor.checkAuth();
                }
            }, 100);
        };
    }
    
    // Verificar se usuário está logado
    isUserLoggedIn() {
        return typeof authManager !== 'undefined' && authManager.isLoggedIn();
    }
    
    // Adicionar botão de logout
    addLogoutButton() {
        // Aguardar um pouco para garantir que authManager está carregado
        setTimeout(() => {
            if (typeof authManager === 'undefined') return;
            
            // Procurar por elementos onde adicionar o botão de logout
            const possibleContainers = [
                document.querySelector('header'),
                document.querySelector('.header'),
                document.querySelector('.navbar'),
                document.querySelector('.nav'),
                document.querySelector('.user-info'),
                document.querySelector('.container')
            ];
            
            const container = possibleContainers.find(el => el !== null);
            
            if (container && authManager.isLoggedIn()) {
                // Verificar se já existe botão de logout
                if (!document.querySelector('.logout-btn')) {
                    const logoutBtn = document.createElement('button');
                    logoutBtn.className = 'logout-btn';
                    logoutBtn.innerHTML = '🚪 Logout';
                    logoutBtn.style.cssText = `
                        position: absolute;
                        top: 10px;
                        right: 10px;
                        background: #dc3545;
                        color: white;
                        border: none;
                        padding: 8px 15px;
                        border-radius: 5px;
                        cursor: pointer;
                        font-size: 14px;
                        z-index: 1000;
                    `;
                    
                    logoutBtn.addEventListener('click', () => {
                        authManager.logout();
                        this.showMessage('Logout realizado com sucesso!', 'success');
                        setTimeout(() => {
                            window.location.href = this.loginUrl;
                        }, 1500);
                    });
                    
                    container.style.position = 'relative';
                    container.appendChild(logoutBtn);
                }
            }
        }, 500);
    }
    
    // Mostrar mensagem
    showMessage(message, type = 'info') {
        // Remover mensagem anterior se existir
        const existingMessage = document.querySelector('.auth-interceptor-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Criar nova mensagem
        const messageDiv = document.createElement('div');
        messageDiv.className = `auth-interceptor-message ${type}`;
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
            z-index: 10000;
            max-width: 400px;
            text-align: center;
            ${type === 'success' ? 'background-color: #28a745;' : ''}
            ${type === 'error' ? 'background-color: #dc3545;' : ''}
            ${type === 'warning' ? 'background-color: #ffc107; color: #212529;' : ''}
            ${type === 'info' ? 'background-color: #17a2b8;' : ''}
        `;
        
        document.body.appendChild(messageDiv);
        
        // Remover após 5 segundos
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }
    
    // Verificar redirecionamento após login
    checkRedirectAfterLogin() {
        const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
        if (redirectUrl && this.isUserLoggedIn()) {
            sessionStorage.removeItem('redirectAfterLogin');
            window.location.href = redirectUrl;
        }
    }
}

// Função para inicializar o interceptor
function initAuthInterceptor() {
    // Aguardar carregamento dos scripts necessários
    if (typeof authManager === 'undefined') {
        setTimeout(initAuthInterceptor, 100);
        return;
    }
    
    // Criar instância global do interceptor
    window.authInterceptor = new AuthInterceptor();
    
    console.log('AuthInterceptor inicializado');
}

// Inicializar quando a página carregar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuthInterceptor);
} else {
    initAuthInterceptor();
}

// Exportar para uso em outros scripts
window.AuthInterceptor = AuthInterceptor; 