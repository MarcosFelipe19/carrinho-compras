const { read } = require('fs')
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

        return content.find(({id}) => id === idCarrinho)
    }
}

module.exports = RepositoryCarrinho