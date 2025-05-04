const router = require("express").Router();
const requireAuth = require("../Middleware/requireAuth");

module.exports = (db) => {
  const followController = require("../Controllers/FollowController")(db);
  router.post("/check", requireAuth, followController.checkFollowStatus);
  router.post("/unfollow", requireAuth, followController.unfollow);
  router.post("/", requireAuth, followController.follow);

  return router;
};
