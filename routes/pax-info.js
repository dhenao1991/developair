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
    departDate:dateMgmt.formatDate(departDate),
    returnDate:dateMgmt.formatDate(returnDate),
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
    departDate:dateMgmt.formatDate(departDate),
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