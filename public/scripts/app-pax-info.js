//Variable for the Submit Pax Data Form
let paxDataForm = document.querySelector('form');

//Variables for all input elements
let paxNameElement = document.getElementById("pax-name");
let paxLastNameElement = document.getElementById("pax-last-name");
let paxDateOfBirthElement = document.getElementById("pax-date-of-birth");
let paxEmailElement = document.getElementById("pax-email");
let paxPhoneNumberElement = document.getElementById("pax-phone-number");
let paxCountryElement = document.getElementById("pax-country");

function setMaxpaxDateOfBirthAsToday() {
  let today = new Date().toISOString();
  let length = +today.indexOf("T");
  let todaysDate = today.slice(0, length);
  //alert(todaysDate);
  paxDateOfBirthElement.max = todaysDate;
}

function validatePaxData(event) {
  //Define variables for the input values and trim the text variables
  let paxName = paxNameElement.value.trim();
  let paxLastName = paxLastNameElement.value.trim();
  let paxDateOfBirth = paxDateOfBirthElement.value;
  let paxEmail = paxEmailElement.value.trim();
  let paxPhoneNumber = paxPhoneNumberElement.value.trim();
  let paxCountry = paxCountryElement.value.trim();

  //Calculate today's date
  let today = new Date().toISOString();
  let length = +today.indexOf("T");
  let todaysDate = today.slice(0, length);
  //alert(todaysDate);

  //Form validation
  if (
    paxName &&
    paxLastName &&
    paxDateOfBirth <= todaysDate &&
    paxEmail.includes("@") &&
    paxPhoneNumber.length >= 7 &&
    paxCountry
  ) {
    //Validation successful
    console.log("Validation successful");
    console.log("Pax Name: " + paxName);
    console.log("Pax Last Name: " + paxLastName);
    console.log("Pax Date of birth: " + paxDateOfBirth);
    console.log("Pax Email: " + paxEmail);
    console.log("Pax Phone number: " + paxPhoneNumber);
    console.log("Pax Country: " + paxCountry);
  } else {
    alert("Validation unsuccessful");
    event.preventDefault();
  }
}

//Event listener for setting the maximum pax date of birth
document.addEventListener("DOMContentLoaded", setMaxpaxDateOfBirthAsToday);

//Event listener for setting the validating the pax data
paxDataForm.addEventListener("submit", validatePaxData);