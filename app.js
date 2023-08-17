/*This code here is fake, in order to test the correct creation of a server

const express = require("express");

const app = express();

app.get("/", function (req, res) {
  res.send("<h1>Hello World!</h1>");
});

app.listen(3000);

*/

//Set up the server
const express = require('express');
const app = express();
const path = require('path'); //path --> for creating paths for files
const fs = require('fs') //file system --> for storing data

//Serve all static files
app.use(express.static('public'));

//Middleware for parsing url-encoded data
app.use(express.urlencoded({extended:false}));

//Indicate that we will be using EJS templates
app.set('views',path.join(__dirname,'views'));
app.set('view engine', 'ejs');

//Require modules from external files
const readNWritefunctions = require('./util/read-n-write-functions');

//Set up the GET routes for loading each page

app.get('/', function(req,res){
    //Old way
    //const htmlFilePath = path.join(__dirname,'views','index.html');
    //res.sendFile(htmlFilePath);
    //New way
    res.render('index');
});

app.get('/flight-search', function(req,res){
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

app.get('/pax-info', function(req,res){
   res.render('pax-info');
});

app.get('/successful-purchase', function(req,res){
    res.render('successful-purchase');
});

app.get('/find-booking-form', function(req,res){
    res.render('find-booking-form');
});

app.get('/review-booking', function(req,res){
    res.render('review-booking');
});

app.get('/destinations', function(req,res){
    res.render('destinations');
});

//Set up POST routes for processing form submissions
app.post('/submit-flight-data-information',function(req,res){
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

app.post('/submit-pax-data-for-reservation',function(req,res){
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

app.post('/find-existing-booking',function(req,res){
    //Definition of variables submitted in the form
    const reservationCode = +req.body['reservation-code'];
    //The data validation should come here
    //Storing the information in a file
    const submittedReservationCode = req.body;
    readNWritefunctions.storeSubmittedReservationCode(submittedReservationCode);
    //Redirecting to the next page
    res.redirect('/review-booking')
});

//Here we will add a middleware for the 404 status
app.use(function(req,res){
    res.status(404).render('404');
});

//And here we'll have a middleware for the 500 status
app.use(function(error,req,res,next){
    res.status(500).render('500');
});

app.listen(3000);