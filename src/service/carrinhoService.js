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

    async adicionaNovoProduto(produto, idCarrinho){
        const carrinho = await this.incrementaMaisUm(produto.id, idCarrinho)

        if(carrinho.produtos.find(({id}) => id === produto.id)){
            return carrinho
        }

        carrinho.produtos.push({id:produto.id,valorProduto: produto.preco, qtd: 1})

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
        let data = new Date().toISOString().split("T")[0]
        let dataCupom = new Date(cupom.validade).toISOString().split("T")[0]
       
        return data <= dataCupom
    }

    async valorTotalCompra(carrinho, qtdKM, cupom = null){
        let valorProdutos = 0
        let valorFrete = 0

        for (const element of carrinho.produtos) {
            valorProdutos += element.valorProduto * element.qtd
        }
        
        if(cupom){
            const cunpomValido = this.verificaCupom(cupom)
            if(cunpomValido) valorProdutos -= (cupom.desconto * valorProdutos / 100)
        }

        valorFrete = this.calculaFrete(qtdKM, valorProdutos)

        let valorCompra = valorFrete + valorProdutos

        return valorCompra
    }
}

module.exports = CarrinhoService