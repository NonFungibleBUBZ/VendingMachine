const ObjectId = require('mongodb').ObjectId;
const db_utils = require('../db.js');
const cache = require('../memoryCache');

// Those are the db methods, i'll do my best to explain what they do, and what they're for, any question message me on discord #Lrovaris#4065
// i'm online 24/7 there i'll be glad to help, or improve those scripts, or fix if there's anything not working properly


// simple return all the collections in the database
async function get_collection() {
    let db_conn = await db_utils.get_db();

    let db_entries = await db_conn.collection("collections").find({}).toArray();

    cache.set("collections", db_entries); // in this method it also updates the server cache data

    return db_entries;
}


// like the first method that returns all the collections, this method returns all the available bubz to mint
async function get_availableBubz() {
    let db_conn = await db_utils.get_db(); // connects to the db

    let db_entries = await db_conn.collection("collections").find({}).toArray(); // gets all the collections

    db_entries = db_entries.find(collection => collection.name === 'firstCollection') // looks for the first collection

    db_entries = db_entries.availableBubz // set the variable to what we want

    cache.set("availableBubz", db_entries); // updates the server cache with the key "availableBubz"

    return db_entries; // then returns the availableBubz
}

// this is used internally to create a new collection, i've used this method to create the first collection :3
// it should be used if you manage to come with another collection
async function register_collection(collectionObj) {
    let db_conn = await db_utils.get_db();

    let collection_db = await db_conn.collection("collections").insertOne(collectionObj)

    await get_collection();

    return collection_db;
}

// this method is responsible for setting an Bub unavailable after mint, it takes as parameter the index of the bub (note that index = number -1 ex: SuperC1234.index == 1233)
async function set_unavailable(index, name) {

    let db_conn = await db_utils.get_db(); // db connection
    let updatedCollection // variables declarations
    let thisCollection

    let allCollections = await db_conn.collection("collections").find({}).toArray(); // getting all the collections

    setTimeout( async () => { // setTimeout in javascript makes sure that it's content only happens after a desired time, in this case "0" , so this part
                                        // of the code runs on the next tick of the clock

        thisCollection = allCollections.find(_collection_id => _collection_id.name === name) // looks for the collection parameter name, in the controller usage we set it as "firstCollection"

        if (thisCollection) { // if it found "firstCollection"

            thisCollection.allBubz[index].available = false; // set the bub that been minted unavailable

            updatedCollection = await db_conn.collection("collections").replaceOne({_id: new ObjectId(thisCollection._id)}, thisCollection, {
                w: "majority",
                upsert: false
            });                 // replace the current first collection in the database with the updated collection

            setTimeout( async ()=> {
              await update_collection(name) // on the next tick of the clock (since the last call had await, this only happens after the database update
                                            // it then calls the update_collection method
            },0)
        }
    }, 0)
}

// this method going to be called after a mint also, is responsible from removing the unavailable bub from the array of available bubz
async function update_collection(name) {
    let db_conn = await db_utils.get_db(); // db connection
    let thisCollection // variables declarations
    let updatedCollection
    let allCollections = await db_conn.collection("collections").find({}).toArray(); // all collections

    setTimeout( async () => {
        thisCollection = allCollections.find(_collection_id => _collection_id.name === name) // desired collection

        if (thisCollection) { // if found the desired collection

            let availableBubz = thisCollection.allBubz.filter(bubz => bubz.available === true) // availableBubz receive an filtered array of allBubz removing the unavailable ones
                                                                                                // note that in that way, we still got all the bubz in the database, but the system only mints from the
                                                                                                // available bubz array

            thisCollection.availableBubz = availableBubz

            updatedCollection = await db_conn.collection("collections").replaceOne({_id: new ObjectId(thisCollection._id)}, thisCollection, {
                w: "majority",
                upsert: false
            });

            setTimeout( async()=> {
                await get_collection(); // after updates we also update the server cache
                await get_availableBubz(); // for collections and bubz
            },0)
        }

    }, 0)
}



module.exports = {get_collection, register_collection, update_collection, set_unavailable, get_availableBubz};