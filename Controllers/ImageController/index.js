module.exports = (db) => {
  return {
    save: async (req, res) => {
      try {
        const { image_url, content_id } = req.body;

        if (!Array.isArray(image_url) || !content_id) {
          return res
            .status(400)
            .json({ message: "Invalid input", error: true });
        }

        const insertQuery = `
            INSERT INTO content_images (content_id, image_url, created_at, updated)
            VALUES (?, ?, NOW(), NOW())
          `;

        // Run all inserts in parallel
        const insertPromises = image_url.map((url) =>
          db.query(insertQuery, [content_id, url])
        );

        await Promise.all(insertPromises);

        return res.json({
          message: "保存成功",
          content_id,
          images: image_url,
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
