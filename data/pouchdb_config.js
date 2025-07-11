let db = new PouchDB('meu-site-streaming');

// Função para adicionar um filme
function adicionarFilme(filme) {
    db.post(filme).then(response => {
        console.log('Filme adicionado com sucesso', response);
    }).catch(error => {
        console.error('Erro ao adicionar filme', error);
    });
}
