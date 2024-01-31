//Set up the server
const express = require("express");
const router = express.Router();
const db = require("../data/database");

router.get("/updatedestinations/:origin", async function (req, res) {
  const origin = req.params.origin;
  //console.log(origin);
  const queryDestinationsForGivenOrigin = `
    SELECT DISTINCT F.destinationAirport as airport, A.city as city
    FROM flights F
    LEFT JOIN airports A ON F.destinationAirport = A.id
    WHERE F.originAirport = ? 
    ORDER BY F.destinationAirport;
    `;
  //Run query for feasible destinations given an origin
  const [destinations] = await db.query(queryDestinationsForGivenOrigin, [
    origin,
  ]);
  //console.log(destinations);
  res.json(destinations);
});

module.exports = router;