// Configuração do servidor remoto CouchDB
// Este arquivo contém as configurações para sincronização com servidor remoto

const REMOTE_CONFIG = {
    // Configurações do servidor CouchDB
    // Substitua pelas configurações do seu servidor
    
    // Opção 1: Servidor CouchDB próprio
    // couchdb: {
    //     host: 'https://seu-servidor.com',
    //     port: 5984,
    //     username: 'admin',
    //     password: 'senha',
    //     usersDB: 'meteflix-users',
    //     moviesDB: 'meteflix-movies'
    // },
    
    // Opção 2: IBM Cloudant (gratuito até 1GB)
    // cloudant: {
    //     url: 'https://sua-conta.cloudantnosqldb.appdomain.cloud',
    //     apikey: 'sua-api-key',
    //     usersDB: 'meteflix-users',
    //     moviesDB: 'meteflix-movies'
    // },
    
    // Opção 3: Servidor local para desenvolvimento
    local: {
        host: 'http://localhost',
        port: 5984,
        usersDB: 'meteflix-users',
        moviesDB: 'meteflix-movies'
    },
    
    // Configuração ativa (altere conforme necessário)
    active: 'local', // 'local', 'couchdb', 'cloudant' ou null para apenas local
    
    // Configurações de sincronização
    sync: {
        live: true,        // Sincronização em tempo real
        retry: true,       // Tentar novamente em caso de erro
        heartbeat: 10000,  // Heartbeat em ms
        timeout: 30000     // Timeout em ms
    }
};

// Função para obter URLs de sincronização
function getRemoteURLs() {
    const config = REMOTE_CONFIG;
    
    if (!config.active || config.active === 'local') {
        // Apenas desenvolvimento local
        return {
            usersDB: null,
            moviesDB: null
        };
    }
    
    const activeConfig = config[config.active];
    
    if (config.active === 'couchdb') {
        const baseURL = `${activeConfig.host}:${activeConfig.port}`;
        return {
            usersDB: `${baseURL}/${activeConfig.usersDB}`,
            moviesDB: `${baseURL}/${activeConfig.moviesDB}`
        };
    }
    
    if (config.active === 'cloudant') {
        return {
            usersDB: `${activeConfig.url}/${activeConfig.usersDB}`,
            moviesDB: `${activeConfig.url}/${activeConfig.moviesDB}`
        };
    }
    
    return {
        usersDB: null,
        moviesDB: null
    };
}

// Função para obter opções de sincronização
function getSyncOptions() {
    const config = REMOTE_CONFIG;
    const activeConfig = config[config.active];
    
    let options = {
        live: config.sync.live,
        retry: config.sync.retry,
        heartbeat: config.sync.heartbeat,
        timeout: config.sync.timeout
    };
    
    // Adicionar autenticação se necessário
    if (config.active === 'couchdb' && activeConfig.username) {
        options.auth = {
            username: activeConfig.username,
            password: activeConfig.password
        };
    }
    
    if (config.active === 'cloudant' && activeConfig.apikey) {
        options.headers = {
            'Authorization': `Bearer ${activeConfig.apikey}`
        };
    }
    
    return options;
}

// Instruções para configuração
console.log(`
=== CONFIGURAÇÃO DO SERVIDOR REMOTO ===

Para usar sincronização com servidor remoto:

1. SERVIDOR COUCHDB PRÓPRIO:
   - Instale CouchDB em seu servidor
   - Configure CORS para permitir acesso do navegador
   - Altere REMOTE_CONFIG.active para 'couchdb'
   - Configure host, port, username e password

2. IBM CLOUDANT (GRATUITO):
   - Crie conta em https://cloud.ibm.com/catalog/services/cloudant
   - Obtenha URL e API key
   - Altere REMOTE_CONFIG.active para 'cloudant'
   - Configure url e apikey

3. DESENVOLVIMENTO LOCAL:
   - Instale CouchDB localmente
   - Execute: docker run -p 5984:5984 -e COUCHDB_USER=admin -e COUCHDB_PASSWORD=password couchdb
   - Mantenha REMOTE_CONFIG.active como 'local'

4. APENAS LOCAL (SEM SINCRONIZAÇÃO):
   - Altere REMOTE_CONFIG.active para null
   - Os dados ficarão apenas no navegador

Configuração atual: ${REMOTE_CONFIG.active || 'apenas local'}
`);

