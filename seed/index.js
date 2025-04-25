const { faker } = require('@faker-js/faker');
const {join}  = require('path')
const {writeFile} = require('fs/promises')
const Produto = require('../src/entities/produto')
const Carrinho = require('../src/entities/carrinho')
const Cupom = require('../src/entities/cupom')

const seedDataBase = join(__dirname, "../database/")

const QTD_PRODUTOS = 3
const VALOR_KM = 5

const cupom = new Cupom({
    id:faker.string.ulid(),
    desconto: faker.number.int({ min: 10, max: 50 }),
    validade: faker.date.soon({ days: 10 }) 
})

let produtos = []
let produtosCarrinho = []
let valorprodutos = 0
for(index = 0; index < QTD_PRODUTOS; index++){
    const produto = new Produto({
        id: faker.string.ulid(),
        name: faker.commerce.product(),
        preco: faker.commerce.price({min: 100, max: 1000}),
        qtd: faker.number.int({ min: 0, max: 30 }) 
    })
    produtos.push(produto)
    
    produtosCarrinho.push({id: produto.id,valorProduto:produto.preco,  qtd: faker.number.int({min: 1, max: 100})})
}

const carrinho = new Carrinho({
    id: faker.string.ulid(),
    produtos: produtosCarrinho
})

const write = (fileName, data) => {writeFile(join(seedDataBase, fileName), JSON.stringify(data))}

;(async ()=>{
    await write("produtos.json", produtos)
    await write("cupom.json", [cupom])
    await write("carrinho.json", [carrinho])
})()
