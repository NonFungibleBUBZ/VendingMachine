const express = require('express');
const routes = express.Router();
const db = require('./db');

routes.get('/', ( req, res) => {
    return res.status(200).json({"Message":"Working"});
})
routes.get('/test', ( req, res) => {
    return res.status(200).json({"Message":"Alive"});
})

routes.use('/mint', require('./mint/routes'));

routes.use('/report', require('./report/routes'));

module.exports = routes;