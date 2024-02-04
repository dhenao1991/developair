//Set up the server
const express = require("express");
const router = express.Router();
const findReservationControllers = require('../controllers/find-reservation-controllers');

//Set up POST routes for processing form submissions

//Find existing reservation
router.post("/find-existing-booking", findReservationControllers.getReservationData);

module.exports = router;