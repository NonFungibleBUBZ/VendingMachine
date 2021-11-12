const db = require('./db')
const metadataArray = require('./metadata/metadata_first_collection')
const  mintController  = require('./controllers/mintController')
const { cardanocliJs } = require( "../utils/cardano" );

let wallet = cardanocliJs.wallet('fake-wallet-0')

let create = async function () {
    console.log(wallet.balance())
}

try {
    create().then( () => {
        console.log('done')
    })
} catch (err) {
    console.log(err)
}
