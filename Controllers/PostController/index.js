module.exports = (db) => {
  return {
    save: async (req, res) => {
      try {
        const { user_id, title, content } = req.body;

        const insertQuery = `
            INSERT INTO contents (user_id, created_at, updated)
            VALUES (?, NOW(), NOW())
          `;
        const [result] = await db.query(insertQuery, [user_id]);

        const insertedId = result.insertId;

        const secondInsertQuery = `
            INSERT INTO content_comments (content_id, user_id, comment, created_at, updated)
            VALUES (?, ?, ?, NOW(), NOW())
          `;

        await db.query(secondInsertQuery, [insertedId, user_id, content]);

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
            contents.created_at AS content_created_at,
            
            users.id AS user_id,
            users.name AS user_name,
            users.email AS user_email,
            users.image AS user_avatar,
    
            content_images.image_url,
    
            content_comments.id AS comment_id,
            content_comments.comment,
            content_comments.created_at AS comment_created_at,
    
            comment_users.id AS comment_user_id,
            comment_users.name AS comment_user_name,
            comment_users.image AS comment_user_avatar
    
          FROM contents
          JOIN users ON contents.user_id = users.id
          LEFT JOIN content_images ON contents.id = content_images.content_id
          LEFT JOIN content_comments ON contents.id = content_comments.content_id
          LEFT JOIN users AS comment_users ON content_comments.user_id = comment_users.id
          ORDER BY contents.id DESC, content_comments.created_at ASC
        `);

        // Group by content_id
        const contentMap = {};

        for (const row of rows) {
          if (!contentMap[row.content_id]) {
            contentMap[row.content_id] = {
              id: row.content_id,
              created_at: row.content_created_at,
              user: {
                id: row.user_id,
                name: row.user_name,
                email: row.user_email,
                avatar: row.user_avatar,
              },
              images: [],
              comments: [],
            };
          }

          if (
            row.image_url &&
            !contentMap[row.content_id].images.includes(row.image_url)
          ) {
            contentMap[row.content_id].images.push(row.image_url);
          }

          if (row.comment_id) {
            contentMap[row.content_id].comments.push({
              id: row.comment_id,
              comment: row.comment,
              created_at: row.comment_created_at,
              user: {
                id: row.comment_user_id,
                name: row.comment_user_name,
                avatar: row.comment_user_avatar,
              },
            });
          }
        }

        const result = Object.values(contentMap);
        return res.json(result);
      } catch (error) {
        console.error("エラー:", error);
        return res.status(500).json({ message: "サーバーエラー", error: true });
      }
    },
    getComments: async (req, res) => {
      try {
        const { id } = req.params;

        if (!id) {
          return res
            .status(400)
            .json({ message: "content_id is required", error: true });
        }

        const [rows] = await db.query(
          `
          SELECT 
            content_comments.id AS comment_id,
            content_comments.comment,
            content_comments.created_at AS comment_created_at,
    
            users.id AS user_id,
            users.name AS user_name,
            users.image AS user_avatar
    
          FROM content_comments
          JOIN users ON content_comments.user_id = users.id
          WHERE content_comments.content_id = ?
          ORDER BY content_comments.created_at ASC
          `,
          [id]
        );

        const comments = rows.map((row) => ({
          id: row.comment_id,
          comment: row.comment,
          created_at: row.comment_created_at,
          user: {
            id: row.user_id,
            name: row.user_name,
            avatar: row.user_avatar,
          },
        }));

        return res.json(comments);
      } catch (error) {
        console.error("エラー:", error);
        return res.status(500).json({ message: "サーバーエラー", error: true });
      }
    },
    saveComments: async (req, res) => {
      try {
        const { content_id, user_id, comment } = req.body;
        const insertQuery = `
            INSERT INTO content_comments (content_id, user_id, comment, created_at, updated)
            VALUES (?, ?, ?, NOW(), NOW())
          `;

        await db.query(insertQuery, [content_id, user_id, comment]);

        const [rows] = await db.query(`SELECT * FROM contents WHERE id = ?`, [
          content_id,
        ]);

        return res.json({
          message: "保存成功",
          content: rows[0], // Return the newly saved content
        });
      } catch (error) {
        console.error("エラー:", error);
        return res.status(500).json({ message: "サーバーエラー", error: true });
      }
    },
  };
};
