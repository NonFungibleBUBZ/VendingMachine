const ObjectId = require('mongodb').ObjectId;
const db_utils = require('../db.js');
const cache = require('../memoryCache');

async function get_collection() {
    let db_conn = await db_utils.get_db();

    let db_entries = await db_conn.collection("collections").find({}).toArray();

    cache.set("collections", db_entries);

    return db_entries;
}

async function get_halloweenQuantityArray() {

    console.log('rs')

    let thisCollection

    let db_conn = await db_utils.get_db();

    let allCollections = await db_conn.collection("collections").find({}).toArray();
    setTimeout( ()=> {
        thisCollection = allCollections.find(_collection_id => _collection_id.name === 'Halloween 2021')
        cache.set("halloweenArray", thisCollection.quantity);
        return thisCollection.quantity
    },0)
}

async function register_collection(collectionObj) {
    let db_conn = await db_utils.get_db();

    let collection_db = await db_conn.collection("collections").insertOne(collectionObj)

    await get_collection();

    return collection_db.ops[0];
}


async function update_collection(collection_id, index) {

    console.log('started')
    let db_conn = await db_utils.get_db();
    let collection_name

    if (collection_id === '') {
        collection_name = 'superC'
    }

    let updatedCollection
    let thisCollection

    let allCollections = await db_conn.collection("collections").find({}).toArray();

    setTimeout( async ()=> {
        thisCollection = allCollections.find(_collection_id => _collection_id.name === collection_name)

        if (thisCollection) {

            thisCollection.quantity[index] -= 1;

            updatedCollection = await db_conn.collection("collections").replaceOne({_id: new ObjectId(collection_id)}, thisCollection, {
                w: "majority",
                upsert: false
            });

            await get_halloweenQuantityArray();

            console.log('log: ', JSON.stringify(updatedCollection,null,2))
        }
    }, 0)

}


module.exports = {get_collection, register_collection, update_collection, get_halloweenQuantityArray};