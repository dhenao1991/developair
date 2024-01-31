//Set up the server
const express = require("express");
const router = express.Router();
const db = require("../data/database");

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
  if (typeOfTrip == 'round-trip'){
    inboundFlightNumber = +req.body.inboundFlightNumber;
    returnDate = req.body.returnDate;
  }
  //Create queries to INSERT a record in the database
  const queryInsertRecordforRoundTrip = `
  INSERT INTO reservations (paxName, paxLastName, paxDateOfBirth, paxEmail, paxPhone, paxCountry, reservedSeats, outboundFlightNumber, outboundDepartureDate, inboundFlightNumber, inboundDepartureDate, creationDate)
  VALUES (?,?,?,?,?,?,?,?,?,?,?,CURRENT_TIMESTAMP)`;

  const queryInsertRecordforOneWay = `
  INSERT INTO reservations (paxName, paxLastName, paxDateOfBirth, paxEmail, paxPhone, paxCountry, reservedSeats, outboundFlightNumber, outboundDepartureDate, creationDate)
  VALUES (?,?,?,?,?,?,?,?,?,CURRENT_TIMESTAMP)`;

  //Create query to UPDATE the available seats of the selected flights
  const queryUpdateAvailableSeats = `
  UPDATE flights SET availableSeats = availableSeats - ? WHERE flightNumber = ? AND departureDate = ?`;

  //Run INSERT and UPDATE queries for roundtrip
  if(typeOfTrip == 'round-trip'){
  await db.query(queryInsertRecordforRoundTrip,[
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
    returnDate]);
  await db.query(queryUpdateAvailableSeats,[
    paxNumber,
    outboundFlightNumber,
    departDate
  ]);
  await db.query(queryUpdateAvailableSeats,[
    paxNumber,
    inboundFlightNumber,
    returnDate
  ]);
  } else {
    //Run INSERT and UPDATE queries for one-way
    await db.query(queryInsertRecordforOneWay,[
      paxName,
      paxLastName,
      paxDateOfBirth,
      paxEmail,
      paxPhoneNumber,
      paxCountry,
      paxNumber,
      outboundFlightNumber,
      departDate
    ]);
    await db.query(queryUpdateAvailableSeats,[
      paxNumber,
      outboundFlightNumber,
      departDate
    ]);
  }

  //Creare query to SELECT the reservationCode of the created record
  const querySelectReservationCode = `
  SELECT reservationCode FROM reservations WHERE paxEmail = ? AND outboundDepartureDate = ? AND outboundFlightNumber = ?`;

  //Run query
  const [reservationCode] = await db.query(querySelectReservationCode,[paxEmail,departDate,outboundFlightNumber]);

  //Redirecting to the next page
  res.render("successful-purchase",{
    reservationCode:reservationCode[0].reservationCode
  });
});

module.exports = router;