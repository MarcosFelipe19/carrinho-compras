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
    it("o frete deve ser de 50 quando a quantidade de km for 10", () => {
        const qtdKM = 10

        const expected = 50
        const result = carrinhoService.calculaFrete(qtdKM, 150)

        expect(result).to.be.equal(expected)
    })
    it("deve retornar true se o cupom for válido", ()=>{
        const cupom = mocks.validCupom
        const data = new Date("2025-04-24")

        sandbox.useFakeTimers(data)

    
        const result = carrinhoService.verificaCupom(cupom)

        expect(result).to.be.ok
    })
    it("deve retornar 300 quando o valor do produto for 300 e não tem cupom", async ()=>{
        const produto =  mocks.validProduto
        const carrinho = Object.create(mocks.validCarrinho)
        const qtdKM = 5
        carrinho.produtos = [{id: produto.id, valorProduto: 300, qtd: 1}]

        sandbox.stub(
            carrinhoService,
            carrinhoService.calculaFrete.name
        ).returns(0)

        const expected = 300
        const result = await carrinhoService.valorTotalCompra(carrinho, qtdKM)

        expect(carrinhoService.calculaFrete.calledOnce).to.be.ok
        expect(result).to.be.equal(expected)
    })
    it("deve dar um desconto de 50 reais quando o valor da compra for 200 reais e o cupom for de 25%", async () =>{
        const produto =  mocks.validProduto
        const carrinho = Object.create(mocks.validCarrinho)
        const cupom = Object.create(mocks.validCupom)
        cupom.desconto = 25
        const qtdKM = 10
        carrinho.produtos = [{id: produto.id, valorProduto: 200, qtd: 1}]

        sandbox.stub(
            carrinhoService,
            carrinhoService.calculaFrete.name
        ).returns(0)

        sandbox.stub(
            carrinhoService,
            carrinhoService.verificaCupom.name
        ).returns(true)

        const expected = 150
        const result = await carrinhoService.valorTotalCompra(carrinho, qtdKM, cupom)

        expect(carrinhoService.calculaFrete.calledOnce).to.be.ok
        expect(carrinhoService.verificaCupom.calledOnce).to.be.ok
        expect(carrinhoService.verificaCupom.calledWithExactly(cupom)).to.be.ok
        expect(result).to.be.equal(expected)
    })
    it("deve retornar 100 quando o frete for 30 reais, o produto for 70 reais e não tiver cupom", async ()=>{
        const produto =  mocks.validProduto
        const carrinho = Object.create(mocks.validCarrinho)
        const qtdKM = 5
        carrinho.produtos = [{id: produto.id, valorProduto: 70, qtd: 1}]

        sandbox.stub(
            carrinhoService,
            carrinhoService.calculaFrete.name
        ).returns(30)

        const expected = 100
        const result = await carrinhoService.valorTotalCompra(carrinho, qtdKM)

        expect(carrinhoService.calculaFrete.calledOnce).to.be.ok
        expect(result).to.be.equal(expected)
    })
    it("deve retornar 260 quando tiver 5 unidades de um produto de 40 reais, o frete de 100 reais e um cupom de 20%", async () =>{
        const produto =  mocks.validProduto
        const carrinho = Object.create(mocks.validCarrinho)
        const cupom = Object.create(mocks.validCupom)
        cupom.desconto = 20
        const qtdKM = 20
        carrinho.produtos = [{id: produto.id, valorProduto: 40, qtd: 5}
            
        ]

        sandbox.stub(
            carrinhoService,
            carrinhoService.calculaFrete.name
        ).returns(100)

        sandbox.stub(
            carrinhoService,
            carrinhoService.verificaCupom.name
        ).returns(true)

        const expected = 260
        const result = await carrinhoService.valorTotalCompra(carrinho, qtdKM, cupom)

        expect(carrinhoService.calculaFrete.calledOnce).to.be.ok
        expect(carrinhoService.verificaCupom.calledOnce).to.be.ok
        expect(carrinhoService.verificaCupom.calledWithExactly(cupom)).to.be.ok
        expect(result).to.be.equal(expected)
    })
})