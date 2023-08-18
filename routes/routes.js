//Set up the server
const express = require('express');
const router = express.Router();

//Require modules from external files
const readNWritefunctions = require('../util/read-n-write-functions');

//Set up the GET routes for loading each page

router.get('/', function(req,res){
    //Old way
    //const htmlFilePath = path.join(__dirname,'views','index.html');
    //res.sendFile(htmlFilePath);
    //New way
    res.render('index');
});

router.get('/flight-search', function(req,res){
    //Load flight search data
    const lastFlightSearchData = readNWritefunctions.getFlightSearchData();
    console.log(lastFlightSearchData);
    const origin = lastFlightSearchData.origin;
    const destination = lastFlightSearchData.destination;
    const departDate = lastFlightSearchData['depart-date'];
    const returnDate = lastFlightSearchData['return-date'];
    res.render('flight-search',{
        origin:origin,
        destination:destination,
        departDate:departDate,
        returnDate:returnDate
    });
});

router.get('/pax-info', function(req,res){
   res.render('pax-info');
});

router.get('/successful-purchase', function(req,res){
    res.render('successful-purchase');
});

router.get('/find-booking-form', function(req,res){
    res.render('find-booking-form');
});

router.get('/review-booking', function(req,res){
    res.render('review-booking');
});

router.get('/destinations', function(req,res){
    res.render('destinations');
});

//Set up POST routes for processing form submissions
router.post('/submit-flight-data-information',function(req,res){
    //Definition of variables submitted in the form
    const typeOfTrip = req.body['type-of-trip'];
    const origin = req.body.origin;
    const destination = req.body.destination;
    const departDate = req.body['depart-date'];
    const returnDate = req.body['return-date'];
    const paxNumber = +req.body['pax-number'];
    //The data validation should come here
    //Storing the information in a file
    const flightSearchData = req.body;
    readNWritefunctions.storeFlightSearchData(flightSearchData);
    //Redirecting to the next page
    res.redirect('/flight-search')
});

router.post('/submit-pax-data-for-reservation',function(req,res){
    //Definition of variables submitted in the form
    const paxName = req.body['pax-name'];
    const paxLastName = req.body['pax-last-name'];
    const paxDateOfBirth = req.body['pax-date-of-birth'];
    const paxEmail = req.body['pax-email'];
    const paxPhoneNumber = req.body['pax-phone-number'];
    const paxCountry = req.body['pax-country']
    const paxCreditCardInfo = 'Nothing yet';
    //The data validation should come here
    //Storing the information in a file
    const paxDataForReservation = req.body;
    readNWritefunctions.storePaxDataForReservation(paxDataForReservation);
    //Redirecting to the next page
    res.redirect('/successful-purchase')
});

router.post('/find-existing-booking',function(req,res){
    //Definition of variables submitted in the form
    const reservationCode = +req.body['reservation-code'];
    //The data validation should come here
    //Storing the information in a file
    const submittedReservationCode = req.body;
    readNWritefunctions.storeSubmittedReservationCode(submittedReservationCode);
    //Redirecting to the next page
    res.redirect('/review-booking')
});

module.exports = router;