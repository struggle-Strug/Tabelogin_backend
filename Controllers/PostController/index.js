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

    getPosts: async (req, res) => {
      try {
        const [rows] = await db.query(`
          SELECT 
            contents.id AS content_id,
            contents.title,
            contents.content,
            contents.created_at AS content_created_at,
            users.id AS user_id,
            users.name AS user_name,
            users.email AS user_email,
            users.image AS user_avatar,
            content_images.image_url
          FROM contents
          JOIN users ON contents.user_id = users.id
          LEFT JOIN content_images ON contents.id = content_images.content_id
          ORDER BY contents.id DESC
        `);

        // Group by content_id
        const contentMap = {};

        for (const row of rows) {
          if (!contentMap[row.content_id]) {
            contentMap[row.content_id] = {
              id: row.content_id,
              title: row.title,
              content: row.content,
              created_at: row.content_created_at,
              user: {
                id: row.user_id,
                name: row.user_name,
                email: row.user_email,
                avatar: row.user_avatar,
              },
              images: [],
            };
          }

          if (row.image_url) {
            contentMap[row.content_id].images.push(row.image_url);
          }
        }

        const result = Object.values(contentMap);
        return res.json(result);
      } catch (error) {
        console.error("エラー:", error);
        return res.status(500).json({ message: "サーバーエラー", error: true });
      }
    },
  };
};
