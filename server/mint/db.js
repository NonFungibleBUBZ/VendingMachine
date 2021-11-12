const ObjectId = require('mongodb').ObjectId;
const db_utils = require('../db.js');
const cache = require('../memoryCache');

async function get_collection() {
    let db_conn = await db_utils.get_db();

    let db_entries = await db_conn.collection("collections").find({}).toArray();

    cache.set("collections", db_entries);

    return db_entries;
}

async function get_availableBubz() {
    let db_conn = await db_utils.get_db();

    let db_entries = await db_conn.collection("collections").find({}).toArray();

    db_entries = db_entries.find(collection => collection.name === 'firstCollection')

    db_entries = db_entries.availableBubz

    cache.set("availableBubz", db_entries);

    return db_entries;
}

async function register_collection(collectionObj) {
    let db_conn = await db_utils.get_db();

    let collection_db = await db_conn.collection("collections").insertOne(collectionObj)

    await get_collection();

    return collection_db;
}

async function set_unavailable(index, name) {

    console.log('started')
    let db_conn = await db_utils.get_db();
    let updatedCollection
    let thisCollection

    let allCollections = await db_conn.collection("collections").find({}).toArray();

    setTimeout( async () => {
        thisCollection = allCollections.find(_collection_id => _collection_id.name === name)

        if (thisCollection) {

            thisCollection.allBubz[index].available = false;

            updatedCollection = await db_conn.collection("collections").replaceOne({_id: new ObjectId(thisCollection._id)}, thisCollection, {
                w: "majority",
                upsert: false
            });

            setTimeout( async ()=> {
              await update_collection(name)
            },0)

            console.log('log: ', JSON.stringify(updatedCollection,null,2))
        }
    }, 0)



}

async function update_collection(name) {
    let db_conn = await db_utils.get_db();
    let thisCollection
    let updatedCollection
    let allCollections = await db_conn.collection("collections").find({}).toArray();

    setTimeout( async () => {
        thisCollection = allCollections.find(_collection_id => _collection_id.name === name)

        if (thisCollection) {
            let availableBubz = thisCollection.allBubz.filter(bubz => bubz.available === true)
            thisCollection.availableBubz = availableBubz
            updatedCollection = await db_conn.collection("collections").replaceOne({_id: new ObjectId(thisCollection._id)}, thisCollection, {
                w: "majority",
                upsert: false
            });

            await get_collection();
            await get_availableBubz();
        }
        
    }, 0)
}



module.exports = {get_collection, register_collection, update_collection, set_unavailable, get_availableBubz};