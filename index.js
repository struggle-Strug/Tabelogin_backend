const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const { globSync } = require("glob");
const path = require("path");
const mysql = require("mysql2");

dotenv.config();

const app = express();

// Enable CORS for all origins
app.use(cors({ origin: "*" }));

// Parse JSON bodies
app.use(bodyParser.json({})); // Send JSON responses
app.use(bodyParser.urlencoded({ extended: false, limit: "5mb" })); // Parses URL-encoded bodies

// Create MySQL database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "tabelogin",
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err.message);
    process.exit(1);
  } else {
    console.log("Connected to MySQL!");
  }
});

// Dynamically load all routers and pass `db` to them
const routes = globSync("./routers/*Router.js"); // Adjust the path as necessary

routes.forEach((file) => {
  const router = require(path.resolve(file)); // Import the router
  const routeName = path
    .basename(file, ".js")
    .toLowerCase()
    .replace("router", "");
  app.use(`${process.env.API_PREFIX || "/api"}/${routeName}`, router(db)); // Pass `db` to the router
});

// Start the server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
