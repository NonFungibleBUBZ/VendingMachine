const db = require('./db');

async function get_availableBubz() {
    return await db.get_availableBubz()
}

async function get_collection(collection) {
    return await db.get_collection(collection)
}

module.exports = { get_availableBubz };