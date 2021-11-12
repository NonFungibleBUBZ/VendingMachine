const express = require('express');
const router = express.Router();
const { autoMintHandler } = require('./controllers/autoMint')
const controller = require('./controller');
const db = require('./db');

router.get ('/', (req,res) => {
    return res.status(200).json({"message":"report working"});
})

router.get("/mint", autoMintHandler);

module.exports = router;
