//const db = require('./db')
const { metadata } = require('./metadata/metadata_first_collection')



let create = async function () {
    let firstCollection = {
        name:'firstCollection',
        allBubz: [],
        availableBubz: [],
        lastMinted: [],
        bubzInDispensary: []
        //TODO
    }

   await metadata.forEach((bub) => {
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
