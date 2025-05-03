const router = require("express").Router();
const requireAuth = require("../Middleware/requireAuth");

module.exports = (db) => {
  const followController = require("../Controllers/FollowController")(db);
  router.post("/", requireAuth, followController.follow);
  router.post("/unfollow", requireAuth, followController.unfollow);
  router.get("/check/:id", requireAuth, followController.checkFollowStatus);

  return router;
};
