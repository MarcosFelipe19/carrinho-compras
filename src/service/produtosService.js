const RepositoryProduto = require('../repository/repositoryProduto')

class ProdutosService{
    constructor({produtos}){
        this.produtosRepository = new RepositoryProduto({file: produtos})
    }
    
    async verificaProdutoDisponivel(idProduto){
        const produto = this.produtosRepository.find(idProduto)

        return produto
    }
}

module.exports = ProdutosService