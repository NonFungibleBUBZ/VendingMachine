const express = require('express');
const router = express.Router();
const { mintController } = require('./controllers/mintController')
const controller = require('./controller');
const db = require('./db');

router.get ('/', (req,res) => {
    return res.status(200).json({"message":"report working"});
})

router.get("/mint", mintController);

module.exports = router;
