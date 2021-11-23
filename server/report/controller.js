const db = require('./db');

async function get_availableBubz() {
    return await db.get_availableBubz()
}

async function get_collections() {
    return await db.get_collections()
}

module.exports = { get_availableBubz };