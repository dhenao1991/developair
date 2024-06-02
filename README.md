# DevelopAir

## What is DevelopAir?

DevelopAir is a personal project where I combined my passion for the airline industry with my interest in learning how to build basic web pages that interact with databases. The frontend of the project was built using pure HTML, CSS, and JavaScript. The backend was built with Node.js and several libraries that interact with a relational database created in MySQL.

In the DevelopAir project, I simulate the process of booking an air ticket for a fictional airline. This involves defining an origin, a destination, travel dates, and the number of passengers. Once these parameters have been submitted, the database returns the available flights that the user can select, following specific business logic. After the user selects the desired flights and submits their information, a reservation is created, some capacity is subtracted from the selected flights, and a reservation code is generated and shown to the customer. Using this reservation code, the customer can query the reservation details. For simplicity, the process of buying a ticket involves no monetary charges. As a final touch, the project includes a static page that shows a list of the airline's fictional destinations.

## Prerequisites

Before cloning or downloading the repository, please make sure to have installed in your device the following programs:

- Node.js (I have the v20.12.2). You can download it from [here](https://nodejs.org/en/download/package-manager).
- MySQL, including both the Workbench and the database engine. You can download it from [here](https://dev.mysql.com/downloads/installer/). During the installation process of MySQL, you will be asked to set a password for allowing an external source to interact with your database. Don’t forget that password, as you will need it later. I used `12345678`.

## Getting starting with DevelopAir

Follow these steps to get started with DevelopAir in your local environment:
1.	Clone or download this project:
    ```
    git clone https://github.com/dhenao1991/developair.git
    ```
1.  Open the MySQL Workbench and create a schema (a database). You’ll be asked to name it. Do not forget the name you choose, as you will need it later. I used `developair`.
1. Open the IDE of your preference (I used Visual Studio Code) and, in the cloned or downloaded repository, go to `data/database.js` and make sure that in the `pool` object (found in line 3), the value of `database` is the name of the database you chose, and the value of `password` is the same you created in the earlier steps.
1.	Go back to MySQL and run the commands found in the file `data/1 Queries to create tables.sql`. These commands will create the tables in the database.
1.	Run the commands found in the file `data/2 Queries to insert values to tables.sql`. These commands will populate the tables with the initial information about airports and flights.
1.	Go back to the the IDE and, in the command window, type `npm install`. This command will install all the libraries and modules that the code depends on.
1.	Type `npm start`. This command will start the server on your local machine.
1.	Open the browser of your preference (I use Google Chrome) and navigate to <http://localhost:3000>. This will take you to the landing page of DevelopAir.

> Please keep in mind that the flights contained in the sql file span from July 1 to July 7, 2024.
