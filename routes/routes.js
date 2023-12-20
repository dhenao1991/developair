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

router.get("/find-booking-form", function (req, res) {
  res.render("find-booking-form");
});

router.get("/destinations", function (req, res) {
  res.render("destinations");
});

//Set up POST routes for processing form submissions
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

      //New procedure: creating a SQL query
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

router.post('/pax-info', async function(req,res){
  //Initialize variables
  let typeOfTrip = req.body.typeOfTrip;
  let selectedOutboundFlight;
  let selectedInboundFlight;
  let departDate = req.body.departDate;
  let returnDate;
  let paxNumber = +req.body.paxNumber;

  //Assign values to variables according to the type of trip
  if (typeOfTrip == 'round-trip'){
    selectedOutboundFlight = +req.body.selectedOutboundFlight;
    selectedInboundFlight = +req.body.selectedFlight;
    returnDate = req.body.returnDate;
  } else if (typeOfTrip == 'one-way'){
    selectedOutboundFlight = +req.body.selectedFlight;
  }
  //Define query for flight details
  const queryForFlightDetails = `
  SELECT F.flightNumber, F.departureDate, F.originAirport, F.destinationAirport,
  time_format(F.departureTime,'%H:%i') as departureTime,
  time_format(F.arrivalTime,'%H:%i') as arrivalTime,
  A1.city as originCity, A2.city as destinationCity
  FROM flights F JOIN airports A1 ON F.originAirport = A1.id JOIN airports A2 ON F.destinationAirport = 	A2.id
  WHERE F.flightNumber = ? and F.departureDate = ?;`;

  //Define variables for outboundFlight and inboundFlight

  let outboundOrigin;
  let outboundOriginCity;
  let outboundDestination;
  let outboundDestinationCity;
  let outboundDepartureTime;
  let outboundArrivalTime;
  let inboundOrigin;
  let inboundOriginCity;
  let inboundDestination;
  let inboundDestinationCity;
  let inboundDepartureTime;
  let inboundArrivalTime;  

  //Run query for outbound flight  
  [outboundFlight] = await db.query(queryForFlightDetails,[selectedOutboundFlight,departDate]);
  console.log(outboundFlight)
  outboundFlightNumber = selectedOutboundFlight;
  outboundOrigin = outboundFlight[0].originAirport;
  outboundDestination = outboundFlight[0].destinationAirport;
  outboundDestinationCity = outboundFlight[0].destinationCity;
  outboundOriginCity = outboundFlight[0].originCity;
  outboundDepartureTime = outboundFlight[0].departureTime;
  outboundArrivalTime = outboundFlight[0].arrivalTime;

  //If applicable, run query for inbound flight
  if (typeOfTrip == 'round-trip'){
    [inboundFlight] = await db.query(queryForFlightDetails,[selectedInboundFlight,returnDate]);
    console.log(inboundFlight)
    inboundFlightNumber = selectedInboundFlight;
    inboundOrigin = inboundFlight[0].originAirport;
    inboundDestination = inboundFlight[0].destinationAirport;
    inboundDestinationCity = inboundFlight[0].destinationCity;
    inboundOriginCity = inboundFlight[0].originCity;
    inboundDepartureTime = inboundFlight[0].departureTime;
    inboundArrivalTime = inboundFlight[0].arrivalTime;
  }

  //Render the pax-info page according to the type of trip
  if (typeOfTrip == 'round-trip'){
  res.render('pax-info',{
    typeOfTrip:typeOfTrip,
    departDate:departDate,
    returnDate:returnDate,
    outboundFlightNumber:outboundFlightNumber,
    outboundOrigin:outboundOrigin,
    outboundOriginCity:outboundOriginCity,
    outboundDestination:outboundDestination,
    outboundDestinationCity:outboundDestinationCity,
    outboundDepartureTime:outboundDepartureTime,
    outboundArrivalTime:outboundArrivalTime,
    inboundFlightNumber:inboundFlightNumber,
    inboundOrigin:inboundOrigin,
    inboundOriginCity:inboundOriginCity,
    inboundDestination:inboundDestination,
    inboundDestinationCity:inboundDestinationCity,
    inboundDepartureTime:inboundDepartureTime,
    inboundArrivalTime:inboundArrivalTime,
    paxNumber:paxNumber
  });
} else {
  res.render('pax-info',{
    typeOfTrip:typeOfTrip,
    departDate:departDate,
    returnDate:returnDate,
    outboundFlightNumber:outboundFlightNumber,
    outboundOrigin:outboundOrigin,
    outboundOriginCity:outboundOriginCity,
    outboundDestination:outboundDestination,
    outboundDestinationCity:outboundDestinationCity,
    outboundDepartureTime:outboundDepartureTime,
    outboundArrivalTime:outboundArrivalTime,
    paxNumber:paxNumber
  });
}});

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
  //The data validation should come here
  /*Old procedure: Storing the information in a file
  const paxDataForReservation = req.body;
  readNWritefunctions.storePaxDataForReservation(paxDataForReservation);
  */
  //New procedure, create queries to INSERT a record in the database
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
