const db = require('./db')
const metadataArray = require('./metadata/metadata_first_collection')
const  mintController  = require('./controllers/mintController')
const { cardanocliJs } = require( "../utils/cardano" );

let create = async function () {
    await db.update_collection('firstCollection')
}

try {
    create().then( () => {
        console.log('done')
    })
} catch (err) {
    console.log(err)
}
