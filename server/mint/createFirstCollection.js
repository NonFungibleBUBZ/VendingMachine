// don't mind this script i used it multiple times to do multiple tests

const ObjectId = require('mongodb').ObjectId;
const db_utils = require('../db.js');
const { cardanocliJs } = require( "../utils/cardano" );

let drop = cardanocliJs.wallet('dropWallet')

let create = async function () {
    const mintScript = {
        keyHash: cardanocliJs.addressKeyHash(drop.name),
        type: "sig",
    };


    console.log(JSON.stringify(mintScript,null,2))
}

try {
    create().then( () => {

    })
} catch (err) {
    console.log(err, ' a?')
}



/*
    let db_conn = await db_utils.get_db(); // db connection

    let allCollections = await db_conn.collection("collections").find({}).toArray(); // getting all the collections

    setTimeout( async () => { // setTimeout in javascript makes sure that it's content only happens after a desired time, in this case "0" , so this part
        // of the code runs on the next tick of the clock

        let firstCollection = allCollections.find(_collection_id => _collection_id.name === 'firstCollection') // looks for the collection parameter name, in the controller usage we set it as "firstCollection"

        if (firstCollection) {

            firstCollection.allBubz.forEach( (bub) => {
                bub.available = true
            })

            firstCollection.lastMinted = {}
            firstCollection.bubzInDispensary = []
            firstCollection.totalValueCollected = 0
            firstCollection.valueSentOut = 0
            firstCollection.ValueSentDeveloper = 0
            firstCollection.nftDroped = []
            firstCollection.totalMintingCost = 0
            firstCollection.totalSentDonation = 0
            firstCollection.availableBubz = firstCollection.allBubz

            let update = await db_conn.collection("collections").replaceOne({_id: new ObjectId(firstCollection._id)}, firstCollection, {
                w: "majority",
                upsert: false
            });

        }
    }, 0)
*/