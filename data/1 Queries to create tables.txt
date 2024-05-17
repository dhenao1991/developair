-- Queries to create the tables: airports, flights and reservations

CREATE TABLE `airports` (
  `id` char(3) NOT NULL,
  `city` varchar(100) NOT NULL,
  `name` varchar(1000) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Table of airports';

CREATE TABLE `flights` (
  `flightNumber` int NOT NULL,
  `departureDate` date NOT NULL,
  `originAirport` char(3) NOT NULL,
  `destinationAirport` char(3) NOT NULL,
  `departureTime` time NOT NULL,
  `arrivalTime` time NOT NULL,
  `availableSeats` int NOT NULL,
  PRIMARY KEY (`flightNumber`,`departureDate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Table of flights';

CREATE TABLE `reservations` (
  `reservationCode` int NOT NULL AUTO_INCREMENT,
  `paxName` varchar(45) NOT NULL,
  `paxLastName` varchar(45) NOT NULL,
  `paxDateOfBirth` date NOT NULL,
  `paxEmail` varchar(45) NOT NULL,
  `paxPhone` bigint DEFAULT NULL,
  `paxCountry` varchar(45) NOT NULL,
  `reservedSeats` int NOT NULL,
  `outboundFlightNumber` int NOT NULL,
  `outboundDepartureDate` date NOT NULL,
  `inboundFlightNumber` int DEFAULT NULL,
  `inboundDepartureDate` date DEFAULT NULL,
  `creationDate` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`reservationCode`)
) ENGINE=InnoDB AUTO_INCREMENT=123456 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Table of reservations';