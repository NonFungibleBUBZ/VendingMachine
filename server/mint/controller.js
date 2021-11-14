const db = require('./db');
const cache = require('../memoryCache');

// this controller works in a way that it first verify if there's anything in cache, if doesn't it calls the db method,
// the database method put recent data in cache
async function get_collections() {
    return cache.get('collections') || await db.get_collection();
}


// those 3 methods are just directly asynchronous calls of the db methods
async function set_unavailable(index) {
    return await db.set_unavailable(index, 'firstCollection') // notice that i've made those methods in a call that's easy to come up with a new collection,
                                                                    // you wouldn't need to create new db methods or anything like that
}
async function update_collection() {
    return await db.update_collection('firstCollection')
}
async function get_availableBubz() {
    return await db.get_availableBubz()
}

module.exports = {  get_collections, update_collection, set_unavailable, get_availableBubz };