const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const cors = require("cors");
const dotenv = require("dotenv");
const { globSync } = require("glob");
const path = require("path");
const db = require("./config/db"); // ✅ Import MySQL connection pool
const InitController = require("./Controllers/InitController");

dotenv.config();

const app = express();

// Enable CORS for all origins
app.use(cors({ origin: "*" }));

// Parse JSON bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false, limit: "5mb" }));

// Initialize Passport
app.use(passport.initialize());
require("./config/passport"); // ✅ Ensure passport strategies are loaded

// Start the server inside an async function
(async () => {
  try {
    // ✅ Test MySQL Connection
    const connection = await db.getConnection();
    console.log("✅ Connected to MySQL!");
    connection.release(); // ✅ Release connection back to pool

    // ✅ Initialize database before starting the server
    await InitController(db);
    console.log("✅ Database initialized successfully!");

    // ✅ Dynamically load all routers and pass `db` to them
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

    // ✅ Start the server after initialization
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
