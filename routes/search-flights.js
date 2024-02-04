//Set up the server
const express = require("express");
const router = express.Router();
const searchFlightsControllers = require("../controllers/search-flights-controllers");

//Set up POST routes for processing form submissions

//Search for outbound flights
router.post(
  "/submit-flight-data-information-outbound",
  searchFlightsControllers.getInformationForOutboundFlight
);

//Search for inbound flights
router.post(
  "/submit-flight-data-information-inbound",
  searchFlightsControllers.getInformationForInboundFlight
);

module.exports = router;
