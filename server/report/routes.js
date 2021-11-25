//TODO
const express = require('express');
const router = express.Router();

const { reportHandler } = require('./controlers/dashBoardController');
const db = require('./db');

router.get ('/', (req,res) => {
    return res.status(200).json({"message":"report working"});
})

router.get('/test', reportHandler) //todo change to report, but got restart the server

module.exports = router;
