//Set up the server
const express = require("express");
const router = express.Router();
const NewReservation = require("../models/new-reservation-model");

//Set up POST routes for processing form submissions

//Create reservation
router.post("/submit-pax-data-for-reservation", async function (req, res) {
  //Definition of variables submitted in the form
  const paxName = req.body["pax-name"];
  const paxLastName = req.body["pax-last-name"];
  const paxDateOfBirth = req.body["pax-date-of-birth"];
  const paxEmail = req.body["pax-email"];
  const paxPhoneNumber = req.body["pax-phone-number"];
  const paxCountry = req.body["pax-country"];
  const paxCreditCardInfo = "Nothing yet";
  const typeOfTrip = req.body.typeOfTrip;
  const outboundFlightNumber = +req.body.outboundFlightNumber;
  const departDate = req.body.departDate;
  const paxNumber = +req.body.paxNumber;
  let inboundFlightNumber;
  let returnDate;
  if (typeOfTrip == "round-trip") {
    inboundFlightNumber = +req.body.inboundFlightNumber;
    returnDate = req.body.returnDate;
  }

  let newReservation;
  if (typeOfTrip == "round-trip") {
    //Create blueprint of newReservation and run the createRoundTrip method
    newReservation = new NewReservation(
      paxName,
      paxLastName,
      paxDateOfBirth,
      paxEmail,
      paxPhoneNumber,
      paxCountry,
      paxNumber,
      outboundFlightNumber,
      departDate,
      inboundFlightNumber,
      returnDate
    );
    await newReservation.createRoundTrip();
    
  } else {
    //Create blueprint of newReservation and run the createOneWayTrip method
    newReservation = new NewReservation(
      paxName,
      paxLastName,
      paxDateOfBirth,
      paxEmail,
      paxPhoneNumber,
      paxCountry,
      paxNumber,
      outboundFlightNumber,
      departDate,
    );
    await newReservation.createOneWayTrip();    
  }

  //Get reservation code of the newly created reservation
  const reservationCode = await newReservation.getReservationCode();

  //Redirecting to the next page
  res.render("successful-purchase", {
    reservationCode: reservationCode,
  });
});

module.exports = router;
