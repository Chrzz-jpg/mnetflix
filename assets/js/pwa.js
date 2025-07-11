// PWA Manager para Meteflix
class PWAManager {
  constructor() {
    this.isOnline = navigator.onLine;
    this.updateOnlineStatus = this.updateOnlineStatus.bind(this);
    this.showInstallPrompt = this.showInstallPrompt.bind(this);
    this.deferredPrompt = null;
    this.init();
  }

  async init() {
    // Registrar Service Worker
    await this.registerServiceWorker();
    
    // Configurar listeners
    this.setupEventListeners();
    
    // Verificar se pode instalar
    this.checkInstallability();
    
    // Verificar conectividade
    this.updateOnlineStatus();
  }

  async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registrado:', registration);
        
        // Verificar atualizações
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              this.showUpdateNotification();
            }
          });
        });
        
        return registration;
      } catch (error) {
        console.error('Erro ao registrar Service Worker:', error);
      }
    }
  }

  setupEventListeners() {
    // Listener para conectividade
    window.addEventListener('online', this.updateOnlineStatus);
    window.addEventListener('offline', this.updateOnlineStatus);
    
    // Listener para instalação
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.showInstallButton();
    });
    
    // Listener para app instalado
    window.addEventListener('appinstalled', () => {
      console.log('PWA instalada com sucesso!');
      this.hideInstallButton();
      this.deferredPrompt = null;
    });
  }

  updateOnlineStatus() {
    this.isOnline = navigator.onLine;
    const statusElement = document.getElementById('onlineStatus');
    
    if (statusElement) {
      if (this.isOnline) {
        statusElement.textContent = '🟢 Online';
        statusElement.style.color = '#28a745';
      } else {
        statusElement.textContent = '🔴 Offline';
        statusElement.style.color = '#dc3545';
        this.showOfflineMessage();
      }
    }
  }

  showOfflineMessage() {
    // Criar banner de offline se não existir
    if (!document.getElementById('offlineBanner')) {
      const banner = document.createElement('div');
      banner.id = 'offlineBanner';
      banner.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: #dc3545;
        color: white;
        text-align: center;
        padding: 8px;
        z-index: 9999;
        font-size: 0.9em;
      `;
      banner.textContent = '🔴 Você está offline. Algumas funcionalidades podem não estar disponíveis.';
      document.body.appendChild(banner);
    }
  }

  hideOfflineMessage() {
    const banner = document.getElementById('offlineBanner');
    if (banner) {
      banner.remove();
    }
  }

  showInstallButton() {
    // Criar botão de instalação se não existir
    if (!document.getElementById('installButton')) {
      const button = document.createElement('button');
      button.id = 'installButton';
      button.innerHTML = '📱 Instalar App';
      button.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(45deg, #667eea, #764ba2);
        color: white;
        border: none;
        padding: 12px 20px;
        border-radius: 25px;
        cursor: pointer;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        font-weight: bold;
        transition: transform 0.2s;
      `;
      
      button.addEventListener('click', this.showInstallPrompt);
      button.addEventListener('mouseenter', () => {
        button.style.transform = 'scale(1.05)';
      });
      button.addEventListener('mouseleave', () => {
        button.style.transform = 'scale(1)';
      });
      
      document.body.appendChild(button);
    }
  }

  hideInstallButton() {
    const button = document.getElementById('installButton');
    if (button) {
      button.remove();
    }
  }

  async showInstallPrompt() {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;
      console.log('Resultado da instalação:', outcome);
      this.deferredPrompt = null;
      this.hideInstallButton();
    }
  }

  showUpdateNotification() {
    // Criar notificação de atualização
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #667eea;
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      z-index: 1000;
      box-shadow: 0 4px 15px rgba(0,0,0,0.3);
      max-width: 300px;
    `;
    
    notification.innerHTML = `
      <div style="margin-bottom: 10px; font-weight: bold;">🔄 Nova versão disponível!</div>
      <div style="margin-bottom: 15px; font-size: 0.9em;">Uma nova versão do Meteflix está disponível.</div>
      <button onclick="this.parentElement.remove(); location.reload();" style="
        background: white;
        color: #667eea;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
      ">Atualizar</button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remover após 10 segundos
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 10000);
  }

  checkInstallability() {
    // Verificar se a PWA pode ser instalada
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInstalled = window.navigator.standalone || isStandalone;
    
    if (isInstalled) {
      console.log('PWA já está instalada');
      this.hideInstallButton();
    }
  }

  // Método para solicitar permissão de notificação
  async requestNotificationPermission() {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      console.log('Permissão de notificação:', permission);
      return permission;
    }
    return 'denied';
  }

  // Método para enviar notificação local
  showNotification(title, options = {}) {
    if ('Notification' in window && Notification.permission === 'granted') {
      const defaultOptions = {
        icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyIiBoZWlnaHQ9IjE5MiIgdmlld0JveD0iMCAwIDE5MiAxOTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxOTIiIGhlaWdodD0iMTkyIiByeD0iMjQiIGZpbGw9InVybCgjZ3JhZGllbnQpIi8+Cjx0ZXh0IHg9Ijk2IiB5PSIxMTIiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSI4MCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7wn5K8PC90ZXh0Pgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJncmFkaWVudCIgeDE9IjAiIHkxPSIwIiB4Mj0iMTkyIiB5Mj0iMTkyIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM2NjdlZWE7c3RvcC1vcGFjaXR5OjEiIC8+CjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6Izc2NGJhMjtzdG9wLW9wYWNpdHk6MSIgLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4K',
        badge: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzIiIGhlaWdodD0iNzIiIHZpZXdCb3g9IjAgMCA3MiA3MiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjcyIiBoZWlnaHQ9IjcyIiByeD0iOSIgZmlsbD0idXJsKCNncmFkaWVudCkiLz4KPHRleHQgeD0iMzYiIHk9IjQyIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMzAiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+8J+SvDwvdGV4dD4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQiIHgxPSIwIiB5MT0iMCIgeDI9IjcyIiB5Mj0iNzIiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzY2N2VlYTtzdG9wLW9wYWNpdHk6MSIgLz4KPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojNzY0YmEyO3N0b3Atb3BhY2l0eToxIiAvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPgo=',
        vibrate: [100, 50, 100],
        ...options
      };
      
      new Notification(title, defaultOptions);
    }
  }

  // Método para sincronizar dados em background
  async syncData() {
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      const registration = await navigator.serviceWorker.ready;
      await registration.sync.register('background-sync');
      console.log('Sincronização em background registrada');
    }
  }
}

// Inicializar PWA Manager quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  window.pwaManager = new PWAManager();
});

// Expor métodos globais
window.PWA = {
  showNotification: (title, options) => window.pwaManager?.showNotification(title, options),
  syncData: () => window.pwaManager?.syncData(),
  requestNotificationPermission: () => window.pwaManager?.requestNotificationPermission()
}; 