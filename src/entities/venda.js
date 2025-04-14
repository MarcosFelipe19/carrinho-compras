class Venda {
    constructor({id, valor, produtos, idFrete, idCupom}){
        this.id = id
        this.produtos = produtos
        this.valor = valor
        this.idFrete = idFrete
        this.idCupom = idCupom
    }
}

module.exports = Venda