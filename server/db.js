const MongoClient = require('mongodb').MongoClient;

// that's my personal database, i can help you come with your own if you want to
const url = process.env.MONGO_URL || "mongodb+srv://rovaris:1234567a@cryptomuseum.nn6tk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

let client = new MongoClient(url);
let connection;
let database;

async function init_db(){ // database connection
  client = new MongoClient(url);

  try {
    connection = await client.connect();
    database = await client.db('nftBubz');
    console.log("Conected");

  } catch (e) {
    console.log(e);
  }
  return database;
}

async function get_db() { // database cache
  return database || await init_db()
}

module.exports = {
    init_db,
    get_db
};
