module.exports = (db) => {
  return {
    save: async (req, res) => {
      try {
        const { user_id, title, content } = req.body;

        const insertQuery = `
            INSERT INTO contents (user_id, title, content, created_at, updated)
            VALUES (?, ?, ?, NOW(), NOW())
          `;
        const [result] = await db.query(insertQuery, [user_id, title, content]);

        const insertedId = result.insertId;

        const [rows] = await db.query(`SELECT * FROM contents WHERE id = ?`, [
          insertedId,
        ]);

        return res.json({
          message: "保存成功",
          content: rows[0], // Return the newly saved content
        });
      } catch (error) {
        console.error("エラー:", error);
        return res.status(500).json({
          message: "サーバーエラー",
          error: true,
        });
      }
    },
  };
};
