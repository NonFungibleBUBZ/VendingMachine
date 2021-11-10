const db = require('./db')

const metadataArray = require('./metadata/metadata_first_collection')

const  mintController  = require('./controllers/mintController')

let create = async function () {
    mintController.mintAsset(metadataArray[0], 25123456, '')
}

try {
    create().then( () => {
        console.log('done')
    })
} catch (err) {
    console.log(err)
}
