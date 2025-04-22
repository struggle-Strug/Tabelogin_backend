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
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS shops (
        id INT PRIMARY KEY AUTO_INCREMENT,
        address VARCHAR(255) DEFAULT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        introduce VARCHAR(255) DEFAULT NULL,
        name VARCHAR(255) DEFAULT NULL,
        password VARCHAR(255) NOT NULL,
        updated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS contents (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        title VARCHAR(255) DEFAULT NULL,
        content VARCHAR(255) DEFAULT NULL,
        updated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS content_images (
        id INT PRIMARY KEY AUTO_INCREMENT,
        content_id INT NOT NULL,
        image_url VARCHAR(255) DEFAULT NULL,
        updated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (content_id) REFERENCES contents(id) ON DELETE CASCADE
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS users_mappings (
        id INT PRIMARY KEY AUTO_INCREMENT,
        follow_id INT NOT NULL,
        follower_id INT NOT NULL,
        updated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (follow_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS users_shop_mappings (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        shop_id INT NOT NULL,
        updated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE
      );
    `);

    console.log("✅ Tables created successfully.");
  } catch (error) {
    console.error("❌ MySQL Error:", error);
    throw error;
  }
};
