//Variable for the Submit Data Form
let dataForFlightSearchForm = document.querySelector('form');

//Variables for all input elements
let roundTripElement = document.getElementById("round-trip");
let oneWayElement = document.getElementById("one-way");
let originElement = document.getElementById("origin");
let destinationElement = document.getElementById("destination");
let departDateElement = document.getElementById("depart-date");
let returnDateElement = document.getElementById("return-date");
let paxNumberElement = document.getElementById("pax-number");

function checkOriginAndDestination() {
  const origin = originElement.value;
  const destination = destinationElement.value;
  if (origin == destination) {
    originElement.selectedIndex = -1; //El -1 quita la selección
    destinationElement.selectedIndex = -1;
    alert(
      "The origin and the destination cannot be the same. Please change your choices."
    );
  }
}

function hideReturnDateIfOneWay() {
  if (oneWayElement.checked && !roundTripElement.checked) {
    returnDateElement.style.display = "none";
    document.getElementById("return-date-label").style.display = "none";
  } else {
    returnDateElement.style.display = "block";
    document.getElementById("return-date-label").style.display = "block";
    returnDateElement.required = true;
  }
}

function setMinDepartureDateAsToday() {
  let today = new Date().toISOString();
  let length = +today.indexOf("T");
  let todaysDate = today.slice(0, length);
  //alert(todaysDate);
  departDateElement.min = todaysDate;
}

function restrictReturnDate() {
  //Read departureDate
  let departDate = departDateElement.value;
  //Clear the value of the returnDateElement
  returnDateElement.value = "";
  //Set the min attribute of return-date as the departDate
  returnDateElement.min = departDate;
}

function validateSearchData(event) {
  //Define variables for the input values
  let roundTrip = roundTripElement.checked;
  let oneWay = oneWayElement.checked;
  let origin = originElement.value;
  let destination = destinationElement.value;
  let departDate = departDateElement.value;
  let returnDate = returnDateElement.value;
  let paxNumber = paxNumberElement.value;

  //Form validation
  if (
    (roundTrip || oneWay) &&
    origin != "Select an origin" &&
    destination != "Select a destination" &&
    departDate != "" &&
    paxNumber > 0
  ) {
    if (roundTrip && returnDate != "") {
      //Validation successful for roundtrip
      console.log("Validation successful for round-trip");
      console.log("Value of roundTrip: " + roundTrip);
      console.log("Value of oneWay: " + oneWay);
      console.log("The selected origin is: " + origin);
      console.log("The selected destination is: " + destination);
      console.log("The departing date is: " + departDate);
      console.log("The returning date is: " + returnDate);
      console.log("The number of pax is: " + paxNumber);
    } else if (oneWay) {
      // Validation successful for one-way
      console.log("Validation successful for one-way trip");
      console.log("Value of roundTrip: " + roundTrip);
      console.log("Value of oneWay: " + oneWay);
      console.log("The selected origin is: " + origin);
      console.log("The selected destination is: " + destination);
      console.log("The departing date is: " + departDate);
      console.log("The number of pax is: " + paxNumber);
    }
  } else {
    alert("Validation unsuccessful");
    event.preventDefault();
  }
}

//Event listener for setting the minimum departureDate
document.addEventListener("DOMContentLoaded", setMinDepartureDateAsToday);

//Event listeners for enabling/disabling the returnDte
roundTripElement.addEventListener("change", hideReturnDateIfOneWay);
oneWayElement.addEventListener("change", hideReturnDateIfOneWay);

//Event listeners for checking that origin and destination are different
originElement.addEventListener("change", checkOriginAndDestination);
destinationElement.addEventListener("change", checkOriginAndDestination);

//Event listener for restricting the returnDate according to the departDate
departDateElement.addEventListener("change", restrictReturnDate);

//Event listener for form validation
dataForFlightSearchForm.addEventListener("submit",validateSearchData);
