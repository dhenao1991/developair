const stripe = require('stripe')('Private key here');
const NewReservation = require("../models/new-reservation-model");

async function submitPaxDataAndCreateReservation(req, res) {
  //Definition of variables submitted in the form
  const paxName = req.body["pax-name"];
  const paxLastName = req.body["pax-last-name"];
  const paxDateOfBirth = req.body["pax-date-of-birth"];
  const paxEmail = req.body["pax-email"];
  const paxPhoneNumber = req.body["pax-phone-number"];
  const paxCountry = req.body["pax-country"];
  const paxCreditCardInfo = "Nothing yet";
  const typeOfTrip = req.body.typeOfTrip;
  const outboundFlightNumber = +req.body.outboundFlightNumber;
  const departDate = req.body.departDate;
  const paxNumber = +req.body.paxNumber;
  let inboundFlightNumber;
  let returnDate;
  if (typeOfTrip == "round-trip") {
    inboundFlightNumber = +req.body.inboundFlightNumber;
    returnDate = req.body.returnDate;
  }

  let newReservation;
  if (typeOfTrip == "round-trip") {
    //Create blueprint of newReservation and run the createRoundTrip method
    newReservation = new NewReservation(
      paxName,
      paxLastName,
      paxDateOfBirth,
      paxEmail,
      paxPhoneNumber,
      paxCountry,
      paxNumber,
      outboundFlightNumber,
      departDate,
      inboundFlightNumber,
      returnDate
    );
    await newReservation.createRoundTrip();
  } else {
    //Create blueprint of newReservation and run the createOneWayTrip method
    newReservation = new NewReservation(
      paxName,
      paxLastName,
      paxDateOfBirth,
      paxEmail,
      paxPhoneNumber,
      paxCountry,
      paxNumber,
      outboundFlightNumber,
      departDate
    );
    await newReservation.createOneWayTrip();
  }

  //Get reservation code of the newly created reservation
  const reservationCode = await newReservation.getReservationCode();

  //Encode the reservation code
  let encodedReservationCode = encodeURIComponent(reservationCode);

  //Involve stripe
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Air ticket",
            },
            unit_amount_decimal: 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:3000/successful-purchase?valid=" +
        encodedReservationCode,
      cancel_url: "http://localhost:3000/error",
    });
    res.redirect(303, session.url);
  } catch (error) {
    //Redirecting to the successful purchase page
    res.redirect("/successful-purchase?valid=" + encodedReservationCode);
  }
}

module.exports = {
  submitPaxDataAndCreateReservation: submitPaxDataAndCreateReservation,
};
