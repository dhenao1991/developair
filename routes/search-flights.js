//Set up the server
const express = require("express");
const router = express.Router();
const db = require("../data/database");

//Set up POST routes for processing form submissions

//Search for outbound flights
router.post("/submit-flight-data-information-outbound",
  async function (req, res) {
    //Definition of variables submitted in the form
    const typeOfTrip = req.body["type-of-trip"];
    const origin = req.body.origin;
    const destination = req.body.destination;
    const departDate = req.body["depart-date"];
    const returnDate = req.body["return-date"];
    const paxNumber = +req.body["pax-number"];

    //Convert departDate into readable format
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

    //The data validation should come here
    if (
      (typeOfTrip == "round-trip" &&
        returnDate >= departDate &&
        paxNumber >= 1) ||
      (typeOfTrip == "one-way" && paxNumber >= 1)
    ) {
      console.log("Data validated successfully");
      console.log(typeOfTrip);
      console.log(origin);
      console.log(destination);
      console.log(departDate);
      console.log(returnDate);
      console.log(paxNumber);
      //Create a SQL query
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
      const [outboundFlights] = await db.query(queryAvailableFlights, [
        departDate,
        origin,
        destination,
        paxNumber,
      ]);
      //console.log(outboundFlights);
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
          paxNumber: paxNumber
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
router.post("/submit-flight-data-information-inbound",
  async function (req, res) {
    //Definition of variables submitted in the form

    const outboundOrigin = req.body.originCity;
    const outboundDestination = req.body.destinationCity;
    const departDate = req.body.departDate;
    const returnDate = req.body.returnDate;
    const paxNumber = +req.body.paxNumber;
    const selectedOutboundFlight = +req.body.selectedFlight;

    //Convert returnDate into readable format
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

    parts = returnDate.split("-");
    const returnDateYear = +parts[0];
    const returnDateMonth = months[+parts[1] - 1];
    const returnDateDate = +parts[2];
    const returnDateFormatted =
      returnDateMonth + " " + returnDateDate + ", " + returnDateYear;

    //The data validation should come here
    if (returnDate >= departDate && paxNumber >= 1) {
      console.log("Data validated successfully");

      console.log(outboundOrigin);
      console.log(outboundDestination);
      console.log(departDate);
      console.log(returnDate);
      console.log(paxNumber);
      console.log(selectedOutboundFlight);

      //Create a SQL query
      const queryAvailableFlightsWithoutConstraints = `
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

      const queryAvailableFlightsWithConstraints = `
	    SELECT F.flightNumber, F.departureDate, F.originAirport, F.destinationAirport,
	    time_format(F.departureTime,'%H:%i') as departureTime,
     	time_format(F.arrivalTime,'%H:%i') as arrivalTime,
   	  A1.city as originCity, A2.city as destinationCity,
   	  TIME_FORMAT(TIMEDIFF(F.arrivalTime, F.departureTime), '%H:%i') as flightDuration
	    FROM flights F JOIN airports A1 ON F.originAirport = A1.id JOIN airports A2 ON F.destinationAirport = 	A2.id
	    WHERE
      departureDate = ? AND
      departureTime >= ADDTIME((SELECT arrivalTime FROM flights WHERE flightNumber = ? and 	departureDate = ?),'0:45') AND
      originAirport = ? AND
      destinationAirport = ? AND
      availableSeats - ?  >= 0
	    ORDER BY departureTime;`;

      //Determine which query will be run

      let inboundFlights;

      if (departDate != returnDate) {
        [inboundFlights] = await db.query(
          queryAvailableFlightsWithoutConstraints,
          [returnDate, outboundDestination, outboundOrigin, paxNumber]
        );
      } else if (departDate == returnDate) {
        [inboundFlights] = await db.query(
          queryAvailableFlightsWithConstraints,
          [
            returnDate,
            selectedOutboundFlight,
            departDate,
            outboundDestination,
            outboundOrigin,
            paxNumber,
          ]
        );
      }

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