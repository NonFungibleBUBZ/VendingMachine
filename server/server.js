const express = require('express');
const body_parser = require('body-parser');
const app = express();
const router = require('./routes');
const db = require('./db');

// those headers prevent most browsers corss erros that we might face
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,DELETE,PUT');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

    if ('OPTIONS' == req.method) {
        res.sendStatus(200);
    }
    else {
        next();
    }
});
app.use(body_parser.urlencoded({ extended: true }));
app.use(body_parser.json());

// router declaration
app.use(router);

// database init
async function initialize_database() {
    console.log("starting db...");
    let _db = await db.init_db()
}

// setting the server online at the network port :3000 (notice that in your compute engine>VPC network>firewall i've opened the port 3000 to allow http requests
app.listen(3000, async() => {
    console.log("online at 3000");
    await initialize_database(); //after server gets online we then init the database
});


module.exports = app;


