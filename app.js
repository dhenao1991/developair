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

//Set up the GET routes for loading each page

app.get('/', function(req,res){
    //Old way
    //const htmlFilePath = path.join(__dirname,'views','index.html');
    //res.sendFile(htmlFilePath);
    //New way
    res.render('index');
});

app.get('/flight-search', function(req,res){
    const filePath = path.join(__dirname,'data','flight-search-data.json');
    const fileData = fs.readFileSync(filePath);
    const entireFlightSearchData = JSON.parse(fileData)
    const lastFlightSearchData = entireFlightSearchData[entireFlightSearchData.length-1]
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
    const filePath = path.join(__dirname,'data','flight-search-data.json');
    const fileData = fs.readFileSync(filePath);
    const storedFlightSearchData = JSON.parse(fileData);
    storedFlightSearchData.push(flightSearchData);
    fs.writeFileSync(filePath,JSON.stringify(storedFlightSearchData));
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
    const filePath = path.join(__dirname,'data','pax-data-for-reservation.json');
    const fileData = fs.readFileSync(filePath);
    const storedPaxDataForReservation = JSON.parse(fileData);
    storedPaxDataForReservation.push(paxDataForReservation);
    fs.writeFileSync(filePath,JSON.stringify(storedPaxDataForReservation));
    //Redirecting to the next page
    res.redirect('/successful-purchase')
});

app.post('/find-existing-booking',function(req,res){
    //Definition of variables submitted in the form
    const reservationCode = +req.body['reservation-code'];
    //The data validation should come here
    //Storing the information in a file
    const currentReservationCode = req.body;
    const filePath = path.join(__dirname,'data','submitted-reservation-code.json');
    const fileData = fs.readFileSync(filePath);
    const storedReservationCode = JSON.parse(fileData);
    storedReservationCode.push(currentReservationCode);
    fs.writeFileSync(filePath,JSON.stringify(storedReservationCode));
    //Redirecting to the next page
    res.redirect('/review-booking')
});

app.listen(3000);