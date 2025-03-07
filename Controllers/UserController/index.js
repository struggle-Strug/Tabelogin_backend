const bcrypt = require("bcrypt");

module.exports = (db) => {
  return {
    register: async (req, res) => {
      try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
          return res
            .status(400)
            .json({ message: "メールとパスワードは必須です", error: true });
        }

        // Check if email is already registered
        const [existingUser] = await db.query(
          "SELECT * FROM users WHERE email = ?",
          [email]
        );

        if (existingUser.length > 0) {
          return res
            .status(400)
            .json({ message: "このメールは既に登録されています", error: true });
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert new user into the database
        await db.query(
          "INSERT INTO users (email, password,created_at, updated) VALUES (?, ?, NOW(), NOW())",
          [email, hashedPassword]
        );

        return res
          .status(201)
          .json({ message: "ユーザー登録成功", error: false });
      } catch (error) {
        console.error("登録エラー:", error);
        return res.status(500).json({ message: "サーバーエラー", error: true });
      }
    },
  };
};
