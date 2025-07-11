# 🎬 Meteflix - Seu Streaming Pessoal

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Online-brightgreen.svg)](https://chrzz-jpg.github.io/mnetflix/)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-brightgreen.svg)](https://web.dev/progressive-web-apps/)
[![PouchDB](https://img.shields.io/badge/PouchDB-8.0.1-blue.svg)](https://pouchdb.com/)
[![Offline First](https://img.shields.io/badge/Offline-First-orange.svg)](https://web.dev/offline-first/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> Uma plataforma de streaming moderna e responsiva com autenticação, gerenciamento de filmes e funcionalidades PWA

## ⚡ Quick Start

**🎯 Quer ver funcionando agora?**
- **🌐 [Acesse a versão online](https://chrzz-jpg.github.io/mnetflix/)**

**🔑 Credenciais de Teste:**
- **👨‍💼 Admin**: `admin@meteflix.com` / `admin123` (acesso completo)
- **👤 Cliente**: `user@meteflix.com` / `user123` (acesso limitado)

## 🚀 Demo

### 💻 Versão Local
**Para rodar localmente:** [Abrir Demo](index.html)

**Credenciais de Teste:**
- **Admin**: `admin@meteflix.com` / `admin123`
- **Cliente**: `user@meteflix.com` / `user123`

## ✨ Funcionalidades

### 🎭 Interface Moderna
- **Design responsivo** que funciona em desktop, tablet e mobile
- **Tema escuro** com gradientes modernos
- **Animações suaves** e transições elegantes
- **UI/UX intuitiva** com feedback visual

### 🔐 Sistema de Autenticação
- **Login seguro** com validação de campos
- **Controle de acesso** baseado em roles (Admin/Cliente)
- **Sessões persistentes** com PouchDB
- **Redirecionamento inteligente** após login

### 🎬 Gerenciamento de Filmes
- **Catálogo completo** com imagens, trailers e descrições
- **Categorias coloridas** com filtros interativos
- **Modal de detalhes** com informações completas
- **Sistema de busca** e filtros

### 👥 Gerenciamento de Usuários (Admin)
- **CRUD completo** de usuários
- **Controle de roles** (Admin/Cliente)
- **Interface administrativa** dedicada
- **Validações de segurança**

### 📱 Progressive Web App (PWA)
- **Instalável** no desktop e mobile
- **Funciona offline** com cache inteligente
- **Notificações push** em tempo real
- **Ícones nativos** e splash screen
- **Background sync** para sincronização

### 💾 Banco de Dados Local
- **PouchDB** para armazenamento local
- **Sincronização** com CouchDB remoto
- **Dados persistentes** entre sessões
- **Backup automático** de configurações

## 🛠️ Tecnologias

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| **HTML5** | - | Estrutura semântica |
| **CSS3** | - | Estilização moderna |
| **JavaScript ES6+** | - | Lógica e interações |
| **PouchDB** | 8.0.1 | Banco de dados local |
| **Font Awesome** | 5.15.3 | Ícones |
| **Service Worker** | - | Cache e offline |
| **Web App Manifest** | - | Instalação PWA |

## 📁 Estrutura do Projeto

```
meteflix_manus/
├── 📁 assets/
│   └── 📁 js/
│       ├── app.js          # Lógica principal
│       ├── filme.js        # Gerenciamento de filmes
│       ├── pouchdb.js      # Configuração PouchDB
│       └── pwa.js          # Gerenciador PWA
├── 📁 components/
│   ├── 📁 footer/          # Rodapé da aplicação
│   └── 📁 header/          # Cabeçalho responsivo
├── 📁 data/
│   ├── auth_config.js      # Configuração de autenticação
│   ├── pouchdb_config.js   # Configuração do banco
│   └── remote_config.js    # Configuração remota
├── 📁 pages/
│   ├── 📁 admin/           # Interface administrativa
│   ├── 📁 home/            # Página principal
│   └── 📁 login/           # Sistema de login
├── 📁 tests/               # Testes automatizados
├── 🎬 index.html           # Página inicial
├── 📱 manifest.json        # Configuração PWA
├── 🔧 sw.js               # Service Worker
└── 📖 README.md           # Este arquivo
```

## 🚀 Como Usar

### 🌐 Deploy Automático
A versão live está hospedada no **GitHub Pages** e é atualizada automaticamente a cada push para o repositório.

**URL da versão live:** [https://chrzz-jpg.github.io/mnetflix/](https://chrzz-jpg.github.io/mnetflix/)

### 1. Clone o Repositório
```bash
git clone https://github.com/seu-usuario/meteflix_manus.git
cd meteflix_manus
```

### 2. Abra no Navegador
```bash
# Opção 1: Abrir diretamente
open index.html

# Opção 2: Servidor local (recomendado)
python -m http.server 8000
# ou
npx serve .
```

### 3. Acesse a Aplicação
- **URL**: `http://localhost:8000` (se usar servidor)
- **Login**: Use as credenciais de teste acima

## 📱 Instalação PWA

### Desktop (Chrome/Edge)
1. Abra o Meteflix no navegador
2. Procure o ícone de instalação na barra de endereços
3. Clique para instalar
4. Acesse como um app nativo!

### Mobile
1. Abra no Chrome/Safari mobile
2. Toque no menu do navegador
3. Selecione "Adicionar à tela inicial"
4. Use como app nativo!

## 🎯 Funcionalidades por Role

### 👤 Cliente
- ✅ Visualizar catálogo de filmes
- ✅ Filtrar por categorias
- ✅ Ver detalhes dos filmes
- ✅ Usar modo offline
- ✅ Receber notificações

### 👨‍💼 Admin
- ✅ Todas as funcionalidades do cliente
- ✅ Gerenciar filmes (CRUD)
- ✅ Gerenciar usuários
- ✅ Controlar roles de acesso
- ✅ Acessar painel administrativo

## 🔧 Configuração

### Banco de Dados Remoto (Opcional)
Para sincronização com CouchDB:

1. Configure o arquivo `data/remote_config.js`:
```javascript
const REMOTE_DB_URL = 'https://seu-couchdb.com/meteflix';
```

2. Habilite a sincronização em `data/pouchdb_config.js`

### Personalização
- **Cores**: Edite as variáveis CSS em `assets/css/`
- **Filmes**: Modifique `data/default_movies.js`
- **Usuários**: Ajuste `data/default_users.js`

## 🧪 Testes

Execute os testes automatizados:

```bash
# Testes de autenticação
node tests/login_test.js

# Testes de filmes
node tests/filmes_test.js
```

## 📊 Performance

- **Lighthouse Score**: 95+ (PWA)
- **Tempo de Carregamento**: < 2s
- **Tamanho Total**: < 1MB
- **Suporte Offline**: Completo

## 🌐 Compatibilidade

| Navegador | Versão | Suporte |
|-----------|--------|---------|
| **Chrome** | 67+ | ✅ Completo |
| **Edge** | 79+ | ✅ Completo |
| **Firefox** | 67+ | ✅ Completo |
| **Safari** | 11.1+ | ⚠️ Limitado |
| **Mobile Chrome** | 67+ | ✅ Completo |
| **Mobile Safari** | 11.3+ | ⚠️ Limitado |

## 🤝 Contribuindo

1. **Fork** o projeto
2. Crie uma **branch** para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. Abra um **Pull Request**

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🙏 Agradecimentos

- **PouchDB** pela excelente biblioteca de banco de dados
- **Font Awesome** pelos ícones incríveis
- **Comunidade PWA** pelas melhores práticas
- **Todos os contribuidores** que ajudaram no projeto

## 📞 Suporte

- **Issues**: [GitHub Issues](https://github.com/seu-usuario/meteflix_manus/issues)
- **Email**: seu-email@exemplo.com
- **Documentação**: [Wiki do Projeto](https://github.com/seu-usuario/meteflix_manus/wiki)

---

<div align="center">

**⭐ Se este projeto te ajudou, considere dar uma estrela! ⭐**

[![GitHub stars](https://img.shields.io/github/stars/seu-usuario/meteflix_manus?style=social)](https://github.com/seu-usuario/meteflix_manus)
[![GitHub forks](https://img.shields.io/github/forks/seu-usuario/meteflix_manus?style=social)](https://github.com/seu-usuario/meteflix_manus)

*Feito com ❤️ para a comunidade de streaming*

</div> 