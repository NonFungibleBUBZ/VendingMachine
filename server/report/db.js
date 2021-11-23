const ObjectId = require('mongodb').ObjectId;
const db_utils = require('../db.js');
const cache = require('../memoryCache');

// Those are the db methods, i'll do my best to explain what they do, and what they're for, any question message me on discord #Lrovaris#4065
// i'm online 24/7 there i'll be glad to help, or improve those scripts, or fix if there's anything not working properly



// like the first method that returns all the collections, this method returns all the available bubz to mint
async function get_availableBubz() {
    console.log('a')
    let db_conn = await db_utils.get_db(); // connects to the db

    let db_entries = await db_conn.collection("collections").find({}).toArray(); // gets all the collections

    db_entries = db_entries.find(collection => collection.name === 'firstCollection') // looks for the first collection

    db_entries = db_entries.availableBubz // set the variable to what we want

    cache.set("availableBubz", db_entries); // updates the server cache with the key "availableBubz"

    return db_entries; // then returns the availableBubz
}

async function get_collections() {
    let db_conn = await db_utils.get_db(); // connects to the db

    let db_entries = await db_conn.collection("collections").find({}).toArray(); // gets all the collections

    cache.set('collections', db_entries); // updates the server cache with the key of the collection

    return db_entries;
}



module.exports = { get_availableBubz, get_collections };