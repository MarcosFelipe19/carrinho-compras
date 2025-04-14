const { read } = require('fs')
const {readFile} = require('fs/promises')
class RepositoryProduto {
    constructor({file}){
        this.file = file
    }

    async find(idProduto){
        const content = JSON.parse(await readFile(this.file))

        if(!idProduto){
            return content
        }

        return content.find(({id}) => id === idProduto)
    }
}

module.exports = RepositoryProduto