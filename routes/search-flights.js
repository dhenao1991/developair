//Set up the server
const express = require("express");
const router = express.Router();
const SearchData = require("../models/search-data");
const dateMgmt = require("../util/date-format-mgmt");

//Set up POST routes for processing form submissions

//Search for outbound flights
router.post(
  "/submit-flight-data-information-outbound",
  async function (req, res) {
    //Definition of variables submitted in the form
    const typeOfTrip = req.body["type-of-trip"];
    const origin = req.body.origin;
    const destination = req.body.destination;
    const departDate = req.body["depart-date"];
    const returnDate = req.body["return-date"];
    const paxNumber = +req.body["pax-number"];

    //Convert departDate into readable format
    const departDateFormatted = dateMgmt.formatDate(departDate);

    //The data validation should come here
    if (
      (typeOfTrip == "round-trip" &&
        returnDate >= departDate &&
        paxNumber >= 1) ||
      (typeOfTrip == "one-way" && paxNumber >= 1)
    ) {
      console.log("Data validated successfully");
      console.log(
        typeOfTrip,
        origin,
        destination,
        departDate,
        returnDate,
        paxNumber
      );
      //Create a blueprint of the SearchData class for outbound data
      const searchOutboundData = new SearchData(
        departDate,
        origin,
        destination,
        paxNumber
      );
      //Get available outbound flights
      const outboundFlights =
        await searchOutboundData.getAvailableOutboundFlights();
      //If there is >=1 flight, redirect to the next page. Else, show an unavailability page
      if (outboundFlights.length >= 1) {
        res.render("flight-search-step-1", {
          typeOfTrip: typeOfTrip,
          origin: origin,
          destination: destination,
          departDate: departDate,
          returnDate: returnDate,
          departDateFormatted: departDateFormatted,
          outboundFlights: outboundFlights,
          paxNumber: paxNumber,
        });
      } else {
        res.redirect("/unavailability");
      }
    } else {
      res.status("500").render("500");
    }
  }
);

//Search for inbound flights
router.post(
  "/submit-flight-data-information-inbound",
  async function (req, res) {
    //Definition of variables submitted in the form
    const outboundOrigin = req.body.originCity;
    const outboundDestination = req.body.destinationCity;
    const departDate = req.body.departDate;
    const returnDate = req.body.returnDate;
    const paxNumber = +req.body.paxNumber;
    const selectedOutboundFlight = +req.body.selectedFlight;

    //Convert returnDate into readable format
    const returnDateFormatted = dateMgmt.formatDate(returnDate);

    //The data validation should come here
    if (returnDate >= departDate && paxNumber >= 1) {
      console.log("Data validated successfully");
      console.log(
        outboundOrigin,
        outboundDestination,
        departDate,
        returnDate,
        paxNumber,
        selectedOutboundFlight
      ); //Create a SQL query

      let inboundFlights;

      //Create a blueprint of the SearchData class for inbound data
      const searchInboundData = new SearchData(
        departDate,
        outboundOrigin,
        outboundDestination,
        paxNumber,
        selectedOutboundFlight,
        returnDate
      );
      //console.log(searchInboundData);
      //Get available outbound flights
      inboundFlights = await searchInboundData.getAvailableInboundFlights();

      //If there is >=1 flight, redirect to the next page. Else, show an unavailability page
      if (inboundFlights.length >= 1) {
        res.render("flight-search-step-2", {
          departDate: departDate,
          returnDate: returnDate,
          origin: outboundDestination,
          destination: outboundOrigin,
          returnDateFormatted: returnDateFormatted,
          inboundFlights: inboundFlights,
          paxNumber: paxNumber,
          selectedOutboundFlight: selectedOutboundFlight,
        });
      } else {
        res.redirect("/unavailability");
      }
    } else {
      res.status("500").render("500");
    }
  }
);

module.exports = router;
