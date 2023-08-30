const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  database: "developair",
  user: "root",
  password: "12345678",
});

module.exports = pool;