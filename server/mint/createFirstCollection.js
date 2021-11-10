const db = require('./db')
const  metadataArray  = require('./metadata/metadata_first_collection')

let create = async function () {
    let firstCollection = {
        name:'firstCollection',
        allBubz: [],
        availableBubz: [],
        lastMinted: [],
        bubzInDispensary: []
        //TODO
    }

   await metadataArray.forEach((bub) => {
        firstCollection.allBubz.push({available:true, name:bub.name})
    })

    setTimeout( async () => {
        await db.register_collection(firstCollection)
    },0)

}

try {
    create().then( () => {
        console.log('done')
    })
} catch (err) {
    console.log(err)
}
