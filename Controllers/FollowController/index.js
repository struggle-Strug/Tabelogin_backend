module.exports = (db) => {
  return {
    follow: async (req, res) => {
      try {
        const { follower_id, follow_id } = req.body; // Get the follower_id and follow_id from the request body

        // Check if the follower is trying to follow themselves
        if (follower_id === follow_id) {
          return res
            .status(400)
            .json({ message: "You cannot follow yourself." });
        }
        const insertFollowQuery = `INSERT INTO users_mappings (follower_id, follow_id, created_at, updated) VALUES (?, ?, NOW(), NOW())`;
        await db.query(insertFollowQuery, [follower_id, follow_id]);
        return res.status(200).json({ message: "Followed successfully." });
        // }
      } catch (error) {
        console.error("登録エラー:", error);
        return res.status(500).json({ message: "サーバーエラー", error: true });
      }
    },

    unfollow: async (req, res) => {
      try {
        const { follower_id, follow_id } = req.body;

        // Check if the follower is trying to unfollow themselves
        if (follower_id === follow_id) {
          return res
            .status(400)
            .json({ message: "You cannot unfollow yourself." });
        }

        const deleteFollowQuery = `DELETE FROM users_mappings WHERE follower_id = ? AND follow_id = ?`;
        await db.query(deleteFollowQuery, [follower_id, follow_id]);
        return res.status(200).json({ message: "Unfollowed successfully." });
      } catch (error) {
        console.error("アンフォローエラー:", error);
        return res.status(500).json({ message: "サーバーエラー", error: true });
      }
    },

    checkFollowStatus: async (req, res) => {
      try {
        const { follower_id, follow_id } = req.body;
        const checkFollowQuery = `SELECT * FROM users_mappings WHERE follower_id = ? AND follow_id = ?`;
        const [followStatus] = await db.query(checkFollowQuery, [
          follower_id,
          follow_id,
        ]);
        return res.status(200).json({ follow_status: followStatus.length > 0 });
      } catch (error) {
        console.error("フォローステータスチェックエラー:", error);
        return res.status(500).json({ message: "サーバーエラー", error: true });
      }
    },
  };
};
