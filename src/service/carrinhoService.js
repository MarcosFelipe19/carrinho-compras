const RepositoryCarrinho = require('../repository/repositoryCarrinho')

class ProdutosService{
    constructor({carrinho}){
        this.carrinhoRepository = new RepositoryCarrinho({file: carrinho})
    }
    async EstaNoCarrinho(idProduto, idCarrinho){
        const carrinho = await this.carrinhoRepository.find(idCarrinho)

        const contem = carrinho.produtos.find(({ids}) => ids === idProduto)

        if(contem){
            return true
        }
        return false
    }
}

module.exports = ProdutosService