const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const passport = require("passport");
const mysql = require("mysql2/promise");
const db = require("../config/db"); // Import MySQL connection pool

// Setting JWT strategy options
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("JWT"), // Extract JWT from auth headers
  secretOrKey: process.env.SECRET || "secret", // Secret key from config
};

// Setting up JWT login strategy for MySQL
const jwtLogin = new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    // ✅ Get a connection from the MySQL pool
    const connection = await db.getConnection();

    // ✅ Query MySQL for the user by ID
    const [rows] = await connection.query(
      "SELECT * FROM users WHERE email = ?",
      [payload.email]
    );

    // ✅ Release the connection back to the pool
    connection.release();

    console.log(payload);
    if (rows.length > 0) {
      return done(null, rows[0]); // ✅ User found
    } else {
      return done(null, false); // ❌ User not found
    }
  } catch (error) {
    console.error("❌ MySQL Error in JWT Strategy:", error);
    return done(error, false);
  }
});

// Use the JWT authentication strategy
passport.use(jwtLogin);
