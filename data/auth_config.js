// Configuração de autenticação com PouchDB e sincronização remota
class AuthManager {
    constructor() {
        // Banco local para usuários
        this.usersDB = new PouchDB('meteflix-users');
        
        // Banco local para filmes (existente)
        this.moviesDB = new PouchDB('meu-site-streaming');
        
        // Configuração do servidor remoto (usando remote_config.js)
        const remoteURLs = getRemoteURLs();
        this.remoteUsersDB = remoteURLs.usersDB;
        this.remoteMoviesDB = remoteURLs.moviesDB;
        
        // Configurar sincronização automática
        this.setupSync();
        
        // Usuário atual logado
        this.currentUser = null;
        
        // Verificar se há usuário logado na sessão
        this.checkSession();
        
        // Inicializar dados padrão após um pequeno delay
        setTimeout(() => {
            this.initializeDefaultData();
        }, 1000);
    }
    
    // Configurar sincronização bidirecional com servidor remoto
    setupSync() {
        const syncOptions = getSyncOptions();
        
        // Sincronização de usuários
        if (this.remoteUsersDB) {
            this.usersDB.sync(this.remoteUsersDB, syncOptions).on('change', (info) => {
                console.log('Sincronização de usuários:', info);
            }).on('error', (err) => {
                console.error('Erro na sincronização de usuários:', err);
            });
        }
        
        // Sincronização de filmes
        if (this.remoteMoviesDB) {
            this.moviesDB.sync(this.remoteMoviesDB, syncOptions).on('change', (info) => {
                console.log('Sincronização de filmes:', info);
            }).on('error', (err) => {
                console.error('Erro na sincronização de filmes:', err);
            });
        }
    }
    
    // Registrar novo usuário
    async registerUser(email, password, name, isAdmin = false) {
        try {
            // Verificar se usuário já existe
            const existingUser = await this.findUserByEmail(email);
            if (existingUser) {
                throw new Error('Usuário já existe com este email');
            }
            
            // Hash da senha (em produção, use uma biblioteca como bcrypt)
            const hashedPassword = await this.hashPassword(password);
            
            // Criar documento do usuário
            const user = {
                _id: 'user_' + Date.now(),
                email: email,
                password: hashedPassword,
                name: name,
                isAdmin: isAdmin,
                createdAt: new Date().toISOString(),
                isActive: true
            };
            
            // Salvar no banco local
            const result = await this.usersDB.put(user);
            console.log('Usuário registrado com sucesso:', result);
            
            return { success: true, userId: result.id };
        } catch (error) {
            console.error('Erro ao registrar usuário:', error);
            return { success: false, error: error.message };
        }
    }
    
    // Fazer login
    async login(email, password) {
        try {
            // Buscar usuário por email
            const user = await this.findUserByEmail(email);
            if (!user) {
                throw new Error('Usuário não encontrado');
            }
            
            // Verificar senha
            const isValidPassword = await this.verifyPassword(password, user.password);
            if (!isValidPassword) {
                throw new Error('Senha incorreta');
            }
            
            // Salvar usuário na sessão
            this.currentUser = {
                id: user._id,
                email: user.email,
                name: user.name,
                isAdmin: user.isAdmin
            };
            
            // Salvar na sessão do navegador
            sessionStorage.setItem('meteflix_user', JSON.stringify(this.currentUser));
            
            console.log('Login realizado com sucesso:', this.currentUser);
            return { success: true, user: this.currentUser };
        } catch (error) {
            console.error('Erro no login:', error);
            return { success: false, error: error.message };
        }
    }
    
    // Fazer logout
    logout() {
        this.currentUser = null;
        sessionStorage.removeItem('meteflix_user');
        console.log('Logout realizado');
    }
    
    // Verificar se usuário está logado
    isLoggedIn() {
        return this.currentUser !== null;
    }
    
    // Obter usuário atual
    getCurrentUser() {
        return this.currentUser;
    }
    
    // Verificar sessão ao carregar página
    checkSession() {
        const savedUser = sessionStorage.getItem('meteflix_user');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            console.log('Sessão restaurada:', this.currentUser);
        }
    }
    
    // Buscar usuário por email
    async findUserByEmail(email) {
        try {
            const result = await this.usersDB.allDocs({
                include_docs: true,
                startkey: 'user_',
                endkey: 'user_\uffff'
            });
            
            const user = result.rows.find(row => row.doc.email === email);
            return user ? user.doc : null;
        } catch (error) {
            console.error('Erro ao buscar usuário:', error);
            return null;
        }
    }
    
    // Hash da senha (implementação simples - em produção use bcrypt)
    async hashPassword(password) {
        // Esta é uma implementação simples para demonstração
        // Em produção, use uma biblioteca como bcrypt
        const encoder = new TextEncoder();
        const data = encoder.encode(password + 'meteflix_salt');
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
    
    // Verificar senha
    async verifyPassword(password, hashedPassword) {
        const hashedInput = await this.hashPassword(password);
        return hashedInput === hashedPassword;
    }
    
    // Adicionar filme (função existente melhorada)
    async adicionarFilme(filme) {
        try {
            // Verificar se usuário está logado
            if (!this.isLoggedIn()) {
                throw new Error('Usuário deve estar logado para adicionar filmes');
            }
            
            // Adicionar informações do usuário ao filme
            filme.addedBy = this.currentUser.id;
            filme.addedAt = new Date().toISOString();
            
            const result = await this.moviesDB.post(filme);
            console.log('Filme adicionado com sucesso:', result);
            return { success: true, movieId: result.id };
        } catch (error) {
            console.error('Erro ao adicionar filme:', error);
            return { success: false, error: error.message };
        }
    }
    
    // Obter todos os filmes (visível para todos)
    async getMyMovies() {
        try {
            if (!this.isLoggedIn()) {
                return { success: false, error: 'Usuário não está logado' };
            }
            const result = await this.moviesDB.allDocs({
                include_docs: true
            });
            const allMovies = result.rows.map(row => row.doc);
            return { success: true, movies: allMovies };
        } catch (error) {
            console.error('Erro ao obter filmes:', error);
            return { success: false, error: error.message };
        }
    }
    
    // Obter todos os filmes (apenas para admins)
    async getAllMovies() {
        try {
            if (!this.isLoggedIn()) {
                return { success: false, error: 'Usuário não está logado' };
            }
            
            if (!this.currentUser.isAdmin) {
                return { success: false, error: 'Acesso negado. Apenas administradores podem ver todos os filmes.' };
            }
            
            const result = await this.moviesDB.allDocs({
                include_docs: true
            });
            
            const movies = result.rows.map(row => row.doc);
            
            return { success: true, movies: movies };
        } catch (error) {
            console.error('Erro ao obter todos os filmes:', error);
            return { success: false, error: error.message };
        }
    }
    
    // Verificar se usuário é admin
    isAdmin() {
        return this.currentUser && this.currentUser.isAdmin === true;
    }
    
            // Inicializar dados padrão
        async initializeDefaultData() {
            try {
                // Aguardar um pouco para garantir que o banco está pronto
                await new Promise(resolve => setTimeout(resolve, 1000));
                // Verificar se já existem usuários
                const existingUsers = await this.usersDB.allDocs({
                    include_docs: true,
                    startkey: 'user_',
                    endkey: 'user_\uffff'
                });
                // Importar usuários padrão de users/default.json, se existir
                let importedUsers = [];
                try {
                    const response = await fetch('../../users/default.json');
                    if (response.ok) {
                        importedUsers = await response.json();
                    }
                } catch (err) {
                    console.warn('Não foi possível importar users/default.json:', err);
                }
                // Para cada usuário do JSON, criar se não existir
                for (const userData of importedUsers) {
                    const alreadyExists = existingUsers.rows.some(row => row.doc.email === userData.email);
                    if (!alreadyExists) {
                        try {
                            const hashedPassword = await this.hashPassword(userData.password);
                            const user = {
                                _id: 'user_' + Date.now() + Math.random(),
                                email: userData.email,
                                password: hashedPassword,
                                name: userData.name,
                                isAdmin: !!userData.isAdmin,
                                createdAt: userData.createdAt || new Date().toISOString(),
                                isActive: userData.isActive !== false
                            };
                            await this.usersDB.put(user);
                            console.log(`✅ Usuário importado/criado: ${userData.name} (${userData.email})`);
                        } catch (userError) {
                            console.error(`❌ Erro ao criar usuário ${userData.email}:`, userError);
                        }
                    }
                }
                // Garantir admin padrão se não existir (caso não esteja no JSON)
                const adminEmail = "admin@meteflix.com";
                const adminUser = existingUsers.rows.find(row => row.doc.email === adminEmail) || importedUsers.find(u => u.email === adminEmail);
                if (!adminUser) {
                    const hashedPassword = await this.hashPassword("admin123");
                    const user = {
                        _id: 'user_' + Date.now() + Math.random(),
                        email: adminEmail,
                        password: hashedPassword,
                        name: "Administrador",
                        isAdmin: true,
                        createdAt: new Date().toISOString(),
                        isActive: true
                    };
                    await this.usersDB.put(user);
                    console.log(`✅ Admin padrão criado (${adminEmail})`);
                }
                // Se não há usuários, criar também o cliente demo (caso não esteja no JSON)
                if (existingUsers.rows.length === 0 && !importedUsers.some(u => u.email === "cliente@meteflix.com")) {
                    const hashedPassword = await this.hashPassword("cliente123");
                    const user = {
                        _id: 'user_' + Date.now() + Math.random(),
                        email: "cliente@meteflix.com",
                        password: hashedPassword,
                        name: "Cliente Demo",
                        isAdmin: false,
                        createdAt: new Date().toISOString(),
                        isActive: true
                    };
                    await this.usersDB.put(user);
                    console.log(`✅ Cliente demo criado (cliente@meteflix.com)`);
                }
                // Criar filmes padrão também (apenas se não houver usuários, como antes)
                if (existingUsers.rows.length === 0) {
                    await this.initializeDefaultMovies();
                }
            } catch (error) {
                console.error('❌ Erro ao inicializar dados padrão:', error);
            }
        }
    
    // Inicializar filmes padrão
    async initializeDefaultMovies() {
        try {
            // Verificar se já existem filmes
            const existingMovies = await this.moviesDB.allDocs({
                include_docs: true
            });
            // Importar filmes padrão de movies/default.json, se existir
            let importedMovies = [];
            try {
                const response = await fetch('../../movies/default.json');
                if (response.ok) {
                    importedMovies = await response.json();
                }
            } catch (err) {
                console.warn('Não foi possível importar movies/default.json:', err);
            }
            // Para cada filme do JSON, criar se não existir (baseado em título e ano)
            for (const movieData of importedMovies) {
                const alreadyExists = existingMovies.rows.some(row => row.doc.title === movieData.title && row.doc.year === movieData.year);
                if (!alreadyExists) {
                    try {
                        const movie = {
                            title: movieData.title,
                            genre: movieData.genre,
                            year: movieData.year,
                            description: movieData.description,
                            thumb: movieData.thumb || '',
                            trailer: movieData.trailer || '',
                            addedBy: movieData.addedBy || 'admin@meteflix.com',
                            addedAt: movieData.addedAt || new Date().toISOString()
                        };
                        await this.moviesDB.post(movie);
                        console.log(`✅ Filme importado/criado: ${movieData.title}`);
                    } catch (movieError) {
                        console.error(`❌ Erro ao criar filme ${movieData.title}:`, movieError);
                    }
                }
            }
            // Se não há filmes e não foi possível importar, criar exemplos hardcoded
            if (existingMovies.rows.length === 0 && importedMovies.length === 0) {
                const defaultMovies = [
                    {
                        title: "Vingadores: Ultimato",
                        genre: "Ação",
                        year: "2019",
                        description: "Os Vingadores se reúnem mais uma vez para desfazer as ações de Thanos e restaurar o equilíbrio do universo.",
                        thumb: "https://upload.wikimedia.org/wikipedia/pt/9/9b/Avengers_Endgame.jpg",
                        trailer: "https://www.youtube.com/watch?v=TcMBFSGVi1c",
                        addedBy: "admin@meteflix.com",
                        addedAt: "2024-01-01T00:00:00.000Z"
                    },
                    {
                        title: "Interestelar",
                        genre: "Ficção Científica",
                        year: "2014",
                        description: "Uma equipe de exploradores viaja através de um buraco de minhoca no espaço na tentativa de garantir a sobrevivência da humanidade.",
                        thumb: "https://upload.wikimedia.org/wikipedia/pt/3/3a/Interstellar_Filme.png",
                        trailer: "https://www.youtube.com/watch?v=zSWdZVtXT7E",
                        addedBy: "admin@meteflix.com",
                        addedAt: "2024-01-01T00:00:00.000Z"
                    },
                    {
                        title: "O Poderoso Chefão",
                        genre: "Drama",
                        year: "1972",
                        description: "A história da família Corleone, uma das cinco famílias da máfia de Nova York.",
                        thumb: "https://upload.wikimedia.org/wikipedia/pt/0/0c/Godfather_poster.png",
                        trailer: "https://www.youtube.com/watch?v=sY1S34973zA",
                        addedBy: "admin@meteflix.com",
                        addedAt: "2024-01-01T00:00:00.000Z"
                    }
                ];
                for (const movieData of defaultMovies) {
                    try {
                        await this.moviesDB.post(movieData);
                        console.log(`✅ Filme padrão criado: ${movieData.title}`);
                    } catch (movieError) {
                        console.error(`❌ Erro ao criar filme padrão ${movieData.title}:`, movieError);
                    }
                }
                console.log('🎉 Meteflix: Filmes padrão criados com sucesso!');
            }
        } catch (error) {
            console.error('❌ Erro ao inicializar filmes padrão:', error);
        }
    }

    // Atualizar filme
    async updateMovie(movie) {
        try {
            if (!this.isLoggedIn()) {
                return { success: false, error: 'Usuário não está logado' };
            }
            if (!this.currentUser.isAdmin) {
                return { success: false, error: 'Apenas administradores podem editar filmes.' };
            }
            // Buscar filme atual
            const existing = await this.moviesDB.get(movie._id);
            // Atualizar campos
            const updated = { ...existing, ...movie };
            const result = await this.moviesDB.put(updated);
            return { success: true, movieId: result.id };
        } catch (error) {
            console.error('Erro ao atualizar filme:', error);
            return { success: false, error: error.message };
        }
    }

    // Excluir filme
    async deleteMovie(id) {
        try {
            if (!this.isLoggedIn()) {
                return { success: false, error: 'Usuário não está logado' };
            }
            if (!this.currentUser.isAdmin) {
                return { success: false, error: 'Apenas administradores podem excluir filmes.' };
            }
            const movie = await this.moviesDB.get(id);
            const result = await this.moviesDB.remove(movie);
            return { success: true };
        } catch (error) {
            console.error('Erro ao excluir filme:', error);
            return { success: false, error: error.message };
        }
    }

    // Atualizar perfil do usuário logado
    async updateProfile({ name, email, password, photo }) {
        try {
            if (!this.isLoggedIn()) {
                return { success: false, error: 'Usuário não está logado' };
            }
            // Buscar usuário atual
            const userDoc = await this.usersDB.get(this.currentUser.id);
            // Verificar se o email está mudando e se já existe
            if (email && email !== userDoc.email) {
                const existing = await this.findUserByEmail(email);
                if (existing && existing._id !== userDoc._id) {
                    return { success: false, error: 'Já existe um usuário com este email.' };
                }
                userDoc.email = email;
            }
            if (name) userDoc.name = name;
            if (photo) userDoc.photo = photo;
            if (password) {
                userDoc.password = await this.hashPassword(password);
            }
            const result = await this.usersDB.put(userDoc);
            // Atualizar sessão
            this.currentUser.name = userDoc.name;
            this.currentUser.email = userDoc.email;
            if (photo) this.currentUser.photo = photo;
            sessionStorage.setItem('meteflix_user', JSON.stringify(this.currentUser));
            return { success: true };
        } catch (error) {
            console.error('Erro ao atualizar perfil:', error);
            return { success: false, error: error.message };
        }
    }

    // Listar todos os usuários (apenas admin)
    async getAllUsers() {
        try {
            if (!this.isLoggedIn() || !this.currentUser.isAdmin) {
                return { success: false, error: 'Apenas administradores podem listar usuários.' };
            }
            const result = await this.usersDB.allDocs({ include_docs: true, startkey: 'user_', endkey: 'user_\uffff' });
            const users = result.rows.map(row => {
                const { password, ...user } = row.doc; // não expor senha
                return user;
            });
            return { success: true, users };
        } catch (error) {
            console.error('Erro ao listar usuários:', error);
            return { success: false, error: error.message };
        }
    }
    // Buscar usuário por ID
    async getUserById(id) {
        try {
            if (!this.isLoggedIn() || !this.currentUser.isAdmin) {
                throw new Error('Apenas administradores podem buscar usuários.');
            }
            const user = await this.usersDB.get(id);
            const { password, ...userData } = user;
            return userData;
        } catch (error) {
            console.error('Erro ao buscar usuário:', error);
            return null;
        }
    }
    // Criar novo usuário
    async createUser({ name, email, password, isAdmin }) {
        try {
            if (!this.isLoggedIn() || !this.currentUser.isAdmin) {
                return { success: false, error: 'Apenas administradores podem criar usuários.' };
            }
            if (!name || !email || !password) {
                return { success: false, error: 'Preencha todos os campos obrigatórios.' };
            }
            const existing = await this.findUserByEmail(email);
            if (existing) {
                return { success: false, error: 'Já existe um usuário com este email.' };
            }
            const hashedPassword = await this.hashPassword(password);
            const user = {
                _id: 'user_' + Date.now() + Math.random(),
                name,
                email,
                password: hashedPassword,
                isAdmin: !!isAdmin,
                createdAt: new Date().toISOString(),
                isActive: true
            };
            await this.usersDB.put(user);
            return { success: true };
        } catch (error) {
            console.error('Erro ao criar usuário:', error);
            return { success: false, error: error.message };
        }
    }
    // Atualizar usuário
    async updateUser({ _id, name, email, password, isAdmin }) {
        try {
            if (!this.isLoggedIn() || !this.currentUser.isAdmin) {
                return { success: false, error: 'Apenas administradores podem editar usuários.' };
            }
            const user = await this.usersDB.get(_id);
            if (email && email !== user.email) {
                const existing = await this.findUserByEmail(email);
                if (existing && existing._id !== user._id) {
                    return { success: false, error: 'Já existe um usuário com este email.' };
                }
                user.email = email;
            }
            if (name) user.name = name;
            if (typeof isAdmin === 'boolean' || isAdmin === true || isAdmin === false) user.isAdmin = !!isAdmin;
            if (password) user.password = await this.hashPassword(password);
            await this.usersDB.put(user);
            return { success: true };
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            return { success: false, error: error.message };
        }
    }
    // Excluir usuário
    async deleteUser(id) {
        try {
            if (!this.isLoggedIn() || !this.currentUser.isAdmin) {
                return { success: false, error: 'Apenas administradores podem excluir usuários.' };
            }
            const user = await this.usersDB.get(id);
            await this.usersDB.remove(user);
            return { success: true };
        } catch (error) {
            console.error('Erro ao excluir usuário:', error);
            return { success: false, error: error.message };
        }
    }
}

// Instância global do gerenciador de autenticação
const authManager = new AuthManager();

