const RepositoryProduto = require('../repository/repositoryProduto')

class ProdutosService{
    constructor({produtos}){
        this.produtosRepository = new RepositoryProduto({file: produtos})
    }
    
    async verificaProdutoDisponivel(idProduto){
        const produto = await this.produtosRepository.find(idProduto)

        if(!produto){
            throw new Error(`Produto com o ID ${idProduto} não encontrado`)
        }
        return produto
    }
}

module.exports = ProdutosService