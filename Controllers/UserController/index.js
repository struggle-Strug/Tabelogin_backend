const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

        const token = jwt.sign(
          { email: email },
          process.env.SECRET || "secret",
          {
            expiresIn: "30d",
          }
        );

        return res
          .status(201)
          .json({ message: "ユーザー登録成功", token: `JWT ${token}` });
      } catch (error) {
        console.error("登録エラー:", error);
        return res.status(500).json({ message: "サーバーエラー", error: true });
      }
    },

    update: async (req, res) => {
      try {
        const { name, introduction, birthday } = req.body;
        const userId = req.user.id;
        console.log(req.body);

        // Update user information in the database
        await db.query(
          "UPDATE users SET name = ?, introduce = ?, birthday = ?, updated = NOW() WHERE id = ?",
          [name, introduction, birthday, userId]
        );

        return res
          .status(200)
          .json({ message: "ユーザー情報更新成功", error: false });
      } catch (error) {
        console.error("更新エラー:", error);
        return res.status(500).json({ message: "サーバーエラー", error: true });
      }
    },

    tokenlogin: async (req, res) => {
      try {
        const token = jwt.sign(
          { id: req.user._id },
          process.env.SECRET || "secret",
          {
            expiresIn: "30d",
          }
        );
        return res.status(200).json({
          message: "ログイン成功!",
          token: `JWT ${token}`,
          user: req.user,
        });
      } catch (err) {
        res.status(400).json({ message: err.message });
      }
    },
  };
};
