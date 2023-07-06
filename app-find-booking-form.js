//Variable for the Find Reservation Button
let findReservationButtonElement = document.getElementById('find-reservation-button');

//Variables input elements
let reservationCodeElement = document.getElementById('reservation-code');

function validateReservation(){
    //Define variables for the input values
    let reservationCode = reservationCodeElement.value;

    //Print the value
    console.log('The entered reservation code is: ' + reservationCode);
}

findReservationButtonElement.addEventListener('click',validateReservation);