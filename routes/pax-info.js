//Set up the server
const express = require("express");
const router = express.Router();
const paxInfoControllers = require('../controllers/pax-info-controllers');

//Set up POST routes for processing form submissions

//Filling pax info
router.post('/pax-info', paxInfoControllers.getSelectedItineraryAndRequestPaxData);

module.exports = router;