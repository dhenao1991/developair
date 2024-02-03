//Set up the server
const express = require("express");
const router = express.Router();
const ExistingReservation = require('../models/existing-reservation-model');
const dateMgmt = require("../util/date-format-mgmt");

//Set up POST routes for processing form submissions

//Find existing reservation
router.post("/find-existing-booking", async function (req, res) {
  //Definition of variables submitted in the form
  const reservationCode = +req.body["reservation-code"];
  //console.log(reservationCode);
  //Data validation and SQL query
  if (reservationCode >= 123456) {
    const reservation = new ExistingReservation(reservationCode);
    const reservationData = await reservation.getData();
    //Apply the dateFormat function
    reservationData['paxDateOfBirth'] = dateMgmt.formatDate(reservationData['paxDateOfBirth'].toISOString().split('T')[0]);
    reservationData['outboundDepartureDate'] = dateMgmt.formatDate(reservationData['outboundDepartureDate'].toISOString().split('T')[0]);
    if (reservationData['inboundDepartureDate']){
      reservationData['inboundDepartureDate'] = dateMgmt.formatDate(reservationData['inboundDepartureDate'].toISOString().split('T')[0]);
    }
    //Render the review-booking page
    res.render("review-booking", { reservationData: reservationData });
  } else {
      res.status('500').render('500')
  }
});

module.exports = router;