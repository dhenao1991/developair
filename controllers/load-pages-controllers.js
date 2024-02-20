const db = require("../data/database");

async function loadIndex(req, res) {
  const [cities] = await db.query("SELECT id, city FROM airports");
  //console.log([cities]);
  res.render("index", { cities: cities });
}

function loadFindReservationPage(req, res) {
  res.render("find-booking-form");
}

function loadDestinationsPage(req, res) {
  res.render("destinations");
}

function loadSuccessfulPurchasePage(req,res){
  var reservationCode = req.query.valid;
  res.render("successful-purchase", {
    reservationCode: reservationCode,
  });
}

function loadErrorPage(req,res){
  res.render("500")
}

module.exports = {
  loadIndex: loadIndex,
  loadFindReservationPage: loadFindReservationPage,
  loadDestinationsPage: loadDestinationsPage,
  loadSuccessfulPurchasePage:loadSuccessfulPurchasePage,
  loadErrorPage:loadErrorPage
};
