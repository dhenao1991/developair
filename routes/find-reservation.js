//Set up the server
const express = require("express");
const router = express.Router();
const ExistingReservation = require('../models/existing-reservation-model');

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
    
    //Render the review-booking page
    res.render("review-booking", { reservationData: reservationData });
  } else {
      res.status('500').render('500')
  }
});

module.exports = router;