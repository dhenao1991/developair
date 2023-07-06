//Variable for the Submit Data Button
let submitDataForFlightSearchButtonElement = document.getElementById('submit-data-for-flight-search');

//Variables for all input elements
let roundTripElement = document.getElementById('round-trip');
let oneWayElement = document.getElementById('one-way');
let originElement = document.getElementById('origin');
let destinationElement = document.getElementById('destination');
let departDateElement = document.getElementById('depart-date');
let returnDateElement = document.getElementById('return-date');
let paxNumberElement = document.getElementById('pax-number');

function validateSearchData(){
    //Define variables for the input values
    let roundTrip = roundTripElement.checked;
    let oneWay = oneWayElement.checked;
    let origin = originElement.value;
    let destination = destinationElement.value;
    let departDate = departDateElement.value;
    let returnDate = returnDateElement.value;
    let paxNumber = paxNumberElement.value;

    //Print the values
    console.log('Value of roundTrip: ' + roundTrip);
    console.log('Value of oneWay: ' + oneWay);
    console.log('The selected origin is: ' + origin);
    console.log('The selected destination is: ' + destination);
    console.log('The departing date is: ' + departDate);
    console.log('The returning date is: ' + returnDate);
    console.log('The number of pax is: ' + paxNumber);

}

submitDataForFlightSearchButtonElement.addEventListener('click',validateSearchData);