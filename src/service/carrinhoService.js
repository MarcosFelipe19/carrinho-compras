const RepositoryCarrinho = require('../repository/repositoryCarrinho')
const RepositoryProduto = require('../repository/repositoryProduto')
const {join} = require('path')
const produtoDataBase = join(__dirname, "../../", "database/produtos.json")

class ProdutosService{
    constructor({carrinho}){
        this.carrinhoRepository = new RepositoryCarrinho({file: carrinho})
    }

    async incrementaMaisUm(idProduto, idCarrinho){
        let carrinho = await this.carrinhoRepository.find(idCarrinho)
        
        if (!carrinho) {
            throw new Error(`Carrinho com ID ${idCarrinho} não encontrado.`)
         }

        const produtoExistente = carrinho.produtos.find(({ id }) => id === idProduto)

        if(produtoExistente){
            produtoExistente.qtd += 1
            return carrinho
        }
        return carrinho
    }

    async decrementaMaisUm(idProduto, idCarrinho){
        let carrinho = await this.carrinhoRepository.find(idCarrinho)
        
        if (!carrinho) {
            throw new Error(`Carrinho com ID ${idCarrinho} não encontrado.`)
         }

        const produtoExistente = carrinho.produtos.find(({ id }) => id === idProduto)

        if(produtoExistente){
            produtoExistente.qtd -= 1
            return carrinho
        }
        return carrinho
    }

    async adicionaNovoProduto(idProduto, idCarrinho){
        const carrinho = await this.incrementaMaisUm(idProduto, idCarrinho)

        if(carrinho.produtos.find(({id}) => id === idProduto)){
            return carrinho
        }

        const produtos = new RepositoryProduto({file: produtoDataBase})
    
        const produto = await produtos.find(idProduto)

        carrinho.produtos.push(produto)

        return carrinho
    }

}

module.exports = ProdutosService