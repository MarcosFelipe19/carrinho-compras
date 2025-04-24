const {join} = require('path')
const RepositoryCarrinho = require('../repository/repositoryCarrinho')

const VALOR_KM = 5
class CarrinhoService{
    constructor({carrinho}){
        this.carrinhoRepository = new RepositoryCarrinho({file: carrinho})
    }

    async incrementaMaisUm(idProduto, idCarrinho){
        let carrinho = await this.carrinhoRepository.find(idCarrinho)
        
        const produtoExistente = carrinho.produtos.find(({ id }) => id === idProduto)

        if(produtoExistente){
            produtoExistente.qtd += 1
            return carrinho
        }
        return carrinho
    }

    async decrementaMaisUm(idProduto, idCarrinho){
        let carrinho = await this.carrinhoRepository.find(idCarrinho)
        
        const produtoExistente = carrinho.produtos.find(({ id }) => id === idProduto)

        if(produtoExistente){
            if(produtoExistente.qtd === 1){
                return this.removeProduto(idProduto, idCarrinho)
            }
            produtoExistente.qtd -=1
        }
        return carrinho
    }

    async adicionaNovoProduto(idProduto, idCarrinho){
        const carrinho = await this.incrementaMaisUm(idProduto, idCarrinho)

        if(carrinho.produtos.find(({id}) => id === idProduto)){
            return carrinho
        }

        carrinho.produtos.push({id:idProduto, qtd: 1})

        return carrinho
    }

    async removeProduto(idProduto, idCarrinho){
        const carrinho = await this.carrinhoRepository.find(idCarrinho)

        carrinho.produtos =  carrinho.produtos.filter(produto => produto.id != idProduto)
        return carrinho
    }

    calculaFrete(qtdKM, valorCompra){
        if(valorCompra > 200){
            return 0
        }
        const valor = qtdKM * VALOR_KM

        return valor
    }

    verificaCupom(cupom){
        let data = new Date()
        let dataCupom = new Date(cupom.validade)
        data = data.toLocaleDateString('pt-BR')
        dataCupom = dataCupom.toLocaleDateString('pt-BR')

        return data <= dataCupom
    }
}

module.exports = CarrinhoService