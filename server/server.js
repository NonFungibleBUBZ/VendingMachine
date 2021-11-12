const express = require('express');
const body_parser = require('body-parser');
const app = express();
const router = require('./router');
const db = require('./db');

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

app.use(router);

async function initialize_database() {
    console.log("starting db...");
    let _db = await db.init_db()
}



app.listen(3000, async() => {
    console.log("online at 3000");
    await initialize_database();
});


module.exports = app;


