const express = require('express');
const router = express.Router();
const db = require('./db');

router.get('/', (req,res) => {
    return res.status(200).json({"Message":"Working"});
})
router.get('/test', (req,res) => {
    return res.status(200).json({"Message":"Alive"});
})

router.use('/mint', require('./mint/routes'));

router.use('/report', require('./report/routes'));

module.exports = router;