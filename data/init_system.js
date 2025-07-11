// Inicialização global do sistema Meteflix
// Este arquivo garante que os dados padrão sejam criados automaticamente

(function() {
    'use strict';
    
    // Função para inicializar o sistema
    async function initializeMeteflixSystem() {
        try {
            // Aguardar um pouco para garantir que o AuthManager está pronto
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Verificar se o AuthManager está disponível
            if (typeof authManager === 'undefined') {
                console.log('🔄 Meteflix: Aguardando AuthManager...');
                return;
            }
            
            // Inicializar dados padrão
            await authManager.initializeDefaultData();
            
        } catch (error) {
            console.error('❌ Erro na inicialização do sistema Meteflix:', error);
        }
    }
    
    // Inicializar quando o DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeMeteflixSystem);
    } else {
        // DOM já está pronto
        initializeMeteflixSystem();
    }
    
    // Também inicializar quando a janela carregar completamente
    window.addEventListener('load', () => {
        setTimeout(initializeMeteflixSystem, 500);
    });
    
})(); 