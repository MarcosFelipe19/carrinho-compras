class Venda {
    constructor({id, valor, produtos, valorFrete, idCupom}){
        this.id = id
        this.produtos = produtos
        this.valor = valor
        this.valorFrete = valorFrete
        this.idCupom = idCupom
    }
}

module.exports = Venda