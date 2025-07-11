# Como Testar a PWA do Meteflix

## 🚀 Testando a Instalação da PWA

### 1. Abrir no Navegador
- Abra o arquivo `index.html` no Chrome, Edge ou Firefox
- Ou use um servidor local (recomendado)

### 2. Verificar se é PWA
- Abra as **Ferramentas do Desenvolvedor** (F12)
- Vá para a aba **Application** (Chrome) ou **Manifest** (Firefox)
- Verifique se o manifest está sendo carregado corretamente

### 3. Testar Instalação
- **Chrome/Edge**: Procure pelo ícone de instalação na barra de endereços (ícone de download)
- **Firefox**: Clique no ícone de instalação na barra de endereços
- **Mobile**: Use o menu do navegador e selecione "Adicionar à tela inicial"

### 4. Verificar Service Worker
- Nas ferramentas do desenvolvedor, vá para **Application > Service Workers**
- Verifique se o service worker está registrado e ativo
- Teste o modo offline desconectando a internet

## 📱 Funcionalidades PWA

### ✅ O que deve funcionar:
- **Instalação**: App pode ser instalado no desktop/mobile
- **Offline**: Funciona sem internet (cache básico)
- **Notificações**: Sistema de notificações push
- **Ícones**: Ícones SVG embutidos (não precisa de arquivos externos)
- **Manifest**: Configuração completa do app

### 🔧 Como testar cada funcionalidade:

#### 1. Instalação
```javascript
// No console do navegador
if ('serviceWorker' in navigator) {
  console.log('✅ Service Worker suportado');
}
if ('BeforeInstallPromptEvent' in window) {
  console.log('✅ PWA pode ser instalada');
}
```

#### 2. Modo Offline
- Desconecte a internet
- Recarregue a página
- Deve funcionar com cache básico

#### 3. Notificações
- Faça login no app
- Permita notificações quando solicitado
- Teste enviando uma notificação:
```javascript
// No console
pwaManager.showNotification('Teste PWA', {body: 'Funcionando!'});
```

## 🐛 Solução de Problemas

### PWA não aparece para instalação:
1. Verifique se está usando HTTPS ou localhost
2. Confirme que o manifest.json está válido
3. Verifique se os ícones estão carregando
4. Aguarde alguns segundos (pode demorar)

### Service Worker não registra:
1. Verifique se o arquivo `sw.js` existe
2. Confirme que o caminho no registro está correto
3. Limpe o cache do navegador

### Notificações não funcionam:
1. Verifique permissões no navegador
2. Confirme se está usando HTTPS
3. Teste no console do navegador

## 📋 Checklist de Teste

- [ ] App carrega normalmente
- [ ] Manifest.json é detectado
- [ ] Service Worker registra sem erros
- [ ] Ícone de instalação aparece
- [ ] App instala corretamente
- [ ] Funciona offline (básico)
- [ ] Notificações funcionam
- [ ] Ícones aparecem corretamente
- [ ] App abre em janela separada quando instalado

## 🌐 Navegadores Suportados

- **Chrome**: 67+ ✅
- **Edge**: 79+ ✅
- **Firefox**: 67+ ✅
- **Safari**: 11.1+ ⚠️ (suporte limitado)
- **Mobile Chrome**: 67+ ✅
- **Mobile Safari**: 11.3+ ⚠️ (suporte limitado)

## 💡 Dicas

1. **Use HTTPS**: PWAs precisam de conexão segura
2. **Teste em mobile**: Melhor experiência PWA
3. **Limpe cache**: Se algo não funcionar, limpe o cache
4. **Console**: Sempre verifique o console para erros
5. **Lighthouse**: Use o Lighthouse para auditar a PWA

## 🔍 Auditoria com Lighthouse

1. Abra as ferramentas do desenvolvedor
2. Vá para a aba **Lighthouse**
3. Selecione **Progressive Web App**
4. Clique em **Generate report**
5. Verifique a pontuação PWA (deve ser 90+)

---

**Nota**: Esta PWA usa ícones SVG embutidos, então não precisa de arquivos de imagem externos. Isso torna a instalação mais rápida e confiável! 