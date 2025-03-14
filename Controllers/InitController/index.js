module.exports = async (db) => {
  try {
    await db.query(`
          CREATE TABLE IF NOT EXISTS users (
              id INT PRIMARY KEY AUTO_INCREMENT,
              name VARCHAR(255) DEFAULT NULL,
              email VARCHAR(255) UNIQUE NOT NULL,
              password VARCHAR(255) NOT NULL,
              sex VARCHAR(255) DEFAULT NULL,
              birthday VARCHAR(255) DEFAULT NULL,
              introduce VARCHAR(255) DEFAULT NULL,
              image VARCHAR(255) DEFAULT NULL,
              updated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          );`);

    await db.query(`
          CREATE TABLE IF NOT EXISTS shops (
              id INT PRIMARY KEY AUTO_INCREMENT,
              user_id INT NOT NULL,
              date VARCHAR(255) DEFAULT NULL,
              start_time VARCHAR(255) DEFAULT NULL,
              end_time VARCHAR(255) DEFAULT NULL,
              content VARCHAR(255) DEFAULT NULL,
              remarks VARCHAR(255) DEFAULT NULL,
              updated DATE DEFAULT (CURRENT_DATE),
              created_at DATE DEFAULT (CURRENT_DATE),
              FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
          );`);

    await db.query(`
          CREATE TABLE IF NOT EXISTS schedules (
              id INT PRIMARY KEY AUTO_INCREMENT,
              user_id INT NOT NULL,
              content VARCHAR(255) DEFAULT NULL,
              updated DATE DEFAULT (CURRENT_DATE),
              created_at DATE DEFAULT (CURRENT_DATE),
              FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
          );`);

    await db.query(`
          CREATE TABLE IF NOT EXISTS messages (
              id INT PRIMARY KEY AUTO_INCREMENT,
              user_id INT NOT NULL,
              is_ai BOOLEAN DEFAULT 0,
              message VARCHAR(255) DEFAULT NULL,
              updated DATE DEFAULT (CURRENT_DATE),
              created_at DATE DEFAULT (CURRENT_DATE),
              FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
          );`);

    await db.query(`
          CREATE TABLE IF NOT EXISTS roles (
              id INT PRIMARY KEY AUTO_INCREMENT,
              name VARCHAR(255) DEFAULT NULL UNIQUE,
              updated DATE DEFAULT (CURRENT_DATE),
              created_at DATE DEFAULT (CURRENT_DATE)
          );`);

    await db.query(`
          CREATE TABLE IF NOT EXISTS contracts (
              id INT PRIMARY KEY AUTO_INCREMENT,
              name VARCHAR(255) DEFAULT NULL UNIQUE,
              updated DATE DEFAULT (CURRENT_DATE),
              created_at DATE DEFAULT (CURRENT_DATE)
          );`);

    console.log("✅ Tables created successfully.");
  } catch (error) {
    console.error("❌ MySQL Error:", error);
    throw error; // Ensure that the server does not start if database initialization fails
  }
};
