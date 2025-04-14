const RepositoryCarrinho = require('../repository/repositoryCarrinho')
const RepositoryProduto = require('../repository/repositoryProduto')
const {join} = require('path')
const produtoDataBase = join(__dirname, "../../", "database/produtos.json")

class ProdutosService{
    constructor({carrinho}){
        this.carrinhoRepository = new RepositoryCarrinho({file: carrinho})
    }
    async estaNoCarrinho(idProduto, idCarrinho){
        const carrinho = await this.carrinhoRepository.find(idCarrinho)

        const contem = carrinho.produtos.find(({ids}) => ids === idProduto)

        if(contem){
            return true
        }
        return false
    }
    async incrementaMaisUm(idProduto, idCarrinho){
        const contem = await this.estaNoCarrinho(idProduto, idCarrinho)
        console.log(contem)
        let carrinho = await this.carrinhoRepository.find(idCarrinho)

        if(contem){
            carrinho.produtos = carrinho.produtos.map((produto) => {
                if(produto.ids === idProduto){
                    produto.qtd = produto.qtd + 1
                }
                return produto
            })
            return carrinho
        }
        return false
    }

    async adicionaNovoProduto(idProduto, idCarrinho){
        const contem = await this.incrementaMaisUm(idProduto, idCarrinho)

        if(contem){
            return contem
        }
        const produtos = new RepositoryProduto({file: produtoDataBase})
        const carrinho = await this.carrinhoRepository.find(idCarrinho)
    
        const produto = await produtos.find(idProduto)

        carrinho.produtos =  [...carrinho.produtos, produto]

        return carrinho
    }
}

module.exports = ProdutosService