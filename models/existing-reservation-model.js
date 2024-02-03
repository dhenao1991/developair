const db = require("../data/database");
const dateMgmt = require("../util/date-format-mgmt");

class ExistingReservation {
  constructor(reservationCode) {
    this.reservationCode = reservationCode;
  }
  async getData() {
    //Create query for retrieving reservationData
    const query = `
        SELECT
            R.*,
            FO.originAirport as outboundOrigin, a1.city as outboundOriginCity, a1.name as outboundOriginName,
            FO.destinationAirport as outboundDestination, a2.city as outboundDestinationCity, a2.name as outboundDestinationName,
            time_format(FO.departureTime,'%H:%i') as outboundDepartureTime, time_format(FO.ArrivalTime,'%H:%i') as outboundArrivalTime,
            FI.originAirport as inboundOrigin, a3.city as inboundOriginCity, a3.name as inboundOriginName,
            FI.destinationAirport as inboundDestination, a4.city as inboundDestinationCity, a4.name as inboundDestinationName,
            time_format(FI.departureTime,'%H:%i') as inboundDepartureTime, time_format(FI.ArrivalTime,'%H:%i') as inboundArrivalTime
        FROM reservations R
        JOIN flights FO ON R.outboundFlightNumber = FO.flightNumber AND R.outboundDepartureDate = FO.departureDate
        LEFT JOIN flights FI on R.inboundFlightNumber = FI.flightNumber and R.inboundDepartureDate = FI.departureDate
        JOIN airports a1 on a1.id = FO.originAirport
        JOIN airports a2 on a2.id = FO.destinationAirport
        LEFT JOIN airports a3 on a3.id = FI.originAirport
        LEFT JOIN airports a4 on a4.id = FI.destinationAirport
        WHERE R.reservationCode = ? ;`;
    const [result] = await db.query(query, [this.reservationCode]);
    const reservationData = result[0];
    //Apply the dateFormat function
    reservationData["paxDateOfBirth"] = dateMgmt.formatDate(
      reservationData["paxDateOfBirth"].toISOString().split("T")[0]
    );
    reservationData["outboundDepartureDate"] = dateMgmt.formatDate(
      reservationData["outboundDepartureDate"].toISOString().split("T")[0]
    );
    if (reservationData["inboundDepartureDate"]) {
      reservationData["inboundDepartureDate"] = dateMgmt.formatDate(
        reservationData["inboundDepartureDate"].toISOString().split("T")[0]
      );
    }
    //console.log(reservationData);
    return reservationData;
  }
}

module.exports = ExistingReservation;
