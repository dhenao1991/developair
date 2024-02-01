function formatDate(unformattedDate) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let parts = unformattedDate.split("-");
  const year = +parts[0];
  const month = months[+parts[1] - 1];
  const day = +parts[2];
  return month + " " + day + ", " + year;
}

module.exports = {formatDate:formatDate};