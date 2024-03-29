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

//Require the routes
const ajaxRoutes = require('./routes/ajax');
const createReservationRoutes = require('./routes/create-reservation');
const findReservationRoutes = require('./routes/find-reservation');
const loadPagesRoutes = require('./routes/load-pages');
const paxInfoRoutes = require('./routes/pax-info');
const searchFlightsRoutes = require('./routes/search-flights');

//Serve all static files
app.use(express.static('public'));

//Middleware for parsing url-encoded data
app.use(express.urlencoded({extended:false}));

//Indicate that we will be using EJS templates
app.set('views',path.join(__dirname,'views'));
app.set('view engine', 'ejs');

//Use the routes
app.use('/', ajaxRoutes);
app.use('/', createReservationRoutes);
app.use('/', findReservationRoutes);
app.use('/', loadPagesRoutes);
app.use('/', paxInfoRoutes);
app.use('/', searchFlightsRoutes);

//every request that starts with / is handled by the routes
//The '/' is a filter for initial characters of routes 

//Here we will add a middleware for the 404 status
app.use(function(req,res){
    res.status(404).render('404');
});

//And here we'll have a middleware for the 500 status
app.use(function(error,req,res,next){
    res.status(500).render('500');
});

app.listen(3000);