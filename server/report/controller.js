const db = require('./db');

async function get_availableBubz() {
    return await db.get_availableBubz()
}

module.exports = { get_availableBubz };