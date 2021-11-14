const express = require('express');
const router = express.Router();

// sending an get request to the vm external ip (right now is 104.154.208.48:3000) should return "Message":"Working"
router.get('/', ( req, res) => {
    return res.status(200).json({"Message":"Working"});
})

// this route is used by google to verify the api and send live reports
router.get('/test', ( req, res) => {
    return res.status(200).json({"Message":"Alive"});
})

// Mint router declaration
router.use('/mint', require('./mint/routes'));

// Report router declaration
router.use('/report', require('./report/routes'));

module.exports = router;