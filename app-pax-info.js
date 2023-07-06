//Variable for the Submit Pax Data Button
let submitPaxDataElement = document.getElementById('submit-pax-data')

//Variables for all input elements
let paxNameElement = document.getElementById('pax-name');
let paxLastNameElement = document.getElementById('pax-last-name');
let paxDateOfBirthElement = document.getElementById('pax-date-of-birth');
let paxEmailElement = document.getElementById('pax-email');
let paxPhoneNumberElement = document.getElementById('pax-phone-number');
let paxCountryElement = document.getElementById('pax-country');

function validatePaxData(){
    //Define variables for the input values
    let paxName = paxNameElement.value;
    let paxLastName = paxLastNameElement.value;
    let paxDateOfBirth = paxDateOfBirthElement.value;
    let paxEmail = paxEmailElement.value;
    let paxPhoneNumber = paxPhoneNumberElement.value;
    let paxCountry = paxCountryElement.value;
    
    //Print the values
    console.log('Pax Name: ' + paxName);
    console.log('Pax Last Name: ' + paxLastName);
    console.log('Pax Date of birth: ' + paxDateOfBirth);
    console.log('Pax Email: ' + paxEmail);
    console.log('Pax Phone number: ' + paxPhoneNumber);
    console.log('Pax Country: ' + paxCountry);
}

submitPaxDataElement.addEventListener('click',validatePaxData);