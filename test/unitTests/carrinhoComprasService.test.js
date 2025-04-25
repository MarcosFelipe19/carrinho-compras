const {describe, before, beforeEach, afterEach} = require('mocha')
const {join} = require('path')
const CarrinhoService = require('../../src/service/carrinhoService')
const chaiAsPromised = require('chai-as-promised')
const chai = require('chai')
chai.use(chaiAsPromised)
const {expect} = chai
const sinon = require('sinon')

const carrinhoDataBase = join(__dirname, "../../", "database/carrinho.json")

const mocks = {
    validProduto: require('../mocks/valid-produto.json'),
    validCupom: require('../mocks/valid-cupom.json'),
    validCarrinho: require('../mocks/valid-carrinho.json')
}
describe('Suite Test Carrinho de compras', ()=>{
    let produtosService = {}
    let carrinhoService = {}
    let sandbox = {}
    
    before(()=>{
        carrinhoService = new CarrinhoService({carrinho: carrinhoDataBase})
    })

    beforeEach(()=>{
        sandbox = sinon.createSandbox()
    })

    afterEach(()=>{
        sandbox.restore()
    })

    it("Deve incrementar 1 quando o produto já estiver no carrinho", async ()=>{
        const produto = mocks.validProduto
        const carrinho = Object.create(mocks.validCarrinho)
        carrinho.produtos = [{id: produto.id, valorProduto: produto.preco, qtd: 1}]

        sandbox.stub(
            carrinhoService.carrinhoRepository,
            carrinhoService.carrinhoRepository.find.name
        ).resolves(carrinho)

        const expected = 2
        const result = await carrinhoService.incrementaMaisUm(produto.id, carrinho.id)

        expect(carrinhoService.carrinhoRepository.find.calledWithExactly(carrinho.id)).to.be.ok
        expect(carrinhoService.carrinhoRepository.find.calledOnce).to.be.ok
        expect(result.produtos[0].qtd).to.be.equal(expected)
    } )
    it("Deve retornar um Error quando o ID do carrinho não for encontrado", async ()=>{
        const idCarrinho = 'fffsa555'

        const expected = `Carrinho com ID ${idCarrinho} não encontrado`
        const result = carrinhoService.carrinhoRepository.find(idCarrinho)

        await expect(result).to.be.rejectedWith(expected)
    } )
    it("Deve adicionar um novo produto quando o produto não estiver no carrinho", async ()=>{
        const produto = mocks.validProduto
        const carrinho = Object.create(mocks.validCarrinho)
        carrinho.produtos = []

        sandbox.stub(
            carrinhoService.carrinhoRepository,
            carrinhoService.carrinhoRepository.find.name
        ).resolves(carrinho)

        const result = await carrinhoService.adicionaNovoProduto(produto, carrinho.id)
        const expected = [{id: produto.id, valorProduto: produto.preco, qtd: 1}]

        expect(carrinhoService.carrinhoRepository.find.calledWithExactly(carrinho.id)).to.be.ok
        expect(carrinhoService.carrinhoRepository.find.calledOnce).to.be.ok
        expect(result.produtos).to.be.deep.equal(expected)

    })
    it("deve decrementar a quantidade de um produto quando tiver um produto no minimo", async () => {
        const produto = mocks.validProduto
        const carrinho = Object.create(mocks.validCarrinho)
        carrinho.produtos = [{id: produto.id, valorProduto: produto.preco, qtd: 2}]

        sandbox.stub(
            carrinhoService.carrinhoRepository,
            carrinhoService.carrinhoRepository.find.name
        ).resolves(carrinho)

        const expected = 1
        const result = await carrinhoService.decrementaMaisUm(produto.id, carrinho.id)

        expect(carrinhoService.carrinhoRepository.find.calledWithExactly(carrinho.id)).to.be.ok
        expect(carrinhoService.carrinhoRepository.find.calledOnce).to.be.ok
        expect(result.produtos[0].qtd).to.be.equal(expected)
    })
    it("deve remover um produto do carrinho quando o produto já estiver no carrinho", async ()=>{
        const produto = mocks.validProduto
        const carrinho = Object.create(mocks.validCarrinho)
        carrinho.produtos = [{id: produto.id, valorProduto: produto.preco, qtd: 1}]

        sandbox.stub(
            carrinhoService.carrinhoRepository,
            carrinhoService.carrinhoRepository.find.name
        ).resolves(carrinho)
       
        carrinho.produtos.shift()
        const expected  = carrinho
        const result = await carrinhoService.removeProduto(produto.id, carrinho.id)

        expect(carrinhoService.carrinhoRepository.find.calledWithExactly(carrinho.id)).to.be.ok
        expect(carrinhoService.carrinhoRepository.find.calledOnce).to.be.ok
        expect(result).to.be.deep.equal(expected)
    })
    it("deve remover o produto quando a quantidade for igual a 0", async ()=>{
        const produto = mocks.validProduto
        const carrinho = Object.create(mocks.validCarrinho)
        carrinho.produtos = [{id: produto.id, valorProduto: produto.preco, qtd: 1}]

        sandbox.stub(
            carrinhoService.carrinhoRepository,
            carrinhoService.carrinhoRepository.find.name
        ).resolves(carrinho)

        carrinho.produtos.shift()
        const expected = carrinho
        const result = await carrinhoService.decrementaMaisUm(produto.id, carrinho.id)

        expect(carrinhoService.carrinhoRepository.find.calledWithExactly(carrinho.id)).to.be.ok
        expect(carrinhoService.carrinhoRepository.find.calledOnce).to.be.ok
        expect(result).to.be.deep.equal(expected)
    })
    it("deve retornar o valor 100 quando a quantidade de km for igual a 20", () => {
        const qtdKM = 20

        const expected = 100
        const result = carrinhoService.calculaFrete(qtdKM, 0)

        expect(result).to.be.equal(expected)
    })
    it("o frete deve ser grátis quando o valor da compra for maior que 200.00", () => {
        const qtdKM = 20

        const expected = 0
        const result = carrinhoService.calculaFrete(qtdKM, 250)

        expect(result).to.be.equal(expected)
    })
    it("deve retornar true se o cupom for válido", ()=>{
        const cupom = mocks.validCupom
        const data = new Date("2025-04-24")

        sandbox.useFakeTimers(data)

    
        const result = carrinhoService.verificaCupom(cupom)

        expect(result).to.be.ok
    })
    it("deve retornar 200 quando quando o valor do produto for igual 150 e a quatidade de km for igual a 5", async ()=>{
        const produto =  mocks.validProduto
        const carrinho = Object.create(mocks.validCarrinho)
        const cupom = mocks.validCupom
        const qtdKM = 5
        carrinho.produtos = [{id: produto.id, valorProduto: produto.preco, qtd: 1}]

        sandbox.stub(
            carrinhoService,
            carrinhoService.verificaCupom.name
        ).returns(false)

        sandbox.stub(
            carrinhoService,
            carrinhoService.calculaFrete.name
        ).returns(50)

        const expected = 200
        const result = await carrinhoService.valorTotalCompra(produto, carrinho, cupom, qtdKM)

        expect(result).to.be.equal(expected)
    })
})