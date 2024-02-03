//Set up the server
const express = require("express");
const router = express.Router();
const db = require("../data/database");
const dateMgmt = require('../util/date-format-mgmt');

//Set up POST routes for processing form submissions

//Filling pax info
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
  const [queryResultOutbound] = await db.query(queryForFlightDetails,[selectedOutboundFlight,departDate]);
  const outboundFlight = queryResultOutbound[0];
  //console.log(outboundFlight);
  outboundFlightNumber = selectedOutboundFlight;
  outboundOrigin = outboundFlight.originAirport;
  outboundDestination = outboundFlight.destinationAirport;
  outboundDestinationCity = outboundFlight.destinationCity;
  outboundOriginCity = outboundFlight.originCity;
  outboundDepartureTime = outboundFlight.departureTime;
  outboundArrivalTime = outboundFlight.arrivalTime;

  //If applicable, run query for inbound flight
  if (typeOfTrip == 'round-trip'){
    const [queryResultInbound] = await db.query(queryForFlightDetails,[selectedInboundFlight,returnDate]);
    const inboundFlight = queryResultInbound[0];
    //console.log(inboundFlight)
    inboundFlightNumber = selectedInboundFlight;
    inboundOrigin = inboundFlight.originAirport;
    inboundDestination = inboundFlight.destinationAirport;
    inboundDestinationCity = inboundFlight.destinationCity;
    inboundOriginCity = inboundFlight.originCity;
    inboundDepartureTime = inboundFlight.departureTime;
    inboundArrivalTime = inboundFlight.arrivalTime;
  }

  //Render the pax-info page according to the type of trip
  if (typeOfTrip == 'round-trip'){
  res.render('pax-info',{
    typeOfTrip:typeOfTrip,
    departDate:departDate,
    formattedDepartDate:dateMgmt.formatDate(departDate),
    returnDate:returnDate,
    formattedReturnDate:dateMgmt.formatDate(returnDate),
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
    formattedDepartDate:dateMgmt.formatDate(departDate),
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

module.exports = router;