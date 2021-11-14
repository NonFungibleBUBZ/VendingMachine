// don't mind this script i used it multiple times to do multiple tests
const db = require('./db')
const metadataArray = require('./metadata/metadata_first_collection')
const { cardanocliJs } = require( "../utils/cardano" );
const { fuseHandler } = require('../mint/controllers/autoMint')

let create = async function () {
    await fuseHandler()
}

try {
    create().then( () => {

    })
} catch (err) {
    console.log(err)
}
