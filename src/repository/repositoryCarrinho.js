const {readFile} = require('fs/promises')
class RepositoryCarrinho {
    constructor({file}){
        this.file = file
    }

    async find(idCarrinho){
        const content = JSON.parse(await readFile(this.file))

        if(!idCarrinho){
            return content
        }


        const carrinho = content.find(({id}) => id === idCarrinho)

        if (!carrinho) {
            throw new Error(`Carrinho com ID ${idCarrinho} não encontrado.`)
         }

         return carrinho
    }
}

module.exports = RepositoryCarrinho