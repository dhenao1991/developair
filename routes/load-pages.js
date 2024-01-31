//Set up the server
const express = require("express");
const router = express.Router();
const db = require("../data/database");

//Set up the GET routes for loading each page

router.get("/", async function (req, res) {
  const [cities] = await db.query("SELECT id, city FROM airports");
  //console.log([cities]);
  res.render("index", { cities: cities });
});

router.get("/find-booking-form", function (req, res) {
  res.render("find-booking-form");
});

router.get("/destinations", function (req, res) {
  res.render("destinations");
});

module.exports = router;