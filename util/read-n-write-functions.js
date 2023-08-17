const path = require("path"); //path --> for creating paths for files
const fs = require("fs"); //file system --> for storing data

function getFlightSearchData() {
  const filePath = path.join(__dirname,'..', "data", "flight-search-data.json");
  const fileData = fs.readFileSync(filePath);
  const entireFlightSearchData = JSON.parse(fileData);
  const lastFlightSearchData = entireFlightSearchData[entireFlightSearchData.length - 1];
  return lastFlightSearchData;
}

function storeFlightSearchData(flightSearchData){
    const filePath = path.join(__dirname,'..','data','flight-search-data.json');
    const fileData = fs.readFileSync(filePath);
    const storedFlightSearchData = JSON.parse(fileData);
    storedFlightSearchData.push(flightSearchData);
    fs.writeFileSync(filePath,JSON.stringify(storedFlightSearchData));
}

function storePaxDataForReservation(paxDataForReservation){
    const filePath = path.join(__dirname,'..','data','pax-data-for-reservation.json');
    const fileData = fs.readFileSync(filePath);
    const storedPaxDataForReservation = JSON.parse(fileData);
    storedPaxDataForReservation.push(paxDataForReservation);
    fs.writeFileSync(filePath,JSON.stringify(storedPaxDataForReservation));
}

function storeSubmittedReservationCode(submittedReservationCode){
    const filePath = path.join(__dirname,'..','data','submitted-reservation-code.json');
    const fileData = fs.readFileSync(filePath);
    const storedReservationCode = JSON.parse(fileData);
    storedReservationCode.push(submittedReservationCode);
    fs.writeFileSync(filePath,JSON.stringify(storedReservationCode));
}

module.exports = {
    getFlightSearchData:getFlightSearchData,
    storeFlightSearchData:storeFlightSearchData,
    storePaxDataForReservation:storePaxDataForReservation,
    storeSubmittedReservationCode:storeSubmittedReservationCode
};