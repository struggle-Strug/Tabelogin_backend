const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const { globSync } = require("glob");
const path = require("path");
const mysql = require("mysql2/promise"); // Use mysql2 with promises
const InitController = require("./Controllers/InitController");

dotenv.config();

const app = express();

// Enable CORS for all origins
app.use(cors({ origin: "*" }));

// Parse JSON bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false, limit: "5mb" }));

// Start the server inside an async function
(async () => {
  try {
    // Create MySQL database connection
    const db = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "tabelogin",
    });

    console.log("✅ Connected to MySQL!");

    // Initialize the database before starting the server
    await InitController(db);
    console.log("✅ Database initialized successfully!");

    // Dynamically load all routers and pass `db` to them
    const routes = globSync("./Routers/*Router.js");

    routes.forEach((file) => {
      const router = require(path.resolve(file));

      if (typeof router === "function") {
        const routeName = path
          .basename(file, ".js")
          .toLowerCase()
          .replace("router", "");
        app.use(`${process.env.API_PREFIX}/${routeName}`, router(db));
      } else {
        console.warn(`⚠️ Skipping router ${file}: Not a valid Express router.`);
      }
    });

    // Start the server after initialization
    const PORT = process.env.PORT || 7000;
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error(
      "❌ Failed to initialize the database. Server not started.",
      error
    );
    process.exit(1);
  }
})();
