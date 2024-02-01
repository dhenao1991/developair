//Set up the server
const express = require("express");
const router = express.Router();
const db = require("../data/database");
const dateMgmt = require("../util/date-format-mgmt");

//Set up POST routes for processing form submissions

//Find existing reservation
router.post("/find-existing-booking", async function (req, res) {
  //Definition of variables submitted in the form
  const reservationCode = +req.body["reservation-code"];
  //console.log(reservationCode);
  //Data validation and SQL query
  if (reservationCode >= 123456) {
    const query = `
        SELECT
            R.*,
            FO.originAirport as outboundOrigin, a1.city as outboundOriginCity, a1.name as outboundOriginName,
            FO.destinationAirport as outboundDestination, a2.city as outboundDestinationCity, a2.name as outboundDestinationName,
            time_format(FO.departureTime,'%H:%i') as outboundDepartureTime, time_format(FO.ArrivalTime,'%H:%i') as outboundArrivalTime,
            FI.originAirport as inboundOrigin, a3.city as inboundOriginCity, a3.name as inboundOriginName,
            FI.destinationAirport as inboundDestination, a4.city as inboundDestinationCity, a4.name as inboundDestinationName,
            time_format(FI.departureTime,'%H:%i') as inboundDepartureTime, time_format(FI.ArrivalTime,'%H:%i') as inboundArrivalTime
        FROM reservations R
        JOIN flights FO ON R.outboundFlightNumber = FO.flightNumber AND R.outboundDepartureDate = FO.departureDate
        LEFT JOIN flights FI on R.inboundFlightNumber = FI.flightNumber and R.inboundDepartureDate = FI.departureDate
        JOIN airports a1 on a1.id = FO.originAirport
        JOIN airports a2 on a2.id = FO.destinationAirport
        LEFT JOIN airports a3 on a3.id = FI.originAirport
        LEFT JOIN airports a4 on a4.id = FI.destinationAirport
        WHERE R.reservationCode = ? ;`;
    const [reservationData] = await db.query(query, [reservationCode]);
    //Apply the dateFormat function
    [reservationData][0][0]['paxDateOfBirth'] = dateMgmt.formatDate([reservationData][0][0]['paxDateOfBirth'].toISOString().split('T')[0]);
    [reservationData][0][0]['outboundDepartureDate'] = dateMgmt.formatDate([reservationData][0][0]['outboundDepartureDate'].toISOString().split('T')[0]);
    if ([reservationData][0][0]['inboundDepartureDate']){
      [reservationData][0][0]['inboundDepartureDate'] = dateMgmt.formatDate([reservationData][0][0]['inboundDepartureDate'].toISOString().split('T')[0]);
    }
    console.log([reservationData[0]])
    //Render the review-booking page
    res.render("review-booking", { reservationData: reservationData[0] });
  } else {
    //res.status('500').render('500')
  }
});

module.exports = router;