//Set up the server
const express = require("express");
const router = express.Router();
const db = require("../data/database");

//Require modules from external files
const readNWritefunctions = require("../util/read-n-write-functions");

//Set up the GET routes for loading each page

router.get("/", async function (req, res) {
  //Old way
  //const htmlFilePath = path.join(__dirname,'views','index.html');
  //res.sendFile(htmlFilePath);
  //New way
  const [cities] = await db.query("SELECT id, city FROM airports");
  //console.log([cities]);
  res.render("index", { cities: cities });
});

router.get("/updatedestinations/:origin", async function (req, res) {
  const origin = req.params.origin;
  //console.log(origin);
  const queryDestinationsForGivenOrigin = `
  SELECT DISTINCT F.destinationAirport as airport, A.city as city
  FROM flights F
  LEFT JOIN airports A ON F.destinationAirport = A.id
  WHERE F.originAirport = ? 
  ORDER BY F.destinationAirport;
  `;
  //Run query for feasible destinations given an origin
  const [destinations] = await db.query(queryDestinationsForGivenOrigin, [
    origin,
  ]);
  //console.log(destinations);
  res.json(destinations);
});

router.get("/pax-info", function (req, res) {
  res.render("pax-info");
});

router.get("/successful-purchase", function (req, res) {
  res.render("successful-purchase");
});

router.get("/find-booking-form", function (req, res) {
  res.render("find-booking-form");
});

router.get("/destinations", function (req, res) {
  res.render("destinations");
});

router.get("/unavailability", function (req, res) {
  res.render("unavailability");
});

//Set up POST routes for processing form submissions
router.post("/submit-flight-data-information", async function (req, res) {
  //Definition of variables submitted in the form
  const typeOfTrip = req.body["type-of-trip"];
  const origin = req.body.origin;
  const destination = req.body.destination;
  const departDate = req.body["depart-date"];
  const returnDate = req.body["return-date"];
  const paxNumber = +req.body["pax-number"];

  //Convert departDate and returnDate into readable format
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let parts = departDate.split("-");
  const departDateYear = +parts[0];
  const departDateMonth = months[+parts[1] - 1];
  const departDateDate = +parts[2];
  const departDateFormatted =
    departDateMonth + " " + departDateDate + ", " + departDateYear;
  //
  parts = returnDate.split("-");
  const returnDateYear = +parts[0];
  const returnDateMonth = months[+parts[1] - 1];
  const returnDateDate = +parts[2];
  const returnDateFormatted =
    returnDateMonth + " " + returnDateDate + ", " + returnDateYear;

  //The data validation should come here
  if ((typeOfTrip == "round-trip" && returnDate >= departDate && paxNumber >= 1) || (typeOfTrip == "one-way" && paxNumber >= 1)){
    console.log("Data validated successfully");
    console.log(typeOfTrip);
    console.log(origin);
    console.log(destination);
    console.log(departDate);
    console.log(returnDate);
    console.log(paxNumber);
    /*Old procedure: Storing the information in a file
    const flightSearchData = req.body;
    readNWritefunctions.storeFlightSearchData(flightSearchData);*/
    //New procedure: creating a SQL query
    const queryAvailableFlights = `
      SELECT F.flightNumber, F.departureDate, F.originAirport, F.destinationAirport,
      time_format(F.departureTime,'%H:%i') as departureTime,
      time_format(F.arrivalTime,'%H:%i') as arrivalTime,
      A1.city as originCity, A2.city as destinationCity,
      TIME_FORMAT(TIMEDIFF(F.arrivalTime, F.departureTime), '%H:%i') as flightDuration
      FROM flights F JOIN airports A1 ON F.originAirport = A1.id JOIN airports A2 ON F.destinationAirport = A2.id
      WHERE
      departureDate = ? AND
      originAirport = ? AND
      destinationAirport = ? AND
      availableSeats - ?  >= 0
      ORDER BY departureTime;`;
    //Run query for outbound flights
    const [outboundFlights] = await db.query(queryAvailableFlights, [departDate,origin,destination,paxNumber,]);
    //console.log(outboundFlights);
    if (typeOfTrip == "round-trip") {
      //Run query for inbound flights
      const [inboundFlights] = await db.query(queryAvailableFlights, [returnDate,destination,origin,paxNumber,]);
      //console.log([inboundFlights]);

      //If there is >=1 flight each way, redirect to the next page. Else, show an unavailability page
      if (outboundFlights.length >= 1 && inboundFlights.length >= 1) {
        res.render("flight-search", {
          typeOfTrip: typeOfTrip,
          origin: origin,
          destination: destination,
          departDate: departDateFormatted,
          returnDate: returnDateFormatted,
          outboundFlights: outboundFlights,
          inboundFlights: inboundFlights,
        });
      } else {
        res.redirect("/unavailability");
      }
    }
    else if (outboundFlights.length >= 1) {
        res.render("flight-search", {
          typeOfTrip: typeOfTrip,
          origin: origin,
          destination: destination,
          departDate: departDateFormatted,
          returnDate:'',
          outboundFlights: outboundFlights,
        });
      } else {
        res.redirect("/unavailability");
      }
  } else {
    res.status("500").render("500");
  }
});

router.post("/submit-pax-data-for-reservation", function (req, res) {
  //Definition of variables submitted in the form
  const paxName = req.body["pax-name"];
  const paxLastName = req.body["pax-last-name"];
  const paxDateOfBirth = req.body["pax-date-of-birth"];
  const paxEmail = req.body["pax-email"];
  const paxPhoneNumber = req.body["pax-phone-number"];
  const paxCountry = req.body["pax-country"];
  const paxCreditCardInfo = "Nothing yet";
  //The data validation should come here
  //Storing the information in a file
  const paxDataForReservation = req.body;
  readNWritefunctions.storePaxDataForReservation(paxDataForReservation);
  //Redirecting to the next page
  res.redirect("/successful-purchase");
});

router.post("/find-existing-booking", async function (req, res) {
  //Definition of variables submitted in the form
  const reservationCode = +req.body["reservation-code"];
  //console.log(reservationCode);
  /*Old way
    //Storing the information in a file
    const submittedReservationCode = req.body;
    readNWritefunctions.storeSubmittedReservationCode(submittedReservationCode);
    */
  /*New way
    Data validation and SQL query*/
  if (reservationCode >= 123456) {
    const query = `
        SELECT
            R.*,
            FO.originAirport as outboundOrigin, a1.city as outboundOriginCity, a1.name as outboundOriginName,
            FO.destinationAirport as outboundDestination, a2.city as outboundDestinationCity, a2.name as outboundDestinationName,
            FO.departureTime as outboundDepartureTime, FO.ArrivalTime as outboundArrivalTime,
            FI.originAirport as inboundOrigin, a3.city as inboundOriginCity, a3.name as inboundOriginName,
            FI.destinationAirport as inboundDestination, a4.city as inboundDestinationCity, a4.name as inboundDestinationName,
            FI.departureTime as inboundDepartureTime, FI.ArrivalTime as inboundArrivalTime
        FROM reservations R
        JOIN flights FO ON R.outboundFlightNumber = FO.flightNumber AND R.outboundDepartureDate = FO.departureDate
        LEFT JOIN flights FI on R.inboundFlightNumber = FI.flightNumber and R.inboundDepartureDate = FI.departureDate
        JOIN airports a1 on a1.id = FO.originAirport
        JOIN airports a2 on a2.id = FO.destinationAirport
        LEFT JOIN airports a3 on a3.id = FI.originAirport
        LEFT JOIN airports a4 on a4.id = FI.destinationAirport
        WHERE R.reservationCode = ? ;`;
    const [reservationData] = await db.query(query, [reservationCode]);
    //console.log([reservationData]);
    //Render the review-booking page
    res.render("review-booking", { reservationData: reservationData[0] });
  } else {
    //res.status('500').render('500')
  }
});

module.exports = router;
