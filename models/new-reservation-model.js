const db = require("../data/database");

//Create query to UPDATE the available seats of the selected flights
const queryUpdateAvailableSeats = `
UPDATE flights SET availableSeats = availableSeats - ? WHERE flightNumber = ? AND departureDate = ?`;

class NewReservation {
  constructor(
    paxName,
    paxLastName,
    paxDateOfBirth,
    paxEmail,
    paxPhone,
    paxCountry,
    reservedSeats,
    outboundFlightNumber,
    outboundDepartureDate,
    inboundFlightNumber,
    inboundDepartureDate
  ) {
    this.paxName = paxName;
    this.paxLastName = paxLastName;
    this.paxDateOfBirth = paxDateOfBirth;
    this.paxEmail = paxEmail;
    this.paxPhone = paxPhone;
    this.paxCountry = paxCountry;
    this.reservedSeats = reservedSeats;
    this.outboundFlightNumber = outboundFlightNumber;
    this.outboundDepartureDate = outboundDepartureDate;
    this.inboundFlightNumber = inboundFlightNumber; //may be undefined
    this.inboundDepartureDate = inboundDepartureDate; //may be undefined
  }

  async createRoundTrip() {
    //Create query to INSERT a record in the database (roundtrip)
    const queryInsertRecordforRoundTrip = `
    INSERT INTO reservations (paxName, paxLastName, paxDateOfBirth, paxEmail, paxPhone, paxCountry, reservedSeats, outboundFlightNumber, outboundDepartureDate, inboundFlightNumber, inboundDepartureDate, creationDate)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,CURRENT_TIMESTAMP)`;
    //Insert record in the database
    await db.query(queryInsertRecordforRoundTrip, [
      this.paxName,
      this.paxLastName,
      this.paxDateOfBirth,
      this.paxEmail,
      this.paxPhone,
      this.paxCountry,
      this.reservedSeats,
      this.outboundFlightNumber,
      this.outboundDepartureDate,
      this.inboundFlightNumber,
      this.inboundDepartureDate,
    ]);
    //Affect capacity for outbound flight
    await db.query(queryUpdateAvailableSeats, [
      this.reservedSeats,
      this.outboundFlightNumber,
      this.outboundDepartureDate,
    ]);
    //Affect capacity for inbound flight
    await db.query(queryUpdateAvailableSeats, [
      this.reservedSeats,
      this.inboundFlightNumber,
      this.inboundDepartureDate,
    ]);
  }
  async createOneWayTrip() {
    //Create query to INSERT a record in the database (one-way)
    const queryInsertRecordforOneWay = `
    INSERT INTO reservations (paxName, paxLastName, paxDateOfBirth, paxEmail, paxPhone, paxCountry, reservedSeats, outboundFlightNumber, outboundDepartureDate, creationDate)
    VALUES (?,?,?,?,?,?,?,?,?,CURRENT_TIMESTAMP)`;
    //Insert record in the database
    await db.query(queryInsertRecordforOneWay, [
      this.paxName,
      this.paxLastName,
      this.paxDateOfBirth,
      this.paxEmail,
      this.paxPhone,
      this.paxCountry,
      this.reservedSeats,
      this.outboundFlightNumber,
      this.outboundDepartureDate,
    ]);
    //Affect capacity for outbound flight
    await db.query(queryUpdateAvailableSeats, [
      this.reservedSeats,
      this.outboundFlightNumber,
      this.outboundDepartureDate,
    ]);
  }

  async getReservationCode() {
    //Create query to SELECT the reservationCode of the created record
    const querySelectReservationCode = `
    SELECT reservationCode FROM reservations WHERE paxEmail = ? AND outboundDepartureDate = ? AND outboundFlightNumber = ?`;
    const [result] = await db.query(querySelectReservationCode, [
      this.paxEmail,
      this.outboundDepartureDate,
      this.outboundFlightNumber,
    ]);
    const reservationCode = result[0].reservationCode;
    //console.log(reservationCode)
    return reservationCode;

  }
}

module.exports = NewReservation;
