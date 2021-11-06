const MongoClient = require('mongodb').MongoClient;

const url = process.env.MONGO_URL || "";

let client = new MongoClient(url);
let connection;
let database;

async function init_db(){
  client = new MongoClient(url);

  try {
    connection = await client.connect();
    database = await client.db('');
    console.log("Conected");

  } catch (e) {
    console.log(e);

  }

  return database;
}

async function get_db() {
  return database || await init_db()
}

module.exports = {
    init_db,
    get_db
};
