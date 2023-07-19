//Variable for the Find Reservation Form
let findReservationForm = document.querySelector('form');

//Variables input elements
let reservationCodeElement = document.getElementById('reservation-code');

function validateReservation(event){
    //Define variables for the input values
    let reservationCode = +reservationCodeElement.value;

    //Perform validation
    if(reservationCode >= 100000){
        //Validation successful
        console.log('Validation successful')
        //Show the reservation code
        console.log('The entered reservation code is: ' + reservationCode);
    } else {
        alert("Validation unsuccessful");
        event.preventDefault();
    }

}

//Event listener for validating the reservation code
findReservationForm.addEventListener('submit',validateReservation);