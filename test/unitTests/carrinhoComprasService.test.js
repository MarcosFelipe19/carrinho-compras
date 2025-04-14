const {describe, before, beforeEach, afterEach} = require('mocha')
const {join} = require('path')
const ProdutosService = require('../../src/service/ProdutosService')
const CarrinhoService = require('../../src/service/carrinhoService')
const {expect} = require('chai')
const sinon = require('sinon')

const produtoDataBase = join(__dirname, "../../", "database/produtos.json")
const carrinhoDataBase = join(__dirname, "../../", "database/carrinho.json")

const mocks = {
    validProduto: require('../mocks/valid-produto.json'),
    validVenda: require('../mocks/valid-venda.json'),
    validCupom: require('../mocks/valid-cupom.json'),
    validFrete: require('../mocks/valid-frete.json'),
    validCarrinho: require('../mocks/valid-carrinho.json')
}
describe('Suite Test Carrinho de compras', ()=>{
    let produtosService = {}
    let carrinhoService = {}
    let sandbox = {}
    
    before(()=>{
        produtosService = new ProdutosService({produtos: produtoDataBase})
        carrinhoService = new CarrinhoService({carrinho: carrinhoDataBase})
    })

    beforeEach(()=>{
        sandbox = sinon.createSandbox()
    })

    afterEach(()=>{
        sandbox.restore()
    })

    it("verifica se o produto 'x' está disponível e  então retorna o produto 'x'", async ()=>{
        const produto = mocks.validProduto
        const idProduto = produto.id

        sandbox.stub(
            produtosService.produtosRepository,
            produtosService.produtosRepository.find.name
        ).resolves(produto)

        const expected = produto
        const result = await produtosService.verificaProdutoDisponivel(idProduto)
        


        expect(produtosService.produtosRepository.find.calledOnce).to.be.ok
        expect(produtosService.produtosRepository.find.calledWithExactly(produto.id)).to.be.ok
        expect(result).to.be.deep.equal(expected)
    })

    it("verifica se o produto 'x' já foi adicionado ao carrinho  se sim, retorna true", async ()=>{
        const produto = mocks.validProduto
        const carrinho = Object.create(mocks.validCarrinho)
        
        carrinho.produtos = [{ids: produto.id, qtd: 1}]

        sandbox.stub(
            carrinhoService.carrinhoRepository,
            carrinhoService.carrinhoRepository.find.name
        ).resolves(carrinho)

        const result = await carrinhoService.estaNoCarrinho(produto.id, carrinho.id)

        expect(carrinhoService.carrinhoRepository.find.calledWithExactly(carrinho.id)).to.be.ok
        expect(carrinhoService.carrinhoRepository.find.calledOnce).to.be.ok
        expect(result).to.be.ok

    })
    it("se o produto já estã no carrinho, então incremente mais 1.", async ()=>{
        const produto = mocks.validProduto
        const carrinho = Object.create(mocks.validCarrinho)
        carrinho.produtos = [{ids: produto.id, qtd: 1}]

        sandbox.stub(
            carrinhoService,
            carrinhoService.estaNoCarrinho.name
        ).returns(true)

        sandbox.stub(
            carrinhoService.carrinhoRepository,
            carrinhoService.carrinhoRepository.find.name
        ).resolves(carrinho)

        const expected = 2
        const result = await carrinhoService.incrementaMaisUm(produto.id, carrinho.id)

        expect(carrinhoService.estaNoCarrinho.calledWithExactly(produto.id, carrinho.id)).to.be.ok
        expect(carrinhoService.estaNoCarrinho.calledOnce).to.be.ok
        expect(carrinhoService.carrinhoRepository.find.calledWithExactly(carrinho.id)).to.be.ok
        expect(carrinhoService.carrinhoRepository.find.calledOnce).to.be.ok
        expect(result.produtos[0].qtd).to.be.equal(expected)
    } )

    it("deve adicionar um novo produto", async ()=>{
        const produto = mocks.validProduto
        const carrinho = Object.create(mocks.validCarrinho)
        carrinho.produtos = []

        sandbox.stub(
            carrinhoService.carrinhoRepository,
            carrinhoService.carrinhoRepository.find.name
        ).resolves(carrinho)

        sandbox.stub(
            carrinhoService,
            carrinhoService.estaNoCarrinho.name
        ).returns(false)

        const result = await carrinhoService.adicionaNovoProduto(produto.id, carrinho.id)
        const expected = produto

        expect(carrinhoService.estaNoCarrinho.calledWithExactly(produto.id, carrinho.id)).to.be.ok
        expect(carrinhoService.estaNoCarrinho.calledOnce).to.be.ok
        expect(carrinhoService.carrinhoRepository.find.calledWithExactly(carrinho.id)).to.be.ok
        expect(carrinhoService.carrinhoRepository.find.callCount).to.be.equal(2)
        expect(result.produtos[0]).to.be.deep.equal(expected)

    })
})