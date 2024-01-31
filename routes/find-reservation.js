//Set up the server
const express = require("express");
const router = express.Router();
const db = require("../data/database");

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