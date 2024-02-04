//Set up the server
const express = require("express");
const router = express.Router();
const loadPagesControllers = require('../controllers/load-pages-controllers');

//Set up the GET routes for loading each page

router.get("/", loadPagesControllers.loadIndex);

router.get("/find-booking-form", loadPagesControllers.loadFindReservationPage);

router.get("/destinations", loadPagesControllers.loadDestinationsPage);

module.exports = router;