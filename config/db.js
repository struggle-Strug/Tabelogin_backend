const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "tabelogin",
  waitForConnections: true,
  connectionLimit: 10, // ✅ Allows up to 10 simultaneous connections
  queueLimit: 0,
});

module.exports = pool;
