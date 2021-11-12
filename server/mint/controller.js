const db = require('./db');
const cache = require('../memoryCache');

async function get_collections() {
    return cache.get('collections') || await db.get_collection();
}

async function set_unavailable(index) {
    return await db.set_unavailable(index, 'firstCollection')
}

async function update_collection() {
    return await db.update_collection('firstCollection')
}

module.exports = {  get_collections, update_collection, set_unavailable };