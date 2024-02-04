//Set up the server
const express = require("express");
const router = express.Router();
const createReservationControllers = require('../controllers/create-reservation-controllers');

//Set up POST routes for processing form submissions

//Create reservation
router.post("/submit-pax-data-for-reservation", createReservationControllers.submitPaxDataAndCreateReservation);

module.exports = router;
