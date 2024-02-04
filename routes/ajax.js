//Set up the server
const express = require("express");
const router = express.Router();
const ajaxControllers = require('../controllers/ajax-controllers');

router.get("/updatedestinations/:origin", ajaxControllers.getDestinationsForGivenOrigin);

module.exports = router;