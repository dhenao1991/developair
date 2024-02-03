const db = require("../data/database");

class SearchData {
  constructor(
    departDate,
    origin,
    destination,
    paxNumber,
    selectedOutboundFlight,
    returnDate
  ) {
    (this.departDate = departDate),
      (this.origin = origin),
      (this.destination = destination),
      (this.paxNumber = paxNumber),
      (this.selectedOutboundFlight = selectedOutboundFlight), // may be undefined
      (this.returnDate = returnDate); // may be undefined
  }
  async getAvailableOutboundFlights() {
    //Create a SQL query
    const queryAvailableFlights = `
    SELECT F.flightNumber, F.departureDate, F.originAirport, F.destinationAirport,
    time_format(F.departureTime,'%H:%i') as departureTime,
    time_format(F.arrivalTime,'%H:%i') as arrivalTime,
    A1.city as originCity, A2.city as destinationCity,
    TIME_FORMAT(TIMEDIFF(F.arrivalTime, F.departureTime), '%H:%i') as flightDuration
    FROM flights F JOIN airports A1 ON F.originAirport = A1.id JOIN airports A2 ON F.destinationAirport = A2.id
    WHERE
    departureDate = ? AND
    originAirport = ? AND
    destinationAirport = ? AND
    availableSeats - ?  >= 0
    ORDER BY departureTime;`;
    //Run query for outbound flights
    const [outboundFlights] = await db.query(queryAvailableFlights, [
      this.departDate,
      this.origin,
      this.destination,
      this.paxNumber,
    ]);
    //console.log(outboundFlights)
    return outboundFlights;
  }
  async getAvailableInboundFlights() {
    //Create a SQL query to get return flights without constraints
    const queryAvailableFlightsWithoutConstraints = `
    SELECT F.flightNumber, F.departureDate, F.originAirport, F.destinationAirport,
    time_format(F.departureTime,'%H:%i') as departureTime,
    time_format(F.arrivalTime,'%H:%i') as arrivalTime,
    A1.city as originCity, A2.city as destinationCity,
    TIME_FORMAT(TIMEDIFF(F.arrivalTime, F.departureTime), '%H:%i') as flightDuration
    FROM flights F JOIN airports A1 ON F.originAirport = A1.id JOIN airports A2 ON F.destinationAirport = A2.id
    WHERE
    departureDate = ? AND
    originAirport = ? AND
    destinationAirport = ? AND
    availableSeats - ?  >= 0
    ORDER BY departureTime;`;

    //Create a SQL query to get return flights with constraints
    const queryAvailableFlightsWithConstraints = `
      SELECT F.flightNumber, F.departureDate, F.originAirport, F.destinationAirport,
      time_format(F.departureTime,'%H:%i') as departureTime,
      time_format(F.arrivalTime,'%H:%i') as arrivalTime,
      A1.city as originCity, A2.city as destinationCity,
      TIME_FORMAT(TIMEDIFF(F.arrivalTime, F.departureTime), '%H:%i') as flightDuration
      FROM flights F JOIN airports A1 ON F.originAirport = A1.id JOIN airports A2 ON F.destinationAirport = 	A2.id
      WHERE
      departureDate = ? AND
      departureTime >= ADDTIME((SELECT arrivalTime FROM flights WHERE flightNumber = ? and 	departureDate = ?),'0:45') AND
      originAirport = ? AND
      destinationAirport = ? AND
      availableSeats - ?  >= 0
      ORDER BY departureTime;`;

    //Create inboundFlights object to store the query results
    let inboundFlights;

    //Determine which query will be run
    if (this.departDate != this.returnDate) {
      [inboundFlights] = await db.query(
        queryAvailableFlightsWithoutConstraints,
        [this.returnDate, this.destination, this.origin, this.paxNumber]
      );
    } else if (this.departDate == this.returnDate) {
      [inboundFlights] = await db.query(queryAvailableFlightsWithConstraints, [
        this.returnDate,
        this.selectedOutboundFlight,
        this.departDate,
        this.destination,
        this.origin,
        this.paxNumber,
      ]);
    }
    //console.log(inboundFlights)
    return inboundFlights;
  }
}

module.exports = SearchData;
