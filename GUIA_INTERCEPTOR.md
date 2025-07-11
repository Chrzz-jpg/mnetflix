# 🔒 Guia do Interceptor de Autenticação - Meteflix

## 📋 O que é o Interceptor?

O **AuthInterceptor** é um sistema que automaticamente verifica se o usuário está logado e redireciona para a página de login quando necessário. Ele funciona como um "guardião" que protege páginas que requerem autenticação.

## 🚀 Como Funciona

### 1. **Verificação Automática**
- Quando uma página carrega, o interceptor verifica se o usuário está logado
- Se não estiver logado e a página for protegida, redireciona para login
- Se estiver logado e tentar acessar página de login, redireciona para página principal

### 2. **Interceptação de Navegação**
- Intercepta cliques em links para páginas protegidas
- Intercepta navegação programática (history.pushState)
- Previne acesso não autorizado

### 3. **Redirecionamento Inteligente**
- Salva a página que o usuário tentou acessar
- Após login bem-sucedido, redireciona de volta para a página original

## 📁 Arquivos Criados

```
meteflix/
├── data/
│   └── auth_interceptor.js          # Sistema principal do interceptor
├── pages/
│   ├── admin/
│   │   └── protected_page.html      # Exemplo de página protegida
│   └── login/
│       └── index_enhanced.html      # Página de login (já existia)
└── index.html                       # Página principal (modificada)
```

## 🔧 Como Usar

### 1. **Incluir o Interceptor em uma Página**

```html
<!DOCTYPE html>
<html>
<head>
    <!-- PouchDB -->
    <script src="https://cdn.jsdelivr.net/npm/pouchdb@8.0.1/dist/pouchdb.min.js"></script>
    
    <!-- Configuração remota -->
    <script src="data/remote_config.js"></script>
    
    <!-- Configuração de autenticação -->
    <script src="data/auth_config.js"></script>
    
    <!-- Interceptor de autenticação -->
    <script src="data/auth_interceptor.js"></script>
</head>
<body>
    <!-- Conteúdo da página -->
</body>
</html>
```

### 2. **Configurar Páginas Protegidas**

O interceptor já vem configurado com algumas páginas protegidas:

```javascript
// Páginas que precisam de autenticação
protectedPages = [
    '/pages/admin/',
    '/index.html'
];

// Páginas que não precisam de autenticação
publicPages = [
    '/pages/login/index.html',
    '/pages/login/index_enhanced.html',
    '/pages/login/test_login.html',
    '/pages/login/debug_login.html',
    '/demo_auth.html'
];
```

### 3. **Personalizar Configuração**

Para adicionar ou remover páginas protegidas, edite o arquivo `data/auth_interceptor.js`:

```javascript
class AuthInterceptor {
    constructor() {
        // Adicionar suas páginas protegidas aqui
        this.protectedPages = [
            '/pages/admin/',
            '/index.html',
            '/minha-pagina-protegida.html'  // ← Nova página
        ];
        
        // Adicionar páginas públicas aqui
        this.publicPages = [
            '/pages/login/index_enhanced.html',
            '/pagina-publica.html'  // ← Nova página
        ];
    }
}
```

## 🧪 Testando o Interceptor

### 1. **Teste Básico**
1. Acesse `http://localhost:8000/pages/admin/protected_page.html` sem estar logado
2. Você será redirecionado automaticamente para a página de login
3. Faça login
4. Você será redirecionado de volta para a página administrativa

### 2. **Teste de Navegação**
1. Faça login na página principal
2. Clique em links para páginas protegidas
3. O interceptor deve permitir o acesso
4. Faça logout
5. Tente acessar as mesmas páginas
6. Você deve ser redirecionado para login

### 3. **Teste de Redirecionamento**
1. Tente acessar uma página protegida sem estar logado
2. Faça login
3. Verifique se foi redirecionado para a página original

## 🎯 Funcionalidades do Interceptor

### ✅ **Verificação Automática**
- Verifica autenticação ao carregar página
- Verifica autenticação ao navegar
- Verifica autenticação em mudanças de URL

### ✅ **Mensagens Informativas**
- Mostra mensagens quando redireciona
- Explica por que o redirecionamento aconteceu
- Mensagens temporárias que desaparecem automaticamente

### ✅ **Botão de Logout Automático**
- Adiciona botão de logout em páginas protegidas
- Posicionamento inteligente (procura por containers)
- Estilo consistente

### ✅ **Redirecionamento Inteligente**
- Salva URL original antes de redirecionar
- Restaura URL após login bem-sucedido
- Funciona com navegação normal e programática

### ✅ **Configuração Flexível**
- Fácil de configurar páginas protegidas
- Fácil de configurar páginas públicas
- Configuração centralizada

## 🔍 Debug e Logs

O interceptor adiciona logs no console para facilitar o debug:

```javascript
// Exemplo de logs que você verá:
AuthInterceptor: {
    currentPath: "/pages/admin/protected_page.html",
    isPublicPage: false,
    isProtectedPage: true,
    isLoggedIn: false
}
```

## 🛠️ Personalização Avançada

### 1. **Mudar URL de Login**
```javascript
// Em auth_interceptor.js
this.loginUrl = '/minha-pagina-de-login.html';
```

### 2. **Adicionar Verificações Customizadas**
```javascript
// Em sua página
window.addEventListener('load', () => {
    if (window.authInterceptor) {
        // Suas verificações customizadas aqui
        console.log('Interceptor disponível');
    }
});
```

### 3. **Personalizar Mensagens**
```javascript
// Em auth_interceptor.js, método showMessage
showMessage('Sua mensagem customizada', 'warning');
```

## 🚨 Solução de Problemas

### **Problema: Interceptor não funciona**
**Solução:**
1. Verifique se todos os scripts estão carregados na ordem correta
2. Verifique o console do navegador para erros
3. Certifique-se de que `authManager` está disponível

### **Problema: Redirecionamento infinito**
**Solução:**
1. Verifique se a página de login não está na lista de páginas protegidas
2. Verifique se não há conflitos de configuração

### **Problema: Botão de logout não aparece**
**Solução:**
1. Verifique se o usuário está realmente logado
2. Verifique se há elementos container na página
3. Aguarde um pouco mais (o botão é adicionado com delay)

## 📝 Exemplo Completo

Aqui está um exemplo completo de uma página protegida:

```html
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Minha Página Protegida</title>
    
    <!-- Scripts necessários -->
    <script src="https://cdn.jsdelivr.net/npm/pouchdb@8.0.1/dist/pouchdb.min.js"></script>
    <script src="data/remote_config.js"></script>
    <script src="data/auth_config.js"></script>
    <script src="data/auth_interceptor.js"></script>
</head>
<body>
    <div class="container">
        <h1>Minha Página Protegida</h1>
        <p>Esta página só pode ser acessada por usuários logados.</p>
        
        <!-- O interceptor adicionará automaticamente o botão de logout aqui -->
        
        <div id="userInfo">
            <!-- Informações do usuário serão exibidas aqui -->
        </div>
    </div>
    
    <script>
        // Seu código JavaScript aqui
        // O interceptor já está funcionando automaticamente
    </script>
</body>
</html>
```

## 🎉 Conclusão

O **AuthInterceptor** é uma solução completa e elegante para proteger páginas que requerem autenticação. Ele funciona automaticamente e é fácil de configurar e personalizar.

**Principais benefícios:**
- ✅ Proteção automática de páginas
- ✅ Redirecionamento inteligente
- ✅ Interface de usuário consistente
- ✅ Fácil de configurar
- ✅ Logs para debug
- ✅ Funciona com navegação normal e programática

Agora você tem um sistema completo de autenticação com interceptor funcionando no seu projeto Meteflix! 🚀 