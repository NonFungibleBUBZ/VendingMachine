const db = require('./db')

const metadataArray = require('./metadata/metadata_first_collection')

const  mintController  = require('./controllers/mintController')

let create = async function () {
    mintController.mintAsset(metadataArray[0], 25123456, 'addr_test1qru8huxjk8wna7aq8edp0w6dqkk7060jeruece5u233l8z27rh9l5kr8ewvl2xfm342dqnwkc4rdruzremf2v9yugysswrm7p4')
}

try {
    create().then( () => {
        console.log('done')
    })
} catch (err) {
    console.log(err)
}
