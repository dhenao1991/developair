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
const path = require('path');

//Serve all static files
app.use(express.static('public'));

//Set up the routes

app.get('/', function(req,res){
    const htmlFilePath = path.join(__dirname,'views','index.html');
    res.sendFile(htmlFilePath);
});

app.get('/index.html', function(req,res){
    const htmlFilePath = path.join(__dirname,'views','index.html');
    res.sendFile(htmlFilePath);
});

app.get('/flight-search.html', function(req,res){
    const htmlFilePath = path.join(__dirname,'views','flight-search.html');
    res.sendFile(htmlFilePath);
});

app.get('/pax-info.html', function(req,res){
    const htmlFilePath = path.join(__dirname,'views','pax-info.html');
    res.sendFile(htmlFilePath);
});

app.get('/successful-purchase.html', function(req,res){
    const htmlFilePath = path.join(__dirname,'views','successful-purchase.html');
    res.sendFile(htmlFilePath);
});

app.get('/find-booking-form.html', function(req,res){
    const htmlFilePath = path.join(__dirname,'views','find-booking-form.html');
    res.sendFile(htmlFilePath);
});

app.get('/review-booking.html', function(req,res){
    const htmlFilePath = path.join(__dirname,'views','review-booking.html');
    res.sendFile(htmlFilePath);
});

app.get('/destinations.html', function(req,res){
    const htmlFilePath = path.join(__dirname,'views','destinations.html');
    res.sendFile(htmlFilePath);
});

app.listen(3000);