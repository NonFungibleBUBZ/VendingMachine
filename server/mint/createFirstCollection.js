//const db = require('./db')
const  metadataArray  = require('./metadata/metadata_first_collection')

console.log(metadataArray)

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

    setTimeout( () => {
        console.log(firstCollection)
    },0)

}

try {
    create().then( () => {
        console.log('done')
    })
} catch (err) {
    console.log(err)
}
